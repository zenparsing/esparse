"use strict";

var Parser = require("./Parser.js").Parser,
    Scanner = require("./Scanner.js").Scanner;

function parse(input, options) {

    var ast = {
        
        input: input,
        root: new Parser(input, options).parse(),
        forEachChild: forEachChild,
        replace: function(replacer) { return replace(ast, replacer); },
        traverse: function(visitor) { return traverse(ast, visitor); }

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

    visit(ast.root);
    
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
    
    visit($, 0);
    
    return $.innerText;
    
    function visit(node, previousEnd) {
    
        var prev = null;
        
        forEachChild(node, function(child) {
        
            child.parentNode = node;
            visit(child, prev ? prev.end : child.start);
            delete child.parentNode;
            prev = child;
        });
        
        var offset = node.start,
            content = "",
            replaced = null,
            leadingText = "";
        
        if (previousEnd < node.start)
            leadingText = input.slice(previousEnd, node.start);
        
        // Build innerText and outerText
        
        forEachChild(node, function(child) {
        
            content += input.slice(offset, child.start);
            content += child.innerText;
            offset = child.end;
        });
        
        content += input.slice(offset, node.end);
        
        node.innerText = content;
        node.outerText = leadingText + content;
        
        // Call replacer
        if (replacer[node.type])
            replaced = replacer[node.type](node, ast);
        
        if (typeof replaced === "string") {
            
            node.innerText = replaced;
            node.outerText = leadingText + replaced;
        }
        
        forEachChild(node, function(child) {
        
            delete child.innerText;
            delete child.outerText;
        });
    }
}

exports.Parser = Parser;
exports.Scanner = Scanner;
exports.parse = parse;
exports.replace = replace;
exports.traverse = traverse;
exports.forEachChild = forEachChild;
