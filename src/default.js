import { Parser } from './Parser.js';
import { Printer } from './Printer.js';
import * as AST from './AST.js';

export { AST, parse, print };

function print(ast) {
  return new Printer().print(ast);
}

function parse(input, options = {}) {
  let parser = new Parser(input, options);
  let result = options.module ? parser.parseModule() : parser.parseScript();
  return result;
}
