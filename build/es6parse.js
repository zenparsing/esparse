(function(fn, deps) { if (typeof MODULE === 'function') MODULE(fn, deps); else if (typeof define === 'function' && define.amd) define(['require', 'exports'].concat(deps), fn); else if (typeof exports !== 'undefined') fn.call(typeof global === 'object' ? global : this, require, exports); else if (typeof window !== 'undefined' && "") fn.call(window, null, window[""] = {}); else fn.call(window || this, null, {}); })(function(require, exports) { 

var __modules = [], __exports = [], __global = this, __undef; 

function __require(i, obj) { 
  var e = __exports[i]; 
  
  if (e !== __undef) 
    return e; 
  
  __modules[i].call(__global, __exports[i] = (obj || {})); 
  
  if (e !== __undef) 
    __exports[i] = e; 
  
  return __exports[i]; 
} 

__modules[0] = function(exports) {
"use strict";

var Parser = __require(1).Parser;

function parse(input, options) {

    var ast = {
        
        input: input,
        root: new Parser().parse(input, options),
        forEachChild: forEachChild,
        replace: function(replacer) { return replace(ast, replacer); }

    };
    
    return ast;
}

function forEachChild(node, fn) {
    
    if (typeof node !== "object" || !node)
        console.log(node);
    
    var keys = Object.keys(node), val, i, j;
    
    for (i = 0; i < keys.length; ++i) {
    
        // Skip parent links
        if (keys[i] === "parentNode")
            continue;
        
        val = node[keys[i]];
        
        // Skip properties whose values are not objects
        if (!val || typeof val !== "object") continue;
        
        if (typeof val.type === "string") {
        
            // Nodes have a "type" property
            fn(val);
        
        } else {
        
            // Iterate arrays
            for (j = 0; j < (val.length >>> 0); ++j)
                if (val[j] && typeof val[j].type === "string")
                    fn(val[j]);
        }
    }
}

function traverse(ast, visitor) {

    function visit(node) {
    
        var recurse = true;
        
        if (visitor[node.type])
            recurse = !!visitor[node.type](node);
        
        if (recurse) {
        
            forEachChild(node, function(child) {
            
                child.parentNode = node;
                visit(child);
                delete child.parentNode;
            });
        }
    }
}

function replace(ast, replacer) {

    if (typeof ast === "string")
        ast = parse(ast);
    
    var input = ast.input,
        $ = { type: "$", root: ast.root, start: 0, end: input.length };
    
    visit($);
    
    return $.innerText;
    
    function visit(node) {
    
        forEachChild(node, function(child) {
        
            child.parentNode = node;
            visit(child);
            delete child.parentNode;
        });
        
        var replaced = true,
            content,
            offset;
        
        if (replacer[node.type])
            content = replacer[node.type](node, ast);
        
        if (typeof content !== "string") {
            
            replaced = false;
            content = "";
            offset = node.start;
        }
        
        forEachChild(node, function(child) {
        
            if (!replaced) {
            
                content += input.slice(offset, child.start);
                content += child.innerText;
                offset = child.end;
            }
            
            delete node.innerText;
            delete node.outerText;
        });
        
        if (!replaced)
            content += input.slice(offset, node.end);
        
        node.innerText = content;
        node.outerText = content;
        
        if (node.previousEnd !== undefined)
            node.outerText = input.slice(node.previousEnd, node.start) + content;
    }
}

exports.parse = parse;
exports.replace = replace;
exports.traverse = traverse;
exports.forEachChild = forEachChild;

};

__modules[1] = function(exports) {
"use strict";

var AbstractParser = __require(2).AbstractParser,
	Scanner = __require(5).Scanner,
	Class = __require(4).Class,
	Transform = __require(8),
	Keys = __require(3),
	KeySet = Keys.KeySet;

var assignmentOp = new KeySet("=", "*=", "/=", "%=", "+=", "-=", ">>=", "<<=", ">>>=", "&=", "^=", "|="),
	unaryOp = new KeySet("delete", "void", "typeof", "!", "~", "+", "-"),
	incrementOp = new KeySet("++", "--"),
	equalityOp = new KeySet("==", "===", "!=", "!=="),
	relationalOp = new KeySet("<=", ">=", ">", "<", "instanceof", "in"),
	relationalOpNoIn = new KeySet("<=", ">=", ">", "<", "instanceof"),
	shiftOp = new KeySet(">>>", ">>", "<<"),
	additiveOp = new KeySet("+", "-"),
	multiplicativeOp = new KeySet("*", "/", "%");

var nameFlags = { name: true, div: false, quasi: false },
	divFlags = { name: false, div: true, quasi: false },
	quasiFlags = { name: true, div: false, quasi: true };

// Returns true if the specified name is a restricted identifier in strict mode
function isPoisonIdent(name) {

    return name === "eval" || name === "arguments";
}

// Function template for left-associative operator expressions
function BinaryOperator(op, higher) {

	var isMap = (typeof op !== "string");
	
	return function(noIn) {
	
		var endNode = this.begin(),
		    expr = this[higher](noIn), 
		    next;
		    
		while (next = this.peekDiv().type) {
		
			if (isMap && !op.has(next) || !isMap && next !== op)
				break;
			
			this.readDiv();
			
			expr = endNode({ 
			
			    type: "BinaryExpression", 
			    operator: next, 
			    left: expr, 
			    right: this[higher](noIn)
			});
		}
		
		return expr;
	};
}

var Parser = new Class(AbstractParser, {

    constructor: function() {
        
        AbstractParser.call(this, Scanner);
    },

	// Contextual Scanning Shortcuts
	readName: function(type) { return this.read(type, nameFlags); },
	peekName: function(index) { return this.peek(index, nameFlags); },
	peekNameUntil: function(type, index) { return this.peekUntil(type, index, nameFlags); },
	
	readDiv: function(type) { return this.read(type, divFlags); },
	peekDiv: function(index) { return this.peek(index, divFlags); },
	peekDivUntil: function(type, index) { return this.peekUntil(type, index, divFlags); },
	
	readQuasi: function() { return this.read("Quasi", quasiFlags); },
	peekQuasi: function(index) { return this.peek(index, quasiFlags); },
	peekQuasiUntil: function(type, index) { return this.peekUntil("Quasi", index, quasiFlags); },
	
	// Contextual Keywords
    readKeyword: function(word) {
    
        var token = this.read();
        
        if (token.type === word || (token.type === "Identifier" && token.value === word))
            return token;
        
        this.fail("Expected keyword '" + word + "'");
    },
    
    peekKeyword: function(word, noNewlineBefore) {
    
        var token = this.peek();
        
        if (token.type === "word")
            return true;
        
        return token.type === word ||
            token.type === "Identifier" && 
            token.value === word && 
            !(noNewlineBefore && token.newlineBefore);
    },
	
	// Checks an assignment target for strict mode restrictions
	checkAssignTarget: function(node) {
	
		if (!this.context.strict)
		    return;
		
		if (node.type === "Identifier" && isPoisonIdent(node.value))
			this.fail("Cannot modify " + node.value + " in strict mode", node);
	},
	
	// Checks a binding identifier for strict mode restrictions
	checkBindingIdent: function(node) {
	
	    var name = node.value;
	    
	    if (this.context.strict && isPoisonIdent(name))
		    this.fail("Binding cannot be created for '" + name + "' in strict mode", node);
	},
	
	// Checks function formal parameters for strict mode restrictions
	checkParameters: function(params) {
	
	    if (!this.context.strict)
	        return;
	    
	    var names = new KeySet(), name, i;
	    
	    for (i = 0; i < params.length; ++i) {
	    
	        if (params[i].type !== "Identifier")
	            continue;
	        
	        name = params[i].value;
	        
	        if (isPoisonIdent(name))
	            this.fail("Parameter name " + name + " is not allowed in strict mode");
	        
	        if (names.has(name))
	            this.fail("Strict mode function may not have duplicate parameter names");
	        
	        names.add(name);
	    }
	},
	
	// Context management
	pushContext: function(isFunction) {
	
		this.context = { 
			
			strict: (this.context ? this.context.strict : false),
			isFunction: isFunction,
			labelSet: {},
			switchDepth: 0
		};
		
		this._contextStack.push(this.context);
		this.scanner.strict = this.context.strict;
	},
	
	popContext: function() {
	
		this._contextStack.pop();
		this.context = this._contextStack[this._contextStack.length - 1];
		this.scanner.strict = this.context ? this.context.strict : false;
	},
	
	setStrictMode: function() {
	
		this.context.strict = true;
		this.scanner.strict = true;
	},
	
	Start: function() {
	
		this._contextStack = [];
		
		this.pushContext(false);
		var node = { type: "Program", body: this.StatementList(true, true) };
		this.popContext();
		
		return node;
	},
	
	// === Expressions ===
	
	Expression: function(noIn) {
	
	    var expr = this.AssignmentExpression(noIn),
	        list = null,
	        next;
		    
		while (this.peekDiv().type === ",") {
		
		    // If the next token after "," is "...", we might be
		    // trying to parse an arrow function formal parameter
		    // list with a trailing rest parameter.  Return the 
		    // expression up to, but not including ",".
		    
		    if (this.peek(1).type === "...")
		        break;
		    
			this.readDiv();
			
			if (list === null) {
			
			    list = [expr];
			    expr = { type: "SequenceExpression", expressions: list };
			}
			
			list.push(this.AssignmentExpression(noIn));
		}
		
		return expr;
	},
	
	AssignmentExpression: function(noIn) {
	
		var left = this.ConditionalExpression(noIn);
		
		// Check for assignment operator
		if (!assignmentOp.has(this.peekDiv().type))
			return left;
		
		// Make sure that left hand side is assignable
		switch (left.type) {
		
			case "MemberExpression":
			case "CallExpression":
				break;
				
			case "Identifier":
				this.checkAssignTarget(left);
				break;
		
			default:
			
			    left = this.transformPattern(left, false);
    			break;
		}
		
		return {
		
		    type: "AssignmentExpression",
		    operator: this.readDiv().type,
		    left: left,
		    right: this.AssignmentExpression(noIn)
		};
	},
	
	SpreadAssignment: function(noIn) {
	
	    var spread = false, expr;
	    
	    if (this.peek().type === "...") {
	    
	        this.read();
	        spread = true;
	    }
	    
	    expr = this.AssignmentExpression(noIn);
	    expr.spread = spread;
	    
	    return expr;
	},
	
	/*
	YieldExpression: function() {
	
	    // TODO:  readKeyword?
	    this.read("yield");
	    
	    var delegate = false;
	    
	    if (this.peek().type === "*") {
	    
	        this.read();
	        delegate = true;
	    }
	    
	    return {
	        type: "YieldExpression",
	        delegate: delegate,
	        expression: this.AssignmentExpression()
	    };
	},
	*/
	
	ConditionalExpression: function(noIn) {
	
		var left = this.OrExpression(noIn),
			middle,
			right;
		
		if (this.peekDiv().type !== "?")
			return left;
		
		this.read("?");
		middle = this.AssignmentExpression();
		this.read(":");
		right = this.AssignmentExpression(noIn);
		
		return {
		
		    type: "ConditionalExpression",
		    test: left,
		    alternate: middle,
		    consequent: right
		};
	},
	
	OrExpression: BinaryOperator("||", "AndExpression"),
	AndExpression: BinaryOperator("&&", "BitwiseOrExpression"),
	BitwiseOrExpression: BinaryOperator("|", "BitwiseXorExpression"),
	BitwiseXorExpression: BinaryOperator("^", "BitwiseAndExpression"),
	BitwiseAndExpression: BinaryOperator("&", "EqualityExpression"),
	EqualityExpression: BinaryOperator(equalityOp, "RelationalExpression"),
	
	RelationalExpression: function(noIn) {
	
		return noIn ? this.RelationalExpressionNoIn() : this.RelationalExpressionIn();
	},
	
	RelationalExpressionIn: BinaryOperator(relationalOp, "ShiftExpression"),
	RelationalExpressionNoIn: BinaryOperator(relationalOpNoIn, "ShiftExpression"),
	
	ShiftExpression: BinaryOperator(shiftOp, "AdditiveExpression"),
	AdditiveExpression: BinaryOperator(additiveOp, "MultiplicativeExpression"),
	MultiplicativeExpression: BinaryOperator(multiplicativeOp, "UnaryExpression"),
	
	UnaryExpression: function() {
	
		var token = this.peek(),
			type = token.type,
			expr;
		
		if (incrementOp.has(type)) {
		
			this.read();
			expr = this.MemberExpression(true);
			this.checkAssignTarget(expr);
			
			return {
			
			    type: "UpdateExpression", 
			    operator: type, 
			    expression: expr,
			    prefix: true
			};
		}
		
		if (unaryOp.has(type)) {
		
			this.read();
			expr = this.UnaryExpression();
			
			if (type === "delete" && this.context.strict && expr.type === "Identifier")
			    this.fail("Cannot delete unqualified property in strict mode", expr);
			
			return {
			
			    type: "UnaryExpression",
			    operator: type,
			    expression: expr
			};
		}
		
		expr = this.MemberExpression(true);
		token = this.peekDiv();
		type = token.type;
		
		// Check for postfix operator
		if (incrementOp.has(type) && !token.newlineBefore) {
		
			this.read();
			this.checkAssignTarget(expr);
			
			return {
			
			    type: "UpdateExpression",
			    operator: type,
			    expression: expr,
			    prefix: false
			};
		}
		
		return expr;
	},
	
	MemberExpression: function(allowCall) {
	
		var endNode = this.begin(),
		    token = this.peek(),
			exit = false,
			prop,
			expr;
		
		expr = 
		    (token.type === "new") ? this.NewExpression() :
		    (token.type === "super") ? this.read() :
		    this.PrimaryExpression();
		
		while (!exit && (token = this.peekDiv())) {
		
			switch (token.type) {
			
				case ".":
				
				    this.read();
				    
				    expr = endNode({ 
				    
                        type: "MemberExpression", 
                        object: expr, 
                        property: this.readName("IdentifierName"),
                        computed: false
                    });
                    
					break;
				
				case "[":
				
				    this.read();
                    prop = this.Expression();
                    this.read("]");
                    
                    expr = endNode({ 
                    
                        type: "MemberExpression", 
                        object: expr, 
                        property: prop,
                        computed: true
                    });
		
					break;
				
				case "(":
					
					if (!allowCall) {
					
					    exit = true;
					    break;
					}
					
                    expr = endNode({
                    
                        type: "CallExpression",
                        callee: expr,
                        arguments: this.ArgumentList()
                    });
                    
                    break;
                
                case "Quasi":
                
                    expr = endNode({
                    
                        type: "TaggedQuasiExpression",
                        tag: expr,
                        quasi: this.QuasiExpresion()
                    });
                    
                    break;
				
				default:
					exit = true;
					break;
			}
		}
		
		return expr;
	},
	
	NewExpression: function() {
	
		this.read("new");
		
		var expr = this.MemberExpression(false),
			args = (this.peekDiv().type === "(") ? this.ArgumentList() : null;
		
		return {
	        type: "NewExpression",
	        callee: expr,
	        arguments: args
	    };
	},
	
	ArgumentList: function() {
	
		var list = [];
		
		this.read("(");
		
		while (this.peekUntil(")")) {
		
			if (list.length > 0)
				this.read(",");
			
			list.push(this.SpreadAssignment());
		}
		
		this.read(")");
		
		return list;
	},
	
	PrimaryExpression: function() {
	
		var type = this.peek().type;
		
		switch (type) {
		    
			case "function": return this.FunctionExpression();
			case "class": return this.ClassExpression();
			case "[": return this.ArrayExpression();
			case "{": return this.ObjectExpression();
			case "(": return this.ParenExpression();
			case "Quasi": return this.QuasiExpression();
			
			case "Identifier":
			
			    return (this.peekDiv(1).type === "=>") ?
			        this.ArrowFunction(this.BindingIdentifier()) :
			        this.read();
			
			case "null": 
		        this.read();
		        return { type: "Null", value: null };
		    
		    case "true": 
		        this.read();
		        return { type: "Boolean", value: true };
		        
		    case "false": 
		        this.read();
		        return { type: "Boolean", value: false };
		        
		    case "this": 
		        this.read();
		        return { type: "ThisExpression" };
		    
			case "Number":
			case "RegularExpression":
			case "String":
			
			    return this.read();
		}
		
		this.fail("Unexpected token " + type);
	},
	
	BindingIdentifier: function() {
	
		var node = this.read("Identifier");
		
		this.checkBindingIdent(node);
		return node;
	},
	
	BindingPattern: function() {
	
	    var node;
	    
	    switch (this.peek().type) {
	    
	        case "{":
	            node = this.ObjectExpression();
	            break;
	        
	        case "[":
	            node = this.ArrayExpression();
	            break;
	        
	        default:
	            node = this.BindingIdentifier();
	            break;
	    }
	    
	    // Transform expressions to patterns
	    if (node.type !== "Identifier")
            node = this.transformPattern(node, true);
        
        return node;
	},
	
	ParenExpression: function() {

	    var expr = null,
	        rest = null;
	    
	    this.read("(");
	    
	    switch (this.peek().type) {
	    
	        // An empty arrow function formal list
	        case ")":
	            break;
	        
	        // An arrow function formal list with a single rest parameter
	        case "...":
	            rest = this.RestParameter();
	            break;
	        
	        // Paren expression
	        default:
	            expr = this.Expression();
	            break;
	    }
	    
	    // Look for a trailing rest formal parameter within an
	    // arrow formal list
	    if (!rest && 
	        this.peek().type === "," && 
	        this.peek(1).type === "...") {
	    
	        this.read();
	        rest = this.RestParameter();
	    }
		
		this.read(")");
		
		// Determine whether this is a paren expression or an arrow function
		if (!expr || rest || this.peekDiv().type === "=>")
		    return this.ArrowFunction(expr, rest);
			
		return expr;
	},
	
	ObjectExpression: function() {
	
		var list = [], 
		    comma = 0,
			nameSet = {};
		
		this.read("{");
		
		while (this.peekNameUntil("}")) {
		
			if (list.length > 0) {
			
				this.read(",");
				++comma;
			}
			
			if (this.peekName().type !== "}")
				list.push(this.PropertyDefinition(nameSet));
		}
		
		this.read("}");
		
		return { 
		    type: "ObjectExpression", 
		    properties: list,
		    trailingComma: comma >= list.length
		};
	},
	
	PropertyDefinition: function(nameSet) {
		
		var flags = 1, node;
		
		this.peekName();
		
		switch (this.peekName(1).type) {
		
		    case "(":
		    case "IdentifierName":
		    case "String":
		    case "Number":
		        
		        node = this.MethodDefinition();
		        
		        switch (node.kind) {
                
                    case "get": flags = 2; break;
                    case "set": flags = 4; break;
                    default: flags = 8; break;
                }
                
                break;
            
            case ":":
                
                node = {
                    type: "PropertyDefinition",
                    name: this.PropertyName(),
                    expression: (this.read(":"), this.AssignmentExpression())
                };
                
                break;
                
            default:
            
                node = {
                    type: "PropertyDefinition",
                    name: this.read("IdentifierName"),
                    expression: null
                };
                
                // TODO: Syntax error if name is a reserved word!
                
                break;
		}
        
        var name = node.name.value;
        
        if (nameSet[name]) {
        
            /*
            
            TODO:
            
            It is a Syntax Error if PropertyNameList of PropertyDefinitionList 
            contains any duplicate enties, unless one of the following conditions 
            are true for each duplicate entry:
            
            1. The source code corresponding to PropertyDefinitionList is not strict 
               code and all occurances in the list of the duplicated entry were 
               obtained from productions of the form 
               PropertyDefinition : PropertyName : AssignmentExpression.
            2. The duplicated entry occurs exactly twice in the list and one 
               occurrence was obtained from a get accessor MethodDefinition and the 
               other occurrence was obtained from a set accessor MethodDefinition.
            
            */
        }
        
        // Set name flags
        nameSet[name] |= flags;
        
        return node;
	},
	
	PropertyName: function() {
	
	    var token = this.readName();
	    
		switch (token.type) {
		
			case "IdentifierName":
			case "String":
			case "Number":
				break;
			
			default:
				this.fail("Unexpected token " + token.type, token);
		}
		
		return token;
	},
	
	MethodDefinition: function() {
	
	    var name = this.PropertyName(),
	        kind = "method";
	    
	    if (name.type === "IdentifierName" && this.peekName().type !== "(") {
	    
	        if (name.value === "get" || name.value === "set") {
	        
	            kind = name.value;
	            name = this.PropertyName();
	        }
	    }
	    
	    return {
	        type: "MethodDefinition",
	        name: name,
	        kind: kind,
	        params: this.FormalParameters(),
	        body: this.FunctionBody()
	    };
	},
	
	ArrayExpression: function() {
	
		var list = [],
			comma = false,
			token;
		
		this.read("[");
		
		while (token = this.peekUntil("]")) {
			
			if (token.type === ",") {
			
				this.read();
				
				if (comma)
					list.push(null);
				
				comma = true;
			
			} else {
			
				list.push(this.SpreadAssignment());
				comma = false;
			}
		}
		
		this.read("]");
		
		return { 
		    type: "ArrayExpression", 
		    elements: list, 
		    trailingComma: comma
		};
	},
	
	QuasiExpression: function() {
	
	    var token = this.read("Quasi"),
	        lit = [ token ],
	        sub = [];
	    
	    while (!token.quasiEnd) {
	    
	        sub.push(this.Expression());
	        
	        // Discard any tokens that have been scanned so that we can 
	        // rescan contextually.
	        this.unpeek();
	        
	        lit.push(token = this.readQuasi());
	    }
	    
	    return { type: "QuasiExpression", literals: lit, substitutions: sub };
	},
	
	// === Statements ===
	
	Statement: function() {
	
		switch (this.peek().type) {
			
			case "Identifier":
			
				return (this.peekDiv(1).type === ":") ?
					this.LabelledStatement() :
					this.ExpressionStatement();
			
			case "{": return this.Block();
			case ";": return this.EmptyStatement();
			case "var": return this.VariableStatement();
			case "return": return this.ReturnStatement();
			case "break":
			case "continue": return this.BreakOrContinueStatement();
			case "throw": return this.ThrowStatement();
			case "debugger": return this.DebuggerStatement();
			case "if": return this.IfStatement();
			case "do": return this.DoStatement();
			case "while": return this.WhileStatement();
			case "for": return this.ForStatement();
			case "with": return this.WithStatement();
			case "switch": return this.SwitchStatement();
			case "try": return this.TryStatement();
			
			default: return this.ExpressionStatement();
		}
	},
	
	StatementWithLabel: function(label) {
	
		var name = label && label.value || "",
			labelSet = this.context.labelSet,
			stmt;
		
		if (!labelSet[name]) labelSet[name] = 1;
		else if (label) this.fail("Invalid label", label);
		
		labelSet[name] += 1;
		stmt = this.Statement();
		labelSet[name] -= 1;
		
		return stmt;
	},
	
	Block: function() {
		
		var list;
		
		this.read("{");
		list = this.StatementList(false);
		this.read("}");
		
		return { type: "Block", body: list };
	},
	
	Semicolon: function() {
	
		var token = this.peek(),
			type = token.type;
		
		if (type === ";" || !(type === "}" || type === "eof" || token.newlineBefore))
			this.read(";");
	},
	
	LabelledStatement: function() {
	
	    var label = this.read("Identifier");
		
		this.read(":");
		
		return { 
		    type: "LabelledStatement", 
		    label: label, 
		    statement: this.StatementWithLabel(label)
		};
	},
	
	ExpressionStatement: function() {
	
		var expr = this.Expression();
		
		this.Semicolon();
		return { type: "ExpressionStatement", expression: expr };
	},
	
	EmptyStatement: function() {
	
		this.Semicolon();	
		return { type: "EmptyStatement" };
	},
	
	VariableStatement: function() {
	
		var node = this.VariableDeclaration(false);
		
		this.Semicolon();
		return node;
	},
	
	VariableDeclaration: function(noIn) {
	
		var kind = this.read().type,
		    list = [];
		
		switch (kind) {
		
		    case "var":
		    case "let":
		    case "const":
		        break;
		        
		    default:
		        this.fail("Expected var, const, or let");
		}
		
		while (true) {
		
			list.push(this.VariableDeclarator(noIn));
			
			if (this.peek().type === ",") this.read();
			else break;
		}
		
		return { type: "VariableDeclaration", declarations: list, kind: kind };
	},
	
	VariableDeclarator: function(noIn) {
	
		var pattern = this.BindingPattern(),
			init = null;
		
		if (pattern.type !== "Identifier" || 
		    this.peek().type === "=") {
		
			this.read("=");
			init = this.AssignmentExpression(noIn);
		}
		
		return { type: "VariableDeclarator", pattern: pattern, init: init };
	},
	
	MaybeEnd: function() {
	
		var token = this.peek();
		
		if (!token.newlineBefore) {
			
			switch (token.type) {
			
				case "eof":
				case "}":
				case ";":
					break;
				
				default:
					return true;
			}
		}
		
		return false;
	},
	
	ReturnStatement: function() {
	
		if (!this.context.isFunction)
			this.fail("Return statement outside of function");
		
		this.read("return");
		var init = this.MaybeEnd() ? this.Expression() : null;
		this.Semicolon();
		
		return { type: "ReturnStatement", argument: init };
	},
	
	BreakOrContinueStatement: function() {
	
		var token = this.read(),
			keyword = token.value,
			labelSet = this.context.labelSet,
			label;
		
		label = this.MaybeEnd() ? this.read("Identifier") : null;
		this.Semicolon();
		
		if (label) {
		
			if (!labelSet[label.value])
				this.fail("Invalid label", label);
		
		} else {
		
			if (!labelSet[""] && !(keyword === "break" && this.context.switchDepth > 0))
				this.fail("Invalid " + keyword + " statement", token);
		}
		
		return { type: keyword === "break" ? "Break" : "Continue", label: label };
	},
	
	ThrowStatement: function() {
	
		this.read("throw");
		
		var expr = this.MaybeEnd() ? this.Expression() : null;
		
		if (expr === null)
			this.fail("Missing throw expression");
		
		this.Semicolon();
		
		return { type: "ThrowStatement", expression: expr };
	},
	
	DebuggerStatement: function() {
	
		this.read("debugger");
		this.Semicolon();
		
		return { type: "DebuggerStatement" };
	},
	
	IfStatement: function() {
	
		this.read("if");
		
		var cond = this.ParenExpression(),
			body = this.Statement(),
			elseBody = null;
		
		if (this.peek().type === "else") {
		
			this.read("else");
			elseBody = this.Statement();
		}
		
		return { 
		    type: "IfStatement", 
		    test: cond, 
		    consequent: body, 
		    alternate: elseBody
		};
	},
	
	DoStatement: function() {
	
		var body, cond;
		
		this.read("do");
		body = this.StatementWithLabel();
		
		this.read("while");
		cond = this.ParenExpression();
		
		// No semicolon required for ES6
		
		return { type: "DoStatement", body: body, test: cond };
	},
	
	WhileStatement: function() {
	
		this.read("while");
		
		return {
		    type: "WhileStatement",
		    test: this.ParenExpression(),
		    body: this.StatementWithLabel()
		};
	},
	
	ForStatement: function() {
	
		this.read("for");
		this.read("(");
		
		var next = this.peek(),
		    init = null;
		
		if (next.type !== ";") {
		
		    // Get loop initializer
		    switch (next.type) {
		    
		        case "var":
		        case "let":
		        case "const":
		            init = this.VariableDeclaration(true);
		            break;
		        
		        default:
		            init = this.Expression(true);
		            break;
		    }
		}
		
		next = this.peek();
		
		// If loop is a for-in or a for-of loop...
		if (next.type === "in" || 
		    next.type === "Identifier" && next.value === "of") {
		
		    this.read();
		    
		    // TODO: Verify that init is valid
		    
		    var type = next.type === "in" ? "ForInStatement" : "ForOfStatement",
		        expr = this.Expression();
		    
		    this.read(")");
		    
		    return {
		        type: type,
		        left: init,
		        right: expr,
		        body: this.StatementWithLabel()
		    };
		
		} else {
		
			var cond, step;
			
			this.read(";");
			cond = (this.peek().type === ";") ? null : this.Expression();
			
			this.read(";");
			step = (this.peek().type === ")") ? null : this.Expression();
			
			this.read(")");
			
			return {
			    type: "ForStatement",
			    init: init,
			    test: cond,
			    update: step,
			    body: this.StatementWithLabel()
			};
		}
		
	},
	
	WithStatement: function() {
	
		if (this.context.strict)
			this.fail("With statement is not allowed in strict mode");
		
		this.read("with");
		
		return {
		    type: "WithStatement",
		    object: this.ParenExpression(),
		    body: this.Statement()
		};
	},
	
	SwitchStatement: function() {
	
		this.read("switch");
		
		var head = this.ParenExpression(),
			hasDefault = false,
			cases = [],
			node;
		
		this.read("{");
		this.context.switchDepth += 1;
		
		while (this.peekUntil("}")) {
		
			node = this.Case();
			
			if (node.test === null) {
			
				if (hasDefault)
					this.fail("Switch statement cannot have more than one default");
				
				hasDefault = true;
			}
			
			cases.push(node);
		}
		
		this.context.switchDepth -= 1;
		this.read("}");
		
		return {
		    type: "SwitchStatement",
		    descriminant: head,
		    cases: cases
		};
	},
	
	Case: function() {
	
		var expr = null, 
			list = [],
			token;
		
		if (this.peek().type === "default") {
		
			this.read("default");
		
		} else {
		
			this.read("case");
			expr = this.Expression();
		}
		
		this.read(":");
		
		while (token = this.peekUntil("}")) {
		
			if (token.type === "case" || token.type === "default")
				break;
			
			list.push(this.Statement());
		}
		
		return {
		    type: "SwitchCase",
		    test: expr,
		    consequent: list
		};
	},
	
	TryStatement: function() {
	
		this.read("try");
		
		var tryBlock = this.Block(),
			catches = [],
			fin = null;
		
		while (this.peek().type === "catch")
			catches.push(this.Catch());
		
		if (this.peek().type === "finally") {
		
			this.read("finally");
			fin = this.Block();
		}
		
		return {
		    type: "TryStatement",
		    block: tryBlock,
		    handlers: catches,
		    finalizer: fin
		};
	},
	
	Catch: function() {
	
		this.read("catch");
		this.read("(");
		
		var name = this.BindingPattern();
		
		this.read(")");
		
		return {
		    type: "CatchClause",
		    param: name,
		    body: this.Block()
		};
	},
	
	// === Declarations ===
	
	StatementList: function(prologue, moduleBody) {
	
		var list = [],
			element,
			tok,
			str,
			dir;
		
		while (tok = this.peekUntil("}")) {
		
			list.push(element = this.Declaration(module));
			
			// Check for directives
            if (prologue && 
                element.type === "ExpressionStatement" &&
                element.expression.type === "String") {
                
                // Get the non-escaped literal text of the string
                tok = element.expression;
                dir = this.input.slice(tok.start + 1, tok.end - 1);
                
                // Check for strict mode
                if (dir === "use strict")
                    this.setStrictMode();
            }
            
            prologue = false;
		}
		
		return list;
	},
	
	Declaration: function(module) {
	
	    var tok = this.peek(),
	        next;
	    
	    switch (tok.type) {
		    
            case "function": return this.FunctionDeclaration();
            case "class": return this.ClassDeclaration();
            case "let": 
            case "const": return this.LexicalDeclaration();
            
            case "import":
                
                if (module) 
                    return this.ImportDeclaration();
                
                break;
            
            case "export":
                
                if (module)
                    return this.ExportDeclaration();
                
                break;
            
            case "Identifier":
                
                if (this.peekModule())
                    return this.ModuleDeclaration();
                
                break;
        }
        
        return this.Statement();
	},
	
	LexicalDeclaration: function() {
	
	    var node = this.VariableDeclaration(false);
		
		this.Semicolon();
		return node;
	},
	
	// === Functions ===
	
	FunctionDeclaration: function() {
	
		this.read("function");
		
		return { 
		    type: "FunctionDeclaration", 
		    id: this.BindingIdentifier(),
		    params: this.FormalParameters(),
		    body: this.FunctionBody()
		};
	},
	
	FunctionExpression: function() {
	
		this.read("function");
		
		return { 
		    type: "FunctionExpression", 
		    id: (this.peek().type !== "(" ? this.BindingIdentifier() : null),
		    params: this.FormalParameters(),
		    body: this.FunctionBody()
		};
	},
	
	FormalParameters: function() {
	
		var list = [];
		
		this.read("(");
		
		while (this.peekUntil(")")) {
			
			if (list.length > 0)
				this.read(",");
			
			// Parameter list may have a trailing rest parameter
			if (this.peek().type === "...") {
			
			    list.push(this.RestParameter());
			    break;
			}
			
			list.push(this.FormalParameter());
		}
		
		this.read(")");
		
		return list;
	},
	
	FormalParameter: function() {
	
	    var pattern = this.BindingPattern(),
			init = null;
		
		if (this.peek().type === "=") {
		
			this.read("=");
			init = this.AssignmentExpression();
		}
		
		return { type: "FormalParameter", pattern: pattern, init: init };
	},
	
	RestParameter: function() {
	
	    this.read("...");
	    
	    return { 
	        type: "FormalParameter", 
	        id: this.BindingIdentifier(),
	        rest: true
	    };
	},
	
	FunctionBody: function() {
    
		this.pushContext(true);
		
		this.read("{");
		var node = { type: "FunctionBody", statements: this.StatementList(true) };
		this.read("}");
		
		this.popContext();
		
		return node;
	},
	
	ArrowFunction: function(formals, rest) {
	
	    this.read("=>");
	    
	    var params = this.transformFormals(formals), 
	        body;
	    
	    if (rest)
	        params.push(rest);
	    
        body = this.peek().type === "{" ?
            this.FunctionBody() :
            this.AssignmentExpression();
		
		return {
		    type: "ArrowFunction",
		    params: params,
		    body: body
		};
	},
	
	// === Modules ===
	
	peekModule: function() {
	
	    if (this.peek().value === "module") {
        
            var p = this.peekDiv(1);
            return (p.type === "Identifier" && !p.newlineBefore);
        }
        
        return false;
	},
	
	ModuleBody: function() {
	
	    this.pushContext(false);
	    
	    this.read("{");
		var node = { type: "ModuleBody", statements: this.StatementList(true, true) };
		this.read("}");
		
		this.popContext();
		
		return node;
	},
	
	ModuleDeclaration: function() {
	    
	    this.readKeyword("module");
	    
	    var id = this.BindingIdentifier(),
	        from = null,
	        body = null;
	    
	    if (this.peek().type === "=") {
	    
	        this.read();
	        from = this.ModuleSpecifier();
	        this.Semicolon();
	        
    	} else {
    	
    	    body = this.ModuleBody();
    	}
	    
	    return { 
	        type: "ModuleDeclaration", 
	        id: id, 
	        from: from,
	        body: body
	    };
	},
	
	ImportDeclaration: function() {
	
	    this.read("import");
	    
	    var binding, from;
	    
	    switch (this.peek().type) {
	    
	        case "*":
	            binding = this.read();
	            break;
	        
	        case "{":
	            binding = this.ImportSpecifierSet();
	            break;
	        
	        default:
	            binding = this.BindingIdentifier();
	            break;
	    }

	    this.readKeyword("from");
	    
	    from = this.ModuleSpecifier();
	    this.Semicolon();
	    
	    return { 
	        type: "ImportDeclaration", 
	        binding: binding, 
	        from: from 
	    };
	},
	
	ImportSpecifierSet: function() {
	    
	    var list = [];
	    
	    this.read("{");
	    
	    while (true) {
	    
	        list.push(this.ImportSpecifier());
	        
	        if (this.peekDiv().type === ",") this.read();
	        else break;
	    }
	    
	    this.read("}");
	    
	    return { type: "ImportSpecifierSet", specifiers: list };
	},
	
	ImportSpecifier: function() {
	
	    var name = this.read("Identifier"),
            id = null;
        
        if (this.peek().type === ":") {
        
            this.read();
            id = this.BindingIdentifier();
        }
        
        return { type: "ImportSpecifier", name: name, id: id };
	},
	
	ExportDeclaration: function() {
	
	    this.read("export");
	    
	    var tok = this.peek(),
	        from = null,
	        binding;
	    
	    switch (tok.type) {
	    
	        case "*":
	        
	            binding = this.read();
	            
	            if (this.peekKeyword("from", true)) {
	            
	                this.read();
	                from = this.ModuleSpecifier();
	            }
	            
	            this.Semicolon();
	            
	            break;
	            
	        case "var":
	        case "let":
	        case "const":
	        
	            this.read();
	            binding = this.VariableDeclarator(false);
	            this.Semicolon();
	            
	            break;
	        
	        case "function":
	        
	            binding = this.FunctionDeclaration();
	            break;
	        
	        case "class":
	        
	            binding = this.ClassDeclaration();
	            break;
	        
	        case "Identifier":
	        
	            if (this.peekModule()) {
	            
	                binding = this.ModuleDeclaration();
	            
	            } else {
	            
	                binding = this.read();
	                this.Semicolon();
	            }
	            
	            break;
	        
	        default:
	        
	            binding = this.ExportSpecifierSet();
	            this.Semicolon();
	            break;
	    }
	    
	    return { 
	        type: "ExportDeclaration", 
	        binding: binding,
	        from: from
	    };
	},
	
	ExportSpecifierSet: function() {
	
        var list = [];
	    
	    this.read("{");
	    
	    while (true) {
	    
	        list.push(this.ExportSpecifier());
	        
	        if (this.peekDiv().type === ",") this.read();
	        else break;
	    }
	    
	    this.read("}");
	    
	    return { type: "ExportSpecifierSet", specifiers: list };
	},
	
	ExportSpecifier: function() {
	
	    var id = this.read("Identifier"),
	        from = null;
	        
        if (this.peek().type === ":") {
        
            this.read();
            from = this.ModulePath();
        }
	    
	    return { type: "ExportSpecifier", id: id, from: from };
	},
	
	ModuleSpecifier: function() {
	
	    return this.peek().type !== "Identifier" ?
	        this.read("String") :
	        this.ModulePath();
	},
	
	ModulePath: function() {
	
	    var path = [];
	    
	    while (true) {
	    
	        path.push(this.read("Identifier"));
	        
	        if (this.peekDiv().type === ".") this.read();
	        else break;
	    }
	    
	    return { type: "Path", elements: path };
	},
	
	// === Classes ===
	
	ClassDeclaration: function() {
	
	    this.read("class");
	    
	    return this.ClassLiteral("ClassDeclaration", this.BindingIdentifier());
	},
	
	ClassExpression: function() {
	
	    this.read("class");
	    
	    var id = null;
	    
	    if (this.peek().type === "Identifier")
	        id = this.BindingIdentifier();
	    
	    return this.ClassLiteral("ClassExpression", id);
	},
	
	ClassLiteral: function(type, id) {
	
	    var base = null;
	    
	    if (this.peek().type === "extends") {
	    
	        this.read();
	        base = this.AssignmentExpression();
	    }
	    
	    return {
	        type: type,
	        id: id,
	        base: base,
	        body: this.ClassBody()
	    };
	},
	
	ClassBody: function() {
	
	    var nameSet = {}, list = [];
	    
	    this.read("{");
		
		while (this.peekNameUntil("}"))
            list.push(this.ClassElement(nameSet));
		
		this.read("}");
		
		return {
		    type: "ClassBody",
		    elements: list
		};
	},
	
	ClassElement: function(nameSet) {
	
	    var node = this.MethodDefinition();
	    
	    /*
	    
	    TODO: It is a Syntax Error if MethodNameList of ClassStatementList contains 
	    any duplicate enties, unless the following condition is true for each 
	    duplicate entry: The duplicated entry occurs exactly twice in the list 
	    and one occurrence was obtained from a get accessor MethodDefinition and 
	    the other occurrence was obtained from a set accessor MethodDefinition.
	    
	    */
	    
	    return node;
	}
	
	
});

// Add transformation methods
Keys.set(Parser.prototype, Transform.methods);

exports.Parser = Parser;
};

__modules[2] = function(exports) {
"use strict";

var Keys = __require(3),
    Class = __require(4).Class;

function wrapMethod(f) {

    return function(a, b, c) {
    
        return this.begin()(f.call(this, a, b, c));
    };
}

exports.AbstractParser = new Class(null, {

    constructor: function(Scanner) {
    
        var key, c;
        
        for (key in this) {
        
            c = key.charAt(0);
            
            if (typeof this[key] === "function") {
                
                var c = key.charAt(0);
                
                this[key] = c.toUpperCase() === c ?
                    wrapMethod(this[key]) :
                    this[key];
            }
        }
        
        this.Scanner = Scanner || null;
        this.offset = 0;
        this.input = "";
    },

	parse: function(scanner) {
	
		if (typeof scanner === "string")
			scanner = new (this.Scanner)(scanner);
		
		this.scanner = scanner;
		this.offset = scanner.offset;
		this.input = scanner.input;
		
		this.queue = [];
		
		return this.Start();
	},

	read: function(type, context) {
	
		var token = (this.queue.length > 0) ?
			this.queue.shift() :
			this.scanner.read(context);
		
		this.offset = token.end;
		
		if (type && token.type !== type)
			this.fail("Expected " + type, token);
		
		return token;
	},
	
	peek: function(index, context) {
		
		index = (index || 0);
		
		if (index > this.queue.length)
		    throw new Error("Invalid peek offset.");
		    
		if (index === this.queue.length)
			this.queue.push(this.scanner.read(context));
		
		return this.queue[index];
	},
	
	peekUntil: function(type, index, context) {
	
		var token = this.peek(index, context);
		return (token.type !== "eof" && token.type !== type) ? token : null;
	},
	
	unpeek: function() {
	
	    if (this.queue.length > 0) {
	    
	        this.scanner.offset = this.queue[0].start;
	        this.queue.length = 0;
	    }
	},
	
	begin: function() {
	
	    var prevEnd = this.offset, 
            start,
            me = this;
        
        if (this.queue.length === 0) {
        
            this.scanner.skip();
            start = this.scanner.offset;
        
        } else {
        
            start = this.queue[0].start;
        }
        
	    return function(node) {
	    
	        if (node && node.type) {
            
                node.start = start;
                node.previousEnd = prevEnd;
                node.end = me.offset;
            }
            
	        return node;
	    };
	},
	
	position: function(offset) {
	
	    return this.scanner.position(offset);
	},
	
	fail: function(msg, token) {
	
		token = token || this.peek();
		
		var pos = this.scanner.position(token.start);
		
		throw new SyntaxError(msg + " (line " + pos.line + ")");
	}
	
});

};

__modules[3] = function(exports) {
"use strict";

var HOP = Object.prototype.hasOwnProperty;

function hasKey(obj, k) {

    return HOP.call(obj, k); 
}

function setKeys(a, b) {

	Object.keys(b).forEach(function(k) { a[k] = b[k]; });
	return a;
}

function addKeys(a, b) {
	
	Object.keys(b).forEach(function(k) {
		
		if (a[k] === undefined)
			a[k] = b[k];
	});
	
	return a;
}

function eachKey(obj, fn) {

	Object.keys(obj).forEach(fn);
}

function KeySet(a) {

	if (typeof a !== "object")
		a = arguments;
	
	for (var i = 0; i < a.length; ++i)
		this[a[i]] = 1;
}

KeySet.prototype = {

	has: function(key) { return (this[key] === 1); },
	add: function(key) { this[key] = 1; },
	remove: function(key) { this[key] = 0; },
	each: function(fn) { eachKey(this, fn); }
};


exports.has = hasKey;
exports.add = addKeys;
exports.set = setKeys;
exports.each = eachKey;
exports.KeySet = KeySet;
};

__modules[4] = function(exports) {
"use strict";

var setKeys = __require(3).set;

// Creates a "class"
function Class(base, def) {
	
	var proto, ctor;
	
	// Create prototype object
	proto = setKeys(Object.create(base ? base.prototype : null), def);
	
	// Create constructor if none provided
	ctor = def.constructor || function() {};
	
	// Set constructor's prototype
	ctor.prototype = proto;
	
	return ctor;
}

exports.Class = Class;
};

__modules[5] = function(exports) {
"use strict";

// TODO: Use character matching instead of regular expressions?
// Get rid of stringEscapeStrict

var AbstractScanner = __require(6).AbstractScanner,
	Unicode = __require(7).categories,
	Class = __require(4).Class,
	Keys = __require(3),
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

    constructor: function(input) {
    
        AbstractScanner.call(this, input);
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

};

__modules[6] = function(exports) {
"use strict";

var Class = __require(4).Class;

var defaultContext = {};

// Performs a binary search on an array
function binarySearch(array, val) {

	var right = array.length - 1,
		left = 0,
		mid,
		test;
	
	while (left <= right) {
		
		mid = (left + right) >> 1;
		test = array[mid];
		
		if (val > test) left = mid + 1;
		else if (val < test) right = mid - 1;
		else return mid;
	}
	
	return left;
}

exports.AbstractScanner = new Class(null, {

    constructor: function(input) {
    
        this.input = input;
        this.offset = 0;
        this.length = input.length;
    
        this._lines = [-1];
        this._noContext = {};
    },
    
    skip: function() {},
    
	read: function(context) {

		context || (context = defaultContext);
		
		var token = null, 
			start;
		
		while (!token) {
		
			start = this.offset;
			token = (start >= this.length) ? this.Token("eof", "") : this.Start(context);
		}
		
		token.start = start;
		token.end = this.offset;
		
		return token;
	},
	
	readChar: function() {
	
		return this.input.charAt(this.offset++);
	},
	
	peekChar: function(index) {
	
		return this.input.charAt(this.offset + (index || 0));
	},
	
	search: function(pattern) {
	
		pattern.lastIndex = this.offset;
		var m = pattern.exec(this.input);
		
		return m ? m.index : -1;
	},
	
	match: function(pattern) {
	
		pattern.lastIndex = this.offset;
		
		var m = pattern.exec(this.input);
		
		if (m && m.index !== this.offset)
			m = null;
		
		if (m)
			this.offset += m[0].length;
		
		return m;
	},
	
	fail: function(msg) {
	
		throw new Error(msg);
	},

	position: function(offset) {
	
		if (offset === undefined)
			offset = this.offset;
		
		var i = binarySearch(this._lines, offset);
		
		return { 
		
			offset: offset, 
			line: i, 
			col: offset - this._lines[i - 1]
		};
	},
	
	addLineBreak: function(offset) {
	
		this._lines.push(offset);
	},
	
	Token: function(type, value) { 
	
		return { type: type, value: value };
	}
	
});

};

__modules[7] = function(exports) {
"use strict";

var Keys = __require(3);

// The following list is not complete.  It only contains the categories that are
// relavant for javascript.

exports.categories = expand({

	Ll: "0061-007A00AA00B500BA00DF-00F600F8-00FF01010103010501070109010B010D010F01110113011501170119011B011D011F01210123012501270129012B012D012F01310133013501370138013A013C013E014001420144014601480149014B014D014F01510153015501570159015B015D015F01610163016501670169016B016D016F0171017301750177017A017C017E-0180018301850188018C018D019201950199-019B019E01A101A301A501A801AA01AB01AD01B001B401B601B901BA01BD-01BF01C601C901CC01CE01D001D201D401D601D801DA01DC01DD01DF01E101E301E501E701E901EB01ED01EF01F001F301F501F901FB01FD01FF02010203020502070209020B020D020F02110213021502170219021B021D021F02210223022502270229022B022D022F02310233-0239023C023F0240024202470249024B024D024F-02930295-02AF037103730377037B-037D039003AC-03CE03D003D103D5-03D703D903DB03DD03DF03E103E303E503E703E903EB03ED03EF-03F303F503F803FB03FC0430-045F04610463046504670469046B046D046F04710473047504770479047B047D047F0481048B048D048F04910493049504970499049B049D049F04A104A304A504A704A904AB04AD04AF04B104B304B504B704B904BB04BD04BF04C204C404C604C804CA04CC04CE04CF04D104D304D504D704D904DB04DD04DF04E104E304E504E704E904EB04ED04EF04F104F304F504F704F904FB04FD04FF05010503050505070509050B050D050F05110513051505170519051B051D051F0521052305250561-05871D00-1D2B1D62-1D771D79-1D9A1E011E031E051E071E091E0B1E0D1E0F1E111E131E151E171E191E1B1E1D1E1F1E211E231E251E271E291E2B1E2D1E2F1E311E331E351E371E391E3B1E3D1E3F1E411E431E451E471E491E4B1E4D1E4F1E511E531E551E571E591E5B1E5D1E5F1E611E631E651E671E691E6B1E6D1E6F1E711E731E751E771E791E7B1E7D1E7F1E811E831E851E871E891E8B1E8D1E8F1E911E931E95-1E9D1E9F1EA11EA31EA51EA71EA91EAB1EAD1EAF1EB11EB31EB51EB71EB91EBB1EBD1EBF1EC11EC31EC51EC71EC91ECB1ECD1ECF1ED11ED31ED51ED71ED91EDB1EDD1EDF1EE11EE31EE51EE71EE91EEB1EED1EEF1EF11EF31EF51EF71EF91EFB1EFD1EFF-1F071F10-1F151F20-1F271F30-1F371F40-1F451F50-1F571F60-1F671F70-1F7D1F80-1F871F90-1F971FA0-1FA71FB0-1FB41FB61FB71FBE1FC2-1FC41FC61FC71FD0-1FD31FD61FD71FE0-1FE71FF2-1FF41FF61FF7210A210E210F2113212F21342139213C213D2146-2149214E21842C30-2C5E2C612C652C662C682C6A2C6C2C712C732C742C76-2C7C2C812C832C852C872C892C8B2C8D2C8F2C912C932C952C972C992C9B2C9D2C9F2CA12CA32CA52CA72CA92CAB2CAD2CAF2CB12CB32CB52CB72CB92CBB2CBD2CBF2CC12CC32CC52CC72CC92CCB2CCD2CCF2CD12CD32CD52CD72CD92CDB2CDD2CDF2CE12CE32CE42CEC2CEE2D00-2D25A641A643A645A647A649A64BA64DA64FA651A653A655A657A659A65BA65DA65FA663A665A667A669A66BA66DA681A683A685A687A689A68BA68DA68FA691A693A695A697A723A725A727A729A72BA72DA72F-A731A733A735A737A739A73BA73DA73FA741A743A745A747A749A74BA74DA74FA751A753A755A757A759A75BA75DA75FA761A763A765A767A769A76BA76DA76FA771-A778A77AA77CA77FA781A783A785A787A78CFB00-FB06FB13-FB17FF41-FF5A",
	Lu: "0041-005A00C0-00D600D8-00DE01000102010401060108010A010C010E01100112011401160118011A011C011E01200122012401260128012A012C012E01300132013401360139013B013D013F0141014301450147014A014C014E01500152015401560158015A015C015E01600162016401660168016A016C016E017001720174017601780179017B017D018101820184018601870189-018B018E-0191019301940196-0198019C019D019F01A001A201A401A601A701A901AC01AE01AF01B1-01B301B501B701B801BC01C401C701CA01CD01CF01D101D301D501D701D901DB01DE01E001E201E401E601E801EA01EC01EE01F101F401F6-01F801FA01FC01FE02000202020402060208020A020C020E02100212021402160218021A021C021E02200222022402260228022A022C022E02300232023A023B023D023E02410243-02460248024A024C024E03700372037603860388-038A038C038E038F0391-03A103A3-03AB03CF03D2-03D403D803DA03DC03DE03E003E203E403E603E803EA03EC03EE03F403F703F903FA03FD-042F04600462046404660468046A046C046E04700472047404760478047A047C047E0480048A048C048E04900492049404960498049A049C049E04A004A204A404A604A804AA04AC04AE04B004B204B404B604B804BA04BC04BE04C004C104C304C504C704C904CB04CD04D004D204D404D604D804DA04DC04DE04E004E204E404E604E804EA04EC04EE04F004F204F404F604F804FA04FC04FE05000502050405060508050A050C050E05100512051405160518051A051C051E0520052205240531-055610A0-10C51E001E021E041E061E081E0A1E0C1E0E1E101E121E141E161E181E1A1E1C1E1E1E201E221E241E261E281E2A1E2C1E2E1E301E321E341E361E381E3A1E3C1E3E1E401E421E441E461E481E4A1E4C1E4E1E501E521E541E561E581E5A1E5C1E5E1E601E621E641E661E681E6A1E6C1E6E1E701E721E741E761E781E7A1E7C1E7E1E801E821E841E861E881E8A1E8C1E8E1E901E921E941E9E1EA01EA21EA41EA61EA81EAA1EAC1EAE1EB01EB21EB41EB61EB81EBA1EBC1EBE1EC01EC21EC41EC61EC81ECA1ECC1ECE1ED01ED21ED41ED61ED81EDA1EDC1EDE1EE01EE21EE41EE61EE81EEA1EEC1EEE1EF01EF21EF41EF61EF81EFA1EFC1EFE1F08-1F0F1F18-1F1D1F28-1F2F1F38-1F3F1F48-1F4D1F591F5B1F5D1F5F1F68-1F6F1FB8-1FBB1FC8-1FCB1FD8-1FDB1FE8-1FEC1FF8-1FFB21022107210B-210D2110-211221152119-211D212421262128212A-212D2130-2133213E213F214521832C00-2C2E2C602C62-2C642C672C692C6B2C6D-2C702C722C752C7E-2C802C822C842C862C882C8A2C8C2C8E2C902C922C942C962C982C9A2C9C2C9E2CA02CA22CA42CA62CA82CAA2CAC2CAE2CB02CB22CB42CB62CB82CBA2CBC2CBE2CC02CC22CC42CC62CC82CCA2CCC2CCE2CD02CD22CD42CD62CD82CDA2CDC2CDE2CE02CE22CEB2CEDA640A642A644A646A648A64AA64CA64EA650A652A654A656A658A65AA65CA65EA662A664A666A668A66AA66CA680A682A684A686A688A68AA68CA68EA690A692A694A696A722A724A726A728A72AA72CA72EA732A734A736A738A73AA73CA73EA740A742A744A746A748A74AA74CA74EA750A752A754A756A758A75AA75CA75EA760A762A764A766A768A76AA76CA76EA779A77BA77DA77EA780A782A784A786A78BFF21-FF3A",
	Lt: "01C501C801CB01F21F88-1F8F1F98-1F9F1FA8-1FAF1FBC1FCC1FFC",
	Lm: "02B0-02C102C6-02D102E0-02E402EC02EE0374037A0559064006E506E607F407F507FA081A0824082809710E460EC610FC17D718431AA71C78-1C7D1D2C-1D611D781D9B-1DBF2071207F2090-20942C7D2D6F2E2F30053031-3035303B309D309E30FC-30FEA015A4F8-A4FDA60CA67FA717-A71FA770A788A9CFAA70AADDFF70FF9EFF9F",
	Lo: "01BB01C0-01C3029405D0-05EA05F0-05F20621-063F0641-064A066E066F0671-06D306D506EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA0800-08150904-0939093D09500958-096109720979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10D05-0D0C0D0E-0D100D12-0D280D2A-0D390D3D0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E450E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EDC0EDD0F000F40-0F470F49-0F6C0F88-0F8B1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10D0-10FA1100-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317DC1820-18421844-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541B05-1B331B45-1B4B1B83-1BA01BAE1BAF1C00-1C231C4D-1C4F1C5A-1C771CE9-1CEC1CEE-1CF12135-21382D30-2D652D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE3006303C3041-3096309F30A1-30FA30FF3105-312D3131-318E31A0-31B731F0-31FF3400-4DB54E00-9FCBA000-A014A016-A48CA4D0-A4F7A500-A60BA610-A61FA62AA62BA66EA6A0-A6E5A7FB-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2AA00-AA28AA40-AA42AA44-AA4BAA60-AA6FAA71-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADBAADCABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA2DFA30-FA6DFA70-FAD9FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF66-FF6FFF71-FF9DFFA0-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",
	
	Mn: "0300-036F0483-04870591-05BD05BF05C105C205C405C505C70610-061A064B-065E067006D6-06DC06DF-06E406E706E806EA-06ED07110730-074A07A6-07B007EB-07F30816-0819081B-08230825-08270829-082D0900-0902093C0941-0948094D0951-095509620963098109BC09C1-09C409CD09E209E30A010A020A3C0A410A420A470A480A4B-0A4D0A510A700A710A750A810A820ABC0AC1-0AC50AC70AC80ACD0AE20AE30B010B3C0B3F0B41-0B440B4D0B560B620B630B820BC00BCD0C3E-0C400C46-0C480C4A-0C4D0C550C560C620C630CBC0CBF0CC60CCC0CCD0CE20CE30D41-0D440D4D0D620D630DCA0DD2-0DD40DD60E310E34-0E3A0E47-0E4E0EB10EB4-0EB90EBB0EBC0EC8-0ECD0F180F190F350F370F390F71-0F7E0F80-0F840F860F870F90-0F970F99-0FBC0FC6102D-10301032-10371039103A103D103E10581059105E-10601071-1074108210851086108D109D135F1712-17141732-1734175217531772177317B7-17BD17C617C9-17D317DD180B-180D18A91920-19221927192819321939-193B1A171A181A561A58-1A5E1A601A621A65-1A6C1A73-1A7C1A7F1B00-1B031B341B36-1B3A1B3C1B421B6B-1B731B801B811BA2-1BA51BA81BA91C2C-1C331C361C371CD0-1CD21CD4-1CE01CE2-1CE81CED1DC0-1DE61DFD-1DFF20D0-20DC20E120E5-20F02CEF-2CF12DE0-2DFF302A-302F3099309AA66FA67CA67DA6F0A6F1A802A806A80BA825A826A8C4A8E0-A8F1A926-A92DA947-A951A980-A982A9B3A9B6-A9B9A9BCAA29-AA2EAA31AA32AA35AA36AA43AA4CAAB0AAB2-AAB4AAB7AAB8AABEAABFAAC1ABE5ABE8ABEDFB1EFE00-FE0FFE20-FE26",
	Mc: "0903093E-09400949-094C094E0982098309BE-09C009C709C809CB09CC09D70A030A3E-0A400A830ABE-0AC00AC90ACB0ACC0B020B030B3E0B400B470B480B4B0B4C0B570BBE0BBF0BC10BC20BC6-0BC80BCA-0BCC0BD70C01-0C030C41-0C440C820C830CBE0CC0-0CC40CC70CC80CCA0CCB0CD50CD60D020D030D3E-0D400D46-0D480D4A-0D4C0D570D820D830DCF-0DD10DD8-0DDF0DF20DF30F3E0F3F0F7F102B102C10311038103B103C105610571062-10641067-106D108310841087-108C108F109A-109C17B617BE-17C517C717C81923-19261929-192B193019311933-193819B0-19C019C819C91A19-1A1B1A551A571A611A631A641A6D-1A721B041B351B3B1B3D-1B411B431B441B821BA11BA61BA71BAA1C24-1C2B1C341C351CE11CF2A823A824A827A880A881A8B4-A8C3A952A953A983A9B4A9B5A9BAA9BBA9BD-A9C0AA2FAA30AA33AA34AA4DAA7BABE3ABE4ABE6ABE7ABE9ABEAABEC",
	
	Nd: "0030-00390660-066906F0-06F907C0-07C90966-096F09E6-09EF0A66-0A6F0AE6-0AEF0B66-0B6F0BE6-0BEF0C66-0C6F0CE6-0CEF0D66-0D6F0E50-0E590ED0-0ED90F20-0F291040-10491090-109917E0-17E91810-18191946-194F19D0-19DA1A80-1A891A90-1A991B50-1B591BB0-1BB91C40-1C491C50-1C59A620-A629A8D0-A8D9A900-A909A9D0-A9D9AA50-AA59ABF0-ABF9FF10-FF19",
	Nl: "16EE-16F02160-21822185-218830073021-30293038-303AA6E6-A6EF",
	
	Pc: "005F203F20402054FE33FE34FE4D-FE4FFF3F"

});

function expand(map) {

	var pattern = /([0-9a-f]{4})(-[0-9a-f]{4})?/ig;
	
	Keys.each(map, function(k) {
	
		map[k] = map[k].replace(pattern, function(m, m1, m2) {
			
			return "\\u" + m1 + (m2 ? "-\\u" + m2.slice(1) : "");
		});
	});
	
	return map;
}

};

__modules[8] = function(exports) {
exports.methods = {

    // Transform an expression into a formal parameter list
	transformFormals: function(expr) {
	
	    if (expr === null)
	        return [];
	        
	    var list = (expr.type === "SequenceExpression") ? expr.expressions : [expr],
	        params = [],
	        param,
	        node,
	        i;
    
        for (i = 0; i < list.length; ++i) {
        
            node = list[i];
            
            params.push(param = {
            
                type: "FormalParameter",
                pattern: node,
                init: null,
                start: node.start,
                end: node.end,
                previousEnd: node.previousEnd
            });
            
            this.transformPatternElement(param, true);
        }
	    
	    return params;
	},
	
	transformArrayPattern: function(node, binding) {
	
	    node.type = "ArrayPattern";
	    
        var elems = node.elements,
            elem,
            i;
        
        for (i = 0; i < elems.length; ++i) {
        
            elem = elems[i];
            
            if (elem && elem.type !== "PatternElement") {
            
                elem = elems[i] = {
                
                    type: "PatternElement",
                    pattern: elem,
                    init: null,
                    rest: elem.spread,
                    start: elem.start,
                    end: elem.end,
                    previousEnd: elem.previousEnd
                };
                
                // No trailing comma allowed after rest
                if (elem.rest && (node.trailingComma || i < elems.length - 1))
                    this.fail("Invalid destructuring pattern", elem);
            }
            
            if (elem) {
            
                if (elem.rest) this.transformPattern(elem.pattern, binding);
                else this.transformPatternElement(elem, binding);
            }
        }
	},
	
	transformObjectPattern: function(node, binding) {

        node.type = "ObjectPattern";
        
        var props = node.properties, 
            prop,
            i;
        
        for (i = 0; i < props.length; ++i) {
        
            prop = props[i];
            
            switch (prop.type) {
            
                case "PatternProperty":
                    break;
                
                case "PropertyDefinition":
                    
                    prop.type = "PatternProperty";
                    prop.pattern = prop.expression;
                    prop.init = null;
                    
                    delete prop.expression;
                    break;
                
                default:
                    this.fail("Invalid pattern", prop);
            }
            
            if (prop.pattern)
                this.transformPatternElement(prop, binding);
        }
	},
	
	transformPatternElement: function(elem, binding) {
	
	    var node = elem.pattern;
	    
	    // Split assignment into pattern and initializer
	    if (node.type === "AssignmentExpression" && node.operator === "=") {
	    
	        elem.pattern = node.left;
	        elem.init = node.right;
	    }
	    
	    this.transformPattern(elem.pattern, binding);
	},
	
	// Transforms an expression to a pattern
	transformPattern: function(node, binding) {

        switch (node.type) {
        
            case "Identifier":
            
                if (binding) this.checkBindingIdent(node);
                else this.checkAssignTarget(node);
                
                break;
            
            case "MemberExpression":
            case "CallExpression":
                if (binding) this.fail("Invalid left-hand-side in binding pattern", node);
                break;
            
            case "ObjectExpression":
            case "ObjectPattern":
                this.transformObjectPattern(node, binding);
                break;
            
            case "ArrayExpression":
            case "ArrayPattern":
                this.transformArrayPattern(node, binding);
                break;
                
            default:
                this.fail("Invalid expression in pattern", node);
                break;
        }
        
        return node;
	}
    
};
};

__require(0, exports);


}, []);