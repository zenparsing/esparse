const { parse } = require('../../src');
const { runTests, objectLike } = require('../runner.js');

const SKIP_KEYS = [
  'start',
  'end',
  'message',
  'context',
  'error',
  'suffix',
];

// Returns true if the specified AST is 'like' another AST
function astLike(a, b) {
  return objectLike(a, b, SKIP_KEYS);
}

runTests({
  dir:  __dirname,
  process: (input, options) => parse(input, options).ast,
  compare: astLike
});
