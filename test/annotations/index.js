const { parse } = require('../../src');
const { runTests, objectLike } = require('../runner.js');

function process(source, options) {
  return parse(source, options).annotations;
}

function compare(a, b) {
  return objectLike(a, b, ['message']);
}

runTests({
  dir:  __dirname,
  process,
  compare,
});
