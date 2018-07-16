import { Parser } from './Parser.js';
import { Printer } from './Printer.js';
import { ScopeResolver } from './ScopeResolver.js';
import * as AST from './AST.js';

export { AST, parse, print };

function addParentLinks(node) {
  node.children().forEach(child => {
    child.parent = node;
    addParentLinks(child);
  });
}

function print(ast) {
  return new Printer().print(ast);
}

function parse(input, options) {
  options = options || {};

  let parser = new Parser(input, options);
  let result = options.module ? parser.parseModule() : parser.parseScript();

  if (options.resolveScopes)
    result.scopeTree = new ScopeResolver().resolve(result);

  if (options.addParentLinks)
    addParentLinks(result.ast);

  return result;
}
