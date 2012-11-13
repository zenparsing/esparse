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