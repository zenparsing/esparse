"use strict";

var Util = require("util");
var Parser = require("../src/main.js");

var ast = Parser.parseScript(process.argv[2] || "");

console.log(Util.inspect(ast, false, 10, true));