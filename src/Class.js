"use strict";

var setKeys = require("./Keys.js").set;

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