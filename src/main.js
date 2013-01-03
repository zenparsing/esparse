"use strict";

var Parser = require("./Parser.js").Parser,
    Scanner = require("./Scanner.js").Scanner;

function parseModule(input, options) {

    return new Parser(input, options).parseModule();
}

function parseScript(input, options) {

    return new Parser(input, options).parseScript();
}

function forEachChild(node, fn) {

    var keys = Object.keys(node), val, i, j;
    
    for (i = 0; i < keys.length; ++i) {
    
        if (keys[i] === "parentNode")
            continue;
            
        val = node[keys[i]];
        
        // Skip non-objects
        if (!val || typeof val !== "object") 
            continue;
        
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

exports.Parser = Parser;
exports.Scanner = Scanner;

exports.parseScript = parseScript;
exports.parseModule = parseModule;
exports.forEachChild = forEachChild;
