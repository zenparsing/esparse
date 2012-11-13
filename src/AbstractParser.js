"use strict";

var Keys = require("./Keys.js"),
    Class = require("./Class.js").Class;

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
        this.reset("");
    },
    
    reset: function(text, offset) {
    
        var scanner = new (this.Scanner)(text, offset);
		
		this.scanner = scanner;
		this.offset = scanner.offset;
		this.input = scanner.input;
		
		this.queue = [];
		
		return this;
    },

	parse: function(text) {
	
	    return this.reset(text).Start();
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
