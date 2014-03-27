/*

=== Unicode Test Generator for ES6 Parsers ===

When parsing ES6, there are three Unicode character classifications
that we are interested in:

- Whitespace:  In addition to the whitespace characters explicitly
  defined in the ES6 specification, we also need to recognize any
  character with a Unicode general category of "Zs".  The predefined
  whitespace characters are:

  - U+0009 <TAB> [\t]
  - U+000B <VT> [\v] 
  - U+000C <FF> [\f]
  - U+0020 <SP> [ ]
  - U+00A0 <NBSP>
  - U+FEFF <BOM>
  
  In order to find the other whitespace characters, we download the
  text file located at http://www.unicode.org/Public/UNIDATA/PropList.txt
  and find all of the character ranges with the "White_Space" property
  and whose general category is "Zs".

- IdentifierStart and IdentifierPart:  In addition to the identifier
  characters explicitly defined in the ES6 specification, we also need
  to recognize characters with a Unicode derived property of "ID_Start"
  or "ID_Continue".  The predefined identifier characters are:

  - U+0024 [$] IdentifierStart
  - U+005F [_] IdentifierStart
  - U+200C <ZWNJ> IdentifierPart
  - U+200D <ZWJ> IdentifierPart
  
  In order to find the other identifier characters, we download the
  text file located at http://www.unicode.org/Public/UNIDATA/DerivedCoreProperties.txt
  and find all of the character ranges with a Unicode derived property
  of "ID_Start" or "ID_Continue" which can be represented in UTF-16 as 
  a single code unit.

After obtaining the list of valid code points for whitespace and identifiers,
we build a list of ranges and output code for each target language:

- Javascript: We output three regular expressions that test whether a
  character is a Whitespace, IdentifierStart, IdentifierPart character.

- C++:  We output two sorted arrays for whitespace and identifier characters.
  Each element in the array contains a 32 bit starting code point, a 
  16 bit range length, and a 16 bit flag field which is set to 1 if the range
  is an IndentifierStart range.
  
  We also output a binary search algorithm which searches the array for a
  range which contains a given code point, and which has the appropriate
  IdentifierStart flag state.

*/

var Path = require("path"),
    HTTP = require("http"),
    FS = require("fs");

function log(msg) {

    console.log("..." + msg);
}

function absPath(path) {

    return Path.resolve(__dirname, path);
}

function downloadDatabase(url, filePath, callback) {

    var filename = Path.basename(filePath);
    
    if (FS.existsSync(filePath)) {
    
        log(filename + " database already downloaded");
        return callback();
    }
    
    log("Downloading " +  filename + " database");
    
    HTTP.get(url, function(response) {

        var out = FS.createWriteStream(filePath);
        response.pipe(out);
        response.on("end", callback);
    
    }).on("error", fail);
}

function getUnicodeVersion(data) {

    var version = /^#[^\n\d]*(\d(?:\.\d+)*)/,
        date = /\n#\s*Date:\s*(.+)/,
        match;
    
    match = version.exec(data);
    if (match) unicodeVersion = match[1];
    
    match = date.exec(data);
    if (match) unicodeDate = match[1];
}

function foldRanges(map) {
    
    var ranges = [],
        range;
    
    Object
    .keys(map)
    .sort(function(a, b) { return +(a) - b })
    .forEach(function(val) {
    
        // Convert val to a number
        val = +val;
        
        if (range && val === range.to + 1 && map[val] === range.type) {
            
            range.to = val;
        
        } else {
        
            range = { from: val, to: val, type: map[val] };
            ranges.push(range);
        }
    });
    
    return ranges;
}

var unicodeVersion = "",
    unicodeDate = "",
    wsRanges,
    idRanges;

var PROP_LIST_URL = "http://www.unicode.org/Public/UNIDATA/PropList.txt",
    DERIVED_PROPS_URL = "http://www.unicode.org/Public/UNIDATA/DerivedCoreProperties.txt",
    PROP_LIST_PATH = absPath("PropList.txt"),
    DERIVED_PROPS_PATH = absPath("DerivedCoreProperties.txt"),
    JS_OUT_PATH = absPath("unicode.js"),
    CPP_TEMPLATE_PATH = absPath("template.cpp"),
    CPP_OUT_PATH = absPath("unicode.cpp");
    
// Whitespace
var CP_TAB = 0x09,
    CP_VT = 0x0b,
    CP_FF = 0x0c,
    CP_SP = 0x20,
    CP_NBSP = 0xa0,
    CP_BOM = 0xfeff;
    
// Identifiers
var CP_DOLLAR = 0x24,
    CP_UNDERSCORE = 0x5f,
    CP_ZWNJ = 0x200c,
    CP_ZWJ = 0x200d;

// Code Point Types
var WHITE_SPACE = 1,
    ID_START = 2,
    ID_CONT = 3;

var Tasks = {

    start: function() {
    
        console.log("Unicode Test Generator for ES6 Parsers");
        nextTask();
    },

    getPropList: function() {
    
        downloadDatabase(PROP_LIST_URL, PROP_LIST_PATH, nextTask);
    },
    
    getDerivedProps: function() {
    
        downloadDatabase(DERIVED_PROPS_URL, DERIVED_PROPS_PATH, nextTask);
    },
    
    loadWhiteSpaceChars: function() {
    
        var wsMap = {};
        
        // Load pre-defined whitespace code points
        wsMap[CP_TAB] = 
        wsMap[CP_VT] =
        wsMap[CP_FF] = 
        wsMap[CP_SP] = 
        wsMap[CP_NBSP] = 
        wsMap[CP_BOM] = WHITE_SPACE;
        
        log("Opening PropList.txt database");
        
        var propList = FS.readFileSync(PROP_LIST_PATH, { encoding: "utf8" }),
            pattern = /\n([a-fA-F0-9\.]+)\s+;\s*White_Space\s*#\s*Zs/g,
            match;
        
        getUnicodeVersion(propList);
        
        log("Unicode " + unicodeVersion + " | " + unicodeDate);
        
        log("Scanning PropList.txt for White_Space (Zs)");
        
        while (match = pattern.exec(propList)) {
        
            var range, code;
            
            range = match[1].split("..").map(function(val) {
            
                return parseInt(val, 16);
            });
            
            if (range.length === 1)
                range[1] = range[0];
            
            for (code = range[0]; code <= range[1]; ++code)
                wsMap[code] = WHITE_SPACE;
        }
        
        wsRanges = foldRanges(wsMap);
        
        nextTask();
    },
    
    loadIdentChars: function() {
        
        var idMap = {};
        
        // Load pre-defined identifier code points
        idMap[CP_DOLLAR] = ID_START;
        idMap[CP_UNDERSCORE] = ID_START;
        idMap[CP_ZWNJ] = ID_CONT;
        idMap[CP_ZWJ] = ID_CONT;
        
        log("Opening DerivedCoreProperties.txt database");
        
        var propList = FS.readFileSync(DERIVED_PROPS_PATH, { encoding: "utf8" });
        
        var pattern = /\n([a-fA-F0-9\.]+)\s+;\s*ID_(Start|Continue)\s+/g,
            match;
        
        log("Scanning DerivedCoreProperties.txt for ID_Start and ID_Continue");
        
        while (match = pattern.exec(propList)) {
        
            var range, code;
            
            range = match[1].split("..").map(function(val) {
            
                return parseInt(val, 16);
            });
            
            if (range.length === 1)
                range[1] = range[0];
            
            for (code = range[0]; code <= range[1]; ++code)
                if (idMap[code] !== ID_START)
                    idMap[code] = match[2] === "Start" ? ID_START : ID_CONT;
        }
        
        idRanges = foldRanges(idMap);
        
        nextTask();
    },
    
    exportJS: function() {
    
        log("Generating javascript code (code points <= 0xffff)");
    
        var out = 
            "// Unicode " + unicodeVersion + " | " + unicodeDate + "\n" +
            "var identifierStart = " + toRegex(idRanges, ID_START) + ",\n" + 
            "    identifierPart = " + toRegex(idRanges, 0) + ",\n" +
            "    whitespaceChars = " + toRegex(wsRanges, WHITE_SPACE) + ";\n";
        
        FS.writeFileSync(JS_OUT_PATH, out);
        
        nextTask();
        
        function toRegex(ranges, type) {
        
            return "/[" + ranges.map(function(range) {
        
                if (type && range.type !== type)
                    return;
                
                // Skip ranges which cannot be expressed with a single
                // UTF-16 code unit
                if (range.from > 0xffff)
                    return;
                    
                var str = "\\" + hex(range.from);
            
                if (range.from !== range.to)
                    str += "-\\" + hex(range.to);
            
                return str;
                
            }).join("") + "]/";
        }
        
        function hex(val) {
        
            val = Math.min(val, 0xffff);
            val = val.toString(16).toUpperCase();
            
            switch (val.length) {
            
                case 1: return "x0" + val;
                case 2: return "x" + val;
                case 3: return "u0" + val;
                default: return "u" + val;
            }
        }
    },
    
    exportCPP: function() {
    
        log("Reading C++ code template");
        
        var template = FS.readFileSync(CPP_TEMPLATE_PATH, { encoding: "utf8" });
        
        log("Generating C++ code");
        
        var out = template
            .replace(/\/\*\*\[WhiteSpaceData\]\*\*\//, toArray(wsRanges, 0))
            .replace(/\/\*\*\[WhiteSpaceDataLength\]\*\*\//, wsRanges.length)
            .replace(/\/\*\*\[IdentifierData\]\*\*\//, toArray(idRanges, ID_START))
            .replace(/\/\*\*\[IdentifierDataLength\]\*\*\//, idRanges.length);
        
        out = "// Unicode " + unicodeVersion + " | " + unicodeDate + "\n\n" + out;
        
        FS.writeFileSync(CPP_OUT_PATH, out);
        
        nextTask();
        
        function toArray(ranges, type) {
        
            return ranges.map(function(range) {
            
                var from = range.from,
                    delta = range.to - range.from;
                
                return "    { " +
                    "0x" + from.toString(16) + ", " + 
                    "0x" + delta.toString(16) + ", " +
                    (range.type === type ? "1" : "0") + " " +
                "}";
                
            }).join(",\n");
        }
    }
};

Tasks.list = Object.keys(Tasks);

function nextTask() {

    if (Tasks.list.length === 0)
        return complete();
    
    var next = Tasks.list.shift();
    Tasks[next]();
}

function fail(err) {

    log("Oops!", err);
}

function complete() {

    log("Finished.");
}

nextTask();