import { Parser } from './Parser.js';
import { ScopeResolver } from './ScopeResolver.js';
import * as AST from './AST.js';

export { AST, parse };

function addParentLinks(node) {
  node.children().forEach(child => {
    child.parent = node;
    addParentLinks(child);
  });
}

function parse(input, options) {
  options = options || {};

  let parser = new Parser(input, options);
  let result = options.module ? parser.parseModule() : parser.parseScript();

  if (options.resolveScopes)
    new ScopeResolver().resolve(result);

  if (options.addParentLinks)
    addParentLinks(result.ast);

  return result;
}
