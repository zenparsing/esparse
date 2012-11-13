"use strict";

// TODO: Use character matching instead of regular expressions?
// Get rid of stringEscapeStrict

var AbstractScanner = require("./AbstractScanner.js").AbstractScanner,
	Unicode = require("./Unicode.js").categories,
	Class = require("./Class.js").Class,
	Keys = require("./Keys.js"),
	KeySet = Keys.KeySet;

var unicodeLetter = Unicode.Lu + Unicode.Ll + Unicode.Lt + Unicode.Lm + Unicode.Lo + Unicode.Nl,
	identifierStart = new RegExp("^[\\\\_$" + unicodeLetter + "]"),
	identifierPart = new RegExp("^[_$\u200c\u200d" + unicodeLetter + Unicode.Mn + Unicode.Mc + Unicode.Nd + Unicode.Pc + "]+"),
	identifierEscape = /\\u([0-9a-fA-F]{4})/g,
	newlineSequence = /\r\n?|[\n\u2028\u2029]/g;

// IE<9 does not recognize "\v",  use "\x0b" instead

var whitespaceChars = new CharSet("\t\x0b\f\uFEFF \u1680\u180E\u202F\u205F\u3000\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A"),
	decimalDigit = new CharSet("0123456789"),
	newlineChars = new CharSet("\r\n\u2028\u2029"),
	punctuatorChars = new CharSet("{}[]().;,<>+-*%&|^!~?:=/"),
	xChars = new CharSet("xX");

var multiCharPunctuators = new KeySet(
	"++", "--", "&&", "||", "<<", ">>", ">>>", "<=", ">=", "!=", "!==", "==", 
	"===", "*=", "&=", "^=", "|=", "<<=", ">>=", ">>>=", "%=", "+=", "-=", "/=",
	"=>", "..", "...");

var reservedWords = new KeySet(
	"break", "case", "catch", "continue", "debugger", "default", "finally", "for", "function",
	"if", "switch", "this", "try", "var", "while", "with", "class", "const", "enum", "export", 
	"extends", "import", "super", "true", "false", "delete", "do", "else", "in", "instanceof", 
	"new", "return", "throw", "typeof", "null", "void");

var strictReservedWords = new KeySet(
	"implements", "let", "private", "public", "interface", "package", 
	"protected", "static", "yeild");
	
var stringEscapeChars = {

	"n": "\n",
	"r": "\r",
	"t": "\t",
	"b": "\b",
	"v": "\x0b",
	"f": "\f",
	"0": "\0"
};

var stringEscape = /([nrtbvf])|x([0-9a-fA-F]{2})|u([0-9a-fA-F]{4})|([0-3][0-7]{0,2}|[4-7][0-7]?)|\r\n|[\s\S]/g,
	stringEscapeStrict = /([nrtbvf0])|x([0-9a-fA-F]{2})|u([0-9a-fA-F]{4})|\r\n|[\s\S]/g,
	numberPattern = /(0[0-7]+)|(?:\.[0-9]+|(?:0|[1-9][0-9]*)(?:\.[0-9]+)?)(?:[eE][+-]?[0-9]+)?/g,
	hexPattern = /0[xX]([0-9a-fA-F]+)/g,
	blockCommentPattern = /\r\n?|[\n\u2028\u2029]|\*\//g;

// Returns a KeySet for each character in the string
function CharSet(str) {

	return new KeySet(str.split(""));
}

var WHITESPACE = 1,
	DECIMAL_DIGIT = 2,
	NEWLINE = 3,
	PUNCTUATOR = 4,
	ASCII_IDENT = 5;
	
var charTable = createCharTable();

// Creates an optimized character lookup table
function createCharTable() {

	var map = {}, i;
	
	whitespaceChars.each(function(k) { map[k] = WHITESPACE; });
	decimalDigit.each(function(k) { map[k] = DECIMAL_DIGIT; });
	newlineChars.each(function(k) { map[k] = NEWLINE; });
	punctuatorChars.each(function(k) { map[k] = PUNCTUATOR; });
	
	for (i = 65; i < 91; ++i)
		map[String.fromCharCode(i)] = ASCII_IDENT;
	
	for (i = 97; i < 123; ++i)
		map[String.fromCharCode(i)] = ASCII_IDENT;
		
	map["_"] = ASCII_IDENT;
	map["$"] = ASCII_IDENT;
	map["\\"] = ASCII_IDENT;
	
	return map;
}

exports.Scanner = new Class(AbstractScanner, {

    constructor: function(input, offset) {
    
        AbstractScanner.call(this, input, offset);
        this.strict = false;
        this.comments = null;
        this.newlineBefore = false;
    },
    
    skip: function() {
    
        var kind;
        
        while (kind = charTable[this.peekChar()]) {
        
            if (kind === WHITESPACE) this.Whitespace();
            else if (kind === NEWLINE) this.Newline();
            else break;
        }
    },
    
	Start: function(context) {
	
		var chr = this.peekChar(),
			kind = charTable[chr];
		
		if (kind === WHITESPACE)
			return this.Whitespace();
		
		if (kind === NEWLINE)
			return this.Newline();
		
		if (kind === DECIMAL_DIGIT) {
		
			if (xChars.has(this.peekChar(1)))
				return this.HexNumber();
			else
				return this.Number();
		}
		
		if (chr === "`" || chr === "}" && context.quasi)
		    return this.Quasi();
		
		if (chr === "." && decimalDigit.has(this.peekChar(1)))
			return this.Number();
		
		if (chr === "'" || chr === '"')
			return this.String();
		
		if (chr === "/") {
		
			var next = this.peekChar(1);
			
			if (next === "/")
				return this.LineComment();
			else if (next === "*")
				return this.BlockComment();
			else if (!context.div)
				return this.RegularExpression();
		}
		
		if (kind === PUNCTUATOR)
			return this.Punctuator();
		
		if (kind === ASCII_IDENT || identifierStart.test(chr))
			return this.Identifier(context);
		
		return this.Error();
	},
	
	Whitespace: function() {
	
		while (whitespaceChars.has(this.peekChar()))
			this.readChar();
		
		return null;
	},
	
	Newline: function() {
		
		this.addLineBreak(this.offset);
		
		var val = this.readChar();
		
		if (val === "\r" && this.peekChar() === "\n")
			val += this.readChar();
		
		this.newlineBefore = true;
		
		return null;
	},
	
	Punctuator: function() {
	
		var str = this.readChar(), 
		    chr,
			next;
		
		while (chr = this.peekChar()) {
		
		    if (multiCharPunctuators.has(next = str + chr)) {
		
                this.readChar();
                str = next;
			
			} else {
			
			    break;
			}
		}
		
		return this.Token(str, str);
	},
	
	Quasi: function() {
	
	    var first = this.readChar(),
	        end = false, 
	        val = "", 
	        chr;
	    
	    while (chr = this.peekChar()) {
	        
	        if (chr === "`") {
	        
	            end = true;
	            break;
	        }
	        
	        if (chr === "$" && this.peekChar(1) === "{") {
	        
	            this.readChar();
	            break;
	        }
	        
	        val += (chr === "\\") ? 
	            this.StringEscape() :
	            this.readChar();
	    }
	    
	    if (!chr)
			this.fail("Unterminated quasi literal");
	    
	    this.readChar();
	    
	    return this.Token("Quasi", val, { quasiEnd: end });
	},
	
	String: function() {
	
		var delim = this.readChar(),
			val = "",
			chr;
		
		while (chr = this.peekChar()) {
		
			if (chr === delim)
				break;
			
			if (newlineChars.has(chr))
				this.fail("Unterminated string literal");
			
			val += (chr === "\\") ? 
				this.StringEscape() : 
				this.readChar();
		}
		
		if (!chr)
			this.fail("Unterminated string literal");
		
		this.readChar();
		
		return this.Token("String", val);
	},
	
	StringEscape: function() {
	
		this.readChar();
		
		var m = this.match(this.strict ? stringEscapeStrict : stringEscape);
		if (!m) return this.Error();
		
		if (m[1]) return stringEscapeChars[m[1]];
		else if (m[2]) return String.fromCharCode(parseInt(m[2], 16));
		else if (m[3]) return String.fromCharCode(parseInt(m[3], 16));
		else if (this.strict && m[4]) return String.fromCharCode(parseInt(m[4], 8));
		else return m[0];
	},
	
	RegularExpression: function() {
	
		this.readChar();
		
		var backslash = false, 
			inClass = false,
			flags = null,
			val = "", 
			chr;
		
		while ((chr = this.readChar())) {
		
			if (newlineChars.has(chr))
				this.fail("Unterminated regular expression literal");
			
			if (backslash) {
			
				val += "\\" + chr;
				backslash = false;
			
			} else if (chr == "[") {
			
				inClass = true;
				val += chr;
			
			} else if (chr == "]" && inClass) {
			
				inClass = false;
				val += chr;
			
			} else if (chr == "/" && !inClass) {
			
				break;
			
			} else if (chr == "\\") {
			
				backslash = true;
				
			} else {
			
				val += chr;
			}
		}
		
		if (!chr)
			this.fail("Unterminated regular expression literal");
		
		if (identifierStart.test(this.peekChar()))
			flags = this.Identifier({ name: true }).value;
		
		return this.Token("RegularExpression", val, { flags: flags });
	},
	
	Number: function() {
	
		var m = this.match(numberPattern);
		if (!m) return this.Error();
		
		if (this.strict && m[1])
		    this.fail("Octal literals are not allowed in strict mode");
		
		return this.Token("Number", m[1] ? parseInt(m[1], 8) : parseFloat(m[0]));
	},
	
	HexNumber: function() {
	
		var m = this.match(hexPattern);
		if (!m) return this.Error();
		
		return this.Token("Number", parseInt(m[1], 16));
	},
	
	Identifier: function(context) {
	
		var str = this.readChar(),
			esc = (str === "\\"),
			type = "Identifier",
			chr;
		
		while (chr = this.peekChar()) {
		
			if (chr === "\\")
				esc = true;
			else if (!identifierPart.test(chr))
				break;
			
			str += this.readChar();
		}
		
		// Process Unicode escape sequences
		if (esc) {
		
			str = str.replace(identifierEscape, function(m, m1) {
				
				return String.fromCharCode(parseInt(m1, 16));
			});
			
			if (str.indexOf("\\") !== -1)
				this.fail("Invalid character in identifier");
		}
		
		if (context.name) type = "IdentifierName";
		else if (reservedWords.has(str)) type = str;
		else if (this.strict && strictReservedWords.has(str)) type = str;
		
		return this.Token(type, str);
	},
	
	LineComment: function() {
	
		var offset = this.search(newlineSequence),
			value;
		
		if (offset < 0)
			offset = this.input.length;
		
		value = this.input.slice(this.offset, offset);
		this.offset = offset;
		
		return this.Comment(value);
	},
	
	BlockComment: function() {
	
		var pattern = blockCommentPattern,
			start = this.offset,
			m;
		
		while (true) {
		
			pattern.lastIndex = this.offset;
			
			m = pattern.exec(this.input);
			if (!m) this.fail("Unterminated block comment");
			
			this.offset = m.index + m[0].length;
			
			if (m[0] === "*/")
				break;
			
			this.newlineBefore = true;
			this.addLineBreak(m.index);
		}
		
		return this.Comment(this.input.slice(start, this.offset));
	},
	
	Comment: function(value) {
	
		if (!this.comments) this.comments = [value];
		else this.comments.push(value);
			
		return null;
	},
	
	Token: function(type, value, obj) {
	
		obj || (obj = {});
		
		obj.type = type;
		obj.value = value;
		obj.newlineBefore = this.newlineBefore;
		
		// TODO: Provide another way to retrieve comments!
		//obj.comments = this.comments;
		
		this.newlineBefore = false;
		this.comments = null;
		
		return obj;
	},
	
	Error: function() {
	
		return this.Token("Error", this.readChar());
	}
});
