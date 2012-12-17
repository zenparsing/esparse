"use strict";

var Parser = require("./Parser.js").Parser,
    Scanner = require("./Scanner.js").Scanner;

function parse(input, options) {

    return new Parser(input, options).parse();
}

function forEachChild(node, fn) {

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

exports.Parser = Parser;
exports.Scanner = Scanner;

exports.parse = parse;
exports.forEachChild = forEachChild;
