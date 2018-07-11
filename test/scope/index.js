/*

13.1.1 (Block)
    - no duplicate lexical names in body
    - lexical names cannot conflict with var names in body
13.2.1.1 (Lexical Declarations)
    - 'let' cannot be a binding variable name
    - no duplicate binding names in lexical declarations
13.6.3.1 (For Head)
    - var names can't shadow lexical names in head
13.6.4.1 (ForIn/Of Head)
    - 'let' cannot be a binding variable name
    - no duplicate binding names in lexical declarations
    - var names can't shadown lexical names in head
13.11.1 (Case Block)
    - no duplicate lexical names in case clauses
    - lexical names cannot conflict with var names in case clauses
13.14.1 (Catch Block)
    - catch parameter cannot conflict with lexical names in body
    - catch parameter cannot conflict with var names in body
14.1.2 (Functions)
    - no conflicts between param names and lexical names of body
    - (strict or non-simple parameters) no duplicate parameter names
    - lexical names of body cannot have duplicates
    - lexical names cannot conflict with var names in body
14.2.1 (Arrows)
    - no conflicts between param names and lexical names of body
    - no duplicate parameter names
    - lexical names of body cannot have duplicates
    - lexical names cannot conflict with var names in body
14.3.1 (Methods)
    - same rules as arrows
14.4.1 (Generators)
    - Same rules as functions
15.1.1 (Script)
    - Same as block
15.2.1.1 (ModuleBody)
    - Same as block
15.2.2.1 (ModuleItem)
    - Imported bindings cannot contain duplicates

*/

const { parse } = require('../../');
const { runTests, objectLike } = require('../runner.js');

function process(source, options) {
  options = Object.assign(options, { resolveScopes: true });
  return parse(source, options).scopeTree;
}

function compare(a, b) {
  return objectLike(a, b, ['node', 'message', 'strict', 'parent']);
}

runTests({
  dir:  __dirname,
  process,
  compare,
});
