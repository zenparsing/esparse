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

- IdentifierStart and IdentifierPart:  In addition to the identifier
  characters explicitly defined in the ES6 specification, we also need
  to recognize characters with a Unicode derived property of "ID_Start"
  or "ID_Continue".  The predefined identifier characters are:

  - U+0024 [$] IdentifierStart
  - U+005F [_] IdentifierStart
  - U+200C <ZWNJ> IdentifierPart
  - U+200D <ZWJ> IdentifierPart

After obtaining the list of valid code points for whitespace and identifiers,
we output three ECMAScript 5-compatible regular expressions that test whether a
character is a Whitespace, IdentifierStart, or IdentifierPart character.

*/

var Path = require("path"),
    FS = require("fs"),
    regenerate = require("regenerate");

function log(msg) {

    console.log("..." + msg);
}

function absPath(path) {

    return Path.resolve(__dirname, path);
}

function getData(what) {

    return require(
        "unicode-" + UNICODE_VERSION + "/" + what + "/code-points"
    );
}

var UNICODE_VERSION = "6.3.0";

var JS_OUT_PATH = absPath("unicode.js");

var identifierStart = regenerate(
    getData("properties/ID_Start"),
    "$",
    "_"
);

var identifierPart = regenerate(
    getData("properties/ID_Continue"),
    "$",
    "_",
    0x200C,
    0x200D
);

var whiteSpace = regenerate(
    getData("categories/Zs"),
    0x0009, // U+0009 <TAB> [\t]
    0x000B, // U+000B <VT> [\v]
    0x000C, // U+000C <FF> [\f]
    0x0020, // U+0020 <SP> [ ]
    0x00A0, // U+00A0 <NBSP>
    0xFEFF  // U+FEFF <BOM>
);

var Tasks = {

    start: function() {

        console.log("Unicode Test Generator for ES6 Parsers");
        nextTask();
    },

    exportJS: function() {

        log("Generating JavaScript code for all code points");

        var out =
            "// Unicode v" + UNICODE_VERSION + "\n" +
            "var identifierStart = /" + identifierStart.toString() + "/,\n" +
            "    identifierPart = /" + identifierPart.toString() + "/,\n" +
            "    whitespaceChars = /" + whiteSpace.toString() + "/;\n";

        FS.writeFileSync(JS_OUT_PATH, out);

        nextTask();
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