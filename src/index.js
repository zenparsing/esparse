import { Parser } from './Parser.js';
import { Printer } from './Printer.js';
import { ScopeResolver } from './ScopeResolver.js';
import * as AST from './AST.js';

export { AST, parse, print, resolveScopes };

function print(ast, options) {
  return new Printer().print(ast, options);
}

function parse(input, options = {}) {
  let parser = new Parser(input, options);
  let result = options.module ? parser.parseModule() : parser.parseScript();
  return result;
}

function resolveScopes(ast, options) {
  return new ScopeResolver().resolve(ast, options);
}
