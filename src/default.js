import { Parser } from "./Parser.js";
import { resolveScopes } from "./ScopeResolver.js";
import * as AST from "./AST.js";

function parse(input, options) {

    return new Parser().parse(input, options);
}

export {

    AST,
    Parser,
    resolveScopes,
    parse,
    parse as default
};
