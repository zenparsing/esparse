module AST from "AST.js";

import { Parser } from "Parser.js";
import { Scanner } from "Scanner.js";

export { Parser, Scanner, AST };

export function parseModule(input, options) {

    return new Parser(input, options).Module();
}

export function parseScript(input, options) {

    return new Parser(input, options).Script();
}

export function forEachChild(node, fn) {

    var keys = Object.keys(node), val, i, j;
    
    for (i = 0; i < keys.length; ++i) {
    
        // Don't iterate over backlink to parent
        if (keys[i] === "parentNode")
            continue;
            
        val = node[keys[i]];
        
        // Skip non-objects
        if (val !== Object(val)) 
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

