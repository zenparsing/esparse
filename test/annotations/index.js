const { parse } = require('../../');
const { runTests, objectLike } = require('../runner.js');
const { inspect } = require('util');

function render(node) {
  return inspect(node, { depth: 20, colors: true });
}

function process(source, options) {
  return parse(source, options).annotations;
}

function compare(a, b) {
  return objectLike(a, b, ['message']);
}

runTests({
  dir:  __dirname,
  render,
  process,
  compare,
});
