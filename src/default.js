import { Parser } from "./Parser.js";
import { AST } from "./AST.js";

function parse(input, options) {

    return new Parser().parse(input, options);
}

export {

    AST,
    Parser,
    parse,
    parse as default
};
