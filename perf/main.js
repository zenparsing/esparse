import { Scanner, parseScript } from "../main.js";

var Path = require("path"),
    FS = require("fs"),
    Esprima = require("./parsers/esprima.js"),
    EsprimaHarmony = require("./parsers/esprima-harmony.js"),
    Acorn = require("./parsers/acorn.js");

var reservedWord = new RegExp("^(?:" +
    "break|case|catch|class|const|continue|debugger|default|delete|do|" +
    "else|enum|export|extends|false|finally|for|function|if|import|in|" +
    "instanceof|new|null|return|super|switch|this|throw|true|try|typeof|" +
    "var|void|while|with" +
")$");

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

function analyzeReserved(string) {

    var scanner = new Scanner(string),
        words = Object.create(null),
        word;
    
    reservedWord
    .toString()
    .replace(/^[^a-z]+|[^a-z]+$/ig, "")
    .split("|")
    .forEach(word => words[word] = 0);
    
    while (scanner.next("div") !== "EOF") {
    
        word = scanner.type;
        
        if (reservedWord.test(word)) {
        
            if (!(word in words))
                words[word] = 0;
            
            words[word] += 1;
        }
    }
    
    var freq = Object.keys(words)
    .sort((a, b) => words[b] - words[a])
    .map(k => ({ word: k, num: words[k] }));
    
    freq.filter((obj, i) => {
    
        console.log(`${obj.word}: ${obj.num}`);
        return i < 100;
    });
    
    var cases = freq.map(obj => `case "${obj.word}":`).join(" ");
    
    console.log(cases);
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
    "esparse": parseScript,
    "esprima": Esprima.parse,
    "esprima-harmony": EsprimaHarmony.parse
};

export function main(args) {
    
    var libs = {};
    
    Object.keys(parsers).forEach(k => libs[k] = parsers[k]);

    var ts = +new Date,
        lib = args[2] || "esparse",
        parser = parsers[lib],
        size = 0;
    
    console.log(`\n>> Testing Parser Speed (${ lib })\n`);

    walkDirectory(Path.join(__dirname, "_input"), path => {

        var input = FS.readFileSync(path, "utf8"),
            name = Path.basename(path);

        console.log(`Parsing ${ name }`);
        
        try {
    
            size += input.length;
            parser(input);
            
        } catch (err) {
    
            console.log(`${ err.line }:${ err.column }`);
            throw err;
        }
        
    });
    
    var ms = ((+new Date) - ts);

    console.log("\n>> Results: " + 
        (ms / size * 1024 * 1024).toFixed(2) + " ms/MB, " +
        (size * 1000 / ms / 1024 / 1024).toFixed(2) + " MB/sec\n");
    
}
