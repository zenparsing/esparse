import { Parser } from "./Parser.js";
import { ScopeResolver } from "./ScopeResolver.js";
import * as AST from "./AST.js";

function addParentLinks(node) {
    node.children().forEach(child => {
        child.parent = node;
        addParentLinks(child);
    });
}

function parse(input, options = {}) {
    let result = new Parser().parse(input, options);

    if (options.resolveScopes)
        new ScopeResolver().resolve(result);

    if (options.addParentLinks)
        addParentLinks(result.ast);

    return result;
}

export {
    AST,
    parse,
};
