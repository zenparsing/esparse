import "path" as Path;
import "fs" as FS;
import "../src/es6parse.js" as Parser;

import Scanner from Parser;

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
    
        console.log(obj.chr + " > " + obj.num);
        return i < 100;
    });
    
}

var nativeParser = {

    parse(src) { new Function(src); }
};

var dryLoop = {

    parse(src) {
    
        for (var i = 0, c; i < src.length; ++i)
            c = src.charAt(i);
    }
};

var scanOnly = {

    parse(src) {
    
        var scanner = new Scanner(src);
        
        while (scanner.next("div") !== "EOF");
    }
};

var parsers = { 

    "dry-loop": dryLoop,
    "native": nativeParser, 
    "es6parse-scanner": scanOnly,
    "acorn": Acorn,
    "es6parse": { parse(input) { Parser.parseScript(input) } }, 
    "esprima": Esprima
};

walkDirectory(Path.join(__dirname, "input"), path => {

    var input = FS.readFileSync(path, "utf8"),
        name = Path.basename(path),
        libs = {};
    
    Object.keys(parsers).forEach(k => libs[k] = parsers[k]);
    
    console.log("[" + name + "]");
    
    next();
    
    function next() {
    
        var list = Object.keys(libs),
            lib,
            parser,
            ts;
        
        if (list.length === 0)
            return;
        
        lib = list.shift();
        parser = libs[lib];
        
        delete libs[lib];
        
        ts = +new Date;
        
        for (var i = 8; i--;)
            parser.parse(input);
        
        console.log("  " + lib + ": " + ((+new Date) - ts) + "ms");
        
        setTimeout(next, 500);
    }
});