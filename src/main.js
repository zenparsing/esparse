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
