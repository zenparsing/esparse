"use strict";

var Class = require("./Class.js").Class;

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

    constructor: function(input, offset) {
    
        this.input = input;
        this.offset = offset || 0;
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
