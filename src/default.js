import { Parser } from "./Parser.js";
import { resolveBindings } from "./Scope.js";
import * as AST from "./AST.js";

function parse(input, options) {

    return new Parser().parse(input, options);
}

export {

    AST,
    Parser,
    resolveBindings,
    parse,
    parse as default
};
