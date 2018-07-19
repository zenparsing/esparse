const { parse, print } = require('../../');
const { runTests } = require('../runner.js');

function process(source, options) {
  return print(parse(source, options).ast).output;
}

function normalize(v) {
  return v.replace(/\n[ ]+\n/g, '\n\n');
}

function compare(a, b) {
  return normalize(a) === normalize(b);
}

runTests({
  dir:  __dirname,
  process,
  compare,
});
