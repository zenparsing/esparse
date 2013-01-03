"use strict";

var FS = require("fs"),
    Path = require("path"),
    Util = require("util");

var Parser = require("../src/main.js");

var HOP = Object.prototype.hasOwnProperty,
    TEST_COMMENT = /\/\*\*!?[\s\S]+?\*\*\//g,
    COMMENT_TRIM = /^\/\*\*!?|\*\*\/$/g;

var SKIP_KEYS = {

    "start": 1,
    "end": 1,
    "newlineBefore": 1,
    "message": 1
}

// Returns true if the argument is an object
function isObject(obj) {

    return obj && typeof obj === "object";
}

// Returns true if the specified AST is "like" another AST
function astLike(a, b) {

    if (a === b)
        return true;
        
    if (!isObject(a) || !isObject(b))
		return a === b;
	
	var keys, i;
	
	// Each key in control must be in test
	for (keys = Object.keys(b), i = 0; i < keys.length; ++i)
	    if (!HOP.call(a, keys[i]))
	        return false;
	
	for (keys = Object.keys(a), i = 0; i < keys.length; ++i) {
	
		// Control must have same own property
		if (!HOP.call(b, keys[i])) {
		
		    if (SKIP_KEYS[keys[i]] === 1) continue;
		    else return false;
		}
		
		// Values of own properties must be equal
		if (!astLike(a[keys[i]], b[keys[i]]))
			return false;
	}
	
	return true;
}

function astLikeFail(msg) {

    console.log(msg);
    return false;
}

// Returns the group name for a test file
function groupName(path) {

    path = Path.dirname(path);
    
    if (path.indexOf(__dirname) === 0)
        path = path.slice(__dirname.length);
    
    return path.replace(/[\/\\]/g, ".").replace(/^\./, "");
}

// Returns a stat object for a path
function statPath(path) {

    try { return FS.statSync(path); } catch (ex) {}
    return null;
}

// Executes a function for each file in a directory
function walkDirectory(dir, fn) {

    FS
    .readdirSync(dir)
    .filter(function(name) { return name.charAt(0) !== "."; })
    .map(function(name) { return Path.resolve(dir, name); })
    .map(function(path) { return { path: path, stat: statPath(path) }; })
    .forEach(function(entry) {
    
        if (!entry.stat)
            return;
        
        if (entry.stat.isDirectory())
            return walkDirectory(entry.path, fn);
        
        if (entry.stat.isFile())
            fn(entry.path);
    });
}

// Prints a message to the console
function print(msg) {

    console.log("=== " + msg + " ===");
}

// Prints a test result
function printResult(msg, pass) {

    console.log(msg + " [" + (pass ? "OK" : "FAIL") + "]");
}

// Read a javascript or json file
function readFile(filename) {

    var text = FS.readFileSync(filename, "utf8");
    
    // From node/lib/module.js/Module.prototype._compile
    text = text.replace(/^\#\!.*/, '');
    
    // From node/lib/module.js/stripBOM
    if (text.charCodeAt(0) === 0xFEFF)
        text = text.slice(1);
    
    return text;
}

// Parses a list of test inputs from comments
function parseTestComments(text) {

    var list = text.match(TEST_COMMENT) || [];
    
    return list.map(function(source) {
    
        return source.replace(COMMENT_TRIM, "").trim();
    });
}

// Displays an object tree
function displayTree(tree) {

    console.log(Util.inspect(tree, false, 10, true));
}

function run() {

    var currentGroup = null;
    
    walkDirectory(__dirname, function(path) {
    
        var group = groupName(path),
            name = Path.basename(path, ".js"),
            tree;
        
        // Only javascript files in nested directories
        if (!group || Path.extname(path) !== ".js")
            return;
        
        // Print a group header
        if (group !== currentGroup)
            print(currentGroup = group);
        
        var text = readFile(path),
            programs = parseTestComments(text),
            outputs = (new Function("return " + text))(),
            pass,
            i;
        
        for (i = 0; i < programs.length; ++i) {
        
            try { 
            
                tree = Parser.parseScript(programs[i]);
            
            } catch (err) {
            
                if (err instanceof SyntaxError)
                    tree = { message: err.message };
                else
                    throw err;
            }
            
            pass = astLike(tree, outputs[i]);
            
            printResult(name + "[" + i + "]", pass);
            
            if (!pass) {
        
                console.log("");
                displayTree(tree);
                throw "stop";
            }
        }
    });
}

try { run(); }
catch (err) { if (err !== "stop") throw err; }
