const esparse = require('../');
const util = require('util');

const HELP = `
== Global Variables ==

ast  (template tag) : Prints a script AST
astm (template tag) : Prints a module AST
esparse             : The full library API
parse               : Parses JS and returns a ParseResult
`;

global.esparse = esparse;

global.parse = esparse.parse;

function printAST(input, options) {
  let result = esparse.parse(input, options);
  console.log(util.inspect(result.ast, {
    colors: true,
    depth: 50,
  }));
}

Object.defineProperty(global, 'help', {
  get() { console.log(HELP) }
});

global.ast = function(strings, ...values) {
  printAST(String.raw(strings, ...values));
};

global.astm = function(strings, ...values) {
  printAST(String.raw(strings, ...values), { module: true });
};
