import { Parser } from "./Parser.js";
import { resolveBindings } from "./Scope.js";
import * as AST from "./AST.js";

function parse(input, options) {

    var ast = new Parser().parse(input, options);
    return ast;
}

export {

    AST,
    Parser,
    resolveBindings,
    parse,
    parse as default
};
