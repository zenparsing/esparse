import inspect from "util";
import parseScript from "../src/main.js";

var ast = parseScript(process.argv.pop() || "");

console.log(inspect(ast, false, 10, true));