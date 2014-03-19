module Path from "node:path";
module FS from "node:fs";

import { Scanner, parseScript } from "../src/main.js";

var Esprima = require("./parsers/esprima.js"),
    Acorn = require("./parsers/acorn.js");

// Returns a stat object for a path
function statPath(path) {

    try { return FS.statSync(path); } catch (ex) {}
    return null;
}

// Executes a function for each file in a directory
function walkDirectory(dir, fn) {

    FS
    .readdirSync(dir)
    .filter(name => name.charAt(0) !== ".")
    .map(name => Path.resolve(dir, name))
    .map(path => ({ path: path, stat: statPath(path) }))
    .forEach(entry => {
    
        if (!entry.stat)
            return;
        
        if (entry.stat.isDirectory())
            return walkDirectory(entry.path, fn);
        
        if (entry.stat.isFile())
            fn(entry.path);
    });
}

function analyzeChars(string) {

    var a = string.split(""),
        occ = {};
    
    a.forEach(c => {
        
        if (occ[c] === void 0)
            occ[c] = 1;
        else
            occ[c]++;
    });
    
    Object
    .keys(occ)
    .sort((a, b) => occ[b] - occ[a])
    .map(k => ({ chr: k, num: occ[k] }))
    .filter((obj, i) => {
    
        console.log(`${ JSON.stringify(obj.chr) } (${ obj.chr.charCodeAt(0) }): ${obj.num}`);
        return i < 100;
    });
}

function nativeParse(src) {

    new Function(src);
}

function dryLoop(src) {

    for (var i = 0, c; i < src.length; ++i)
        c = src.charAt(i);
}

function scanOnly(src) {
    
    var scanner = new Scanner(src);
    while (scanner.next("div") !== "EOF");
}

var parsers = { 

    "dry-loop": dryLoop,
    "native": nativeParse, 
    "scanner": scanOnly,
    "acorn": Acorn.parse,
    "es6parse": parseScript,
    "esprima": Esprima.parse
};


export function main(args) {

    walkDirectory(Path.join(__dirname, "input"), path => {

        var input = FS.readFileSync(path, "utf8"),
            name = Path.basename(path),
            libs = {};
    
        Object.keys(parsers).forEach(k => libs[k] = parsers[k]);
    
        console.log("[" + name + "]");
        
        var ts = +new Date,
            lib = args[2] || "es6parse",
            parser = parsers[lib],
            count = 50;
    
        if (lib === "chars")
            return analyzeChars(input);
            
        try {
    
            for (var i = count; i--;)
                parser(input = input + " ");
            
        } catch (err) {
    
            console.log(err);
            throw err;
        }
    
        var ms = ((+new Date) - ts) / count;
    
        console.log("  " + lib + ": " + 
            (ms / input.length * 1024 * 1024).toFixed(2) + " ms/MB, " +
            (input.length * 1000 / ms / 1024 / 1024).toFixed(2) + " MB/sec");
        
    });
    
}