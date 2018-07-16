const { parse, print } = require('../../');
const { runTests } = require('../runner.js');

function process(source, options) {
  return print(parse(source, options).ast).output;
}

function compare(a, b) {
  return a === b;
}

runTests({
  dir:  __dirname,
  process,
  compare,
});
