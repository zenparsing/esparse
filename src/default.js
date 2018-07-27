import { Parser } from './Parser.js';
import { Printer } from './Printer.js';
import { ScopeResolver } from './ScopeResolver.js';
import * as AST from './AST.js';

export { AST, parse, print };

function print(ast) {
  return new Printer().print(ast);
}

function parse(input, options) {
  options = options || {};

  let parser = new Parser(input, options);
  let result = options.module ? parser.parseModule() : parser.parseScript();

  if (options.resolveScopes)
    result.scopeTree = new ScopeResolver().resolve(result);

  return result;
}
