const { parse } = require('../../');
const { runTests, objectLike } = require('../runner.js');
const { inspect } = require('util');

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

// Displays an object tree
function displayTree(tree) {
  return inspect(tree, false, 20, true);
}

runTests({
  dir:  __dirname,
  render: displayTree,
  process: (input, options) => parse(input, options).ast,
  compare: astLike
});
