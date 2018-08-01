import { Parser } from './Parser.js';
import { Printer } from './Printer.js';
import { ScopeResolver } from './ScopeResolver.js';
import * as AST from './AST.js';

export { AST, parse, print, resolveScopes };

function print(ast) {
  return new Printer().print(ast);
}

function resolveScopes(ast) {
  return new ScopeResolver().resolve(ast);
}

function parse(input, options = {}) {
  let parser = new Parser(input, options);
  let result = options.module ? parser.parseModule() : parser.parseScript();
  return result;
}
