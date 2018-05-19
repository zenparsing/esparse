({

/** () => x; **/
'empty paren with expression':
{ type: 'Script',
  start: 0,
  end: 8,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 8,
       expression:
        { type: 'ArrowFunction',
          start: 0,
          end: 7,
          kind: '',
          params: [],
          body:
           { type: 'Identifier',
             start: 6,
             end: 7,
             value: 'x',
             context: 'variable' } } } ] },

/** x => x; **/
'identifier with expression':
{ type: 'Script',
  start: 0,
  end: 7,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 7,
       expression:
        { type: 'ArrowFunction',
          start: 0,
          end: 6,
          kind: '',
          params:
           [ { type: 'FormalParameter',
               start: 0,
               end: 1,
               pattern:
                { type: 'Identifier',
                  start: 0,
                  end: 1,
                  value: 'x',
                  context: 'declaration' },
               initializer: null } ],
          body:
           { type: 'Identifier',
             start: 5,
             end: 6,
             value: 'x',
             context: 'variable' } } } ] },

/** (x, y) => x + y; **/
'paren with expression':
{ type: 'Script',
  start: 0,
  end: 16,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 16,
       expression:
        { type: 'ArrowFunction',
          start: 0,
          end: 15,
          kind: '',
          params:
           [ { type: 'FormalParameter',
               start: 1,
               end: 2,
               pattern:
                { type: 'Identifier',
                  start: 1,
                  end: 2,
                  value: 'x',
                  context: 'declaration' },
               initializer: null },
             { type: 'FormalParameter',
               start: 4,
               end: 5,
               pattern:
                { type: 'Identifier',
                  start: 4,
                  end: 5,
                  value: 'y',
                  context: 'declaration' },
               initializer: null } ],
          body:
           { type: 'BinaryExpression',
             start: 10,
             end: 15,
             operator: '+',
             left:
              { type: 'Identifier',
                start: 10,
                end: 11,
                value: 'x',
                context: 'variable' },
             right:
              { type: 'Identifier',
                start: 14,
                end: 15,
                value: 'y',
                context: 'variable' } } } } ] },

/** x => { return x; } **/
'identifier with function body':
{ type: 'Script',
  start: 0,
  end: 18,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 18,
       expression:
        { type: 'ArrowFunction',
          start: 0,
          end: 18,
          kind: '',
          params:
           [ { type: 'FormalParameter',
               start: 0,
               end: 1,
               pattern:
                { type: 'Identifier',
                  start: 0,
                  end: 1,
                  value: 'x',
                  context: 'declaration' },
               initializer: null } ],
          body:
           { type: 'FunctionBody',
             start: 5,
             end: 18,
             statements:
              [ { type: 'ReturnStatement',
                  start: 7,
                  end: 16,
                  argument:
                   { type: 'Identifier',
                     start: 14,
                     end: 15,
                     value: 'x',
                     context: 'variable' } } ] } } } ] },

/** (...args) => { } **/
'single rest parameter':
{ type: 'Script',
  start: 0,
  end: 16,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 16,
       expression:
        { type: 'ArrowFunction',
          start: 0,
          end: 16,
          kind: '',
          params:
           [ { type: 'RestParameter',
               start: 1,
               end: 8,
               identifier:
                { type: 'Identifier',
                  start: 4,
                  end: 8,
                  value: 'args',
                  context: 'declaration' } } ],
          body: { type: 'FunctionBody', start: 13, end: 16, statements: [] } } } ] },

/** (x, ...args) => { } **/
'rest parameter with multiple parameters':
{ type: 'Script',
  start: 0,
  end: 19,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 19,
       expression:
        { type: 'ArrowFunction',
          start: 0,
          end: 19,
          kind: '',
          params:
           [ { type: 'FormalParameter',
               start: 1,
               end: 2,
               pattern:
                { type: 'Identifier',
                  start: 1,
                  end: 2,
                  value: 'x',
                  context: 'declaration' },
               initializer: null },
             { type: 'RestParameter',
               start: 4,
               end: 11,
               identifier:
                { type: 'Identifier',
                  start: 7,
                  end: 11,
                  value: 'args',
                  context: 'declaration' } } ],
          body: { type: 'FunctionBody', start: 16, end: 19, statements: [] } } } ] },

/** (...1 + 1) => 1 **/
'rest args can only be binding identifiers': {},

/** (...a, b) => 1 **/
'rest parameter must be final parameter': {},

/** (a, ...b); **/
'rest is not allowed in paren expressions': {},

/** "use strict"; (arguments) => {} **/
'binding to arguments is disallowed in strict mode': {},

/** "use strict"; (...arguments) => {} **/
'binding rest parameter to arguments is disallowed in strict mode': {},

/** "use strict"; ({ arguments }) => {} **/
'binding to arguments with destructuring is disallowed in strict mode (1)': {},

/** "use strict"; ({ args: arguments }) => {} **/
'binding to arguments with destructuring is disallowed in strict mode (2)': {},

/** x => { "use strict"; delete x; } **/
'"use strict" prologue sets strictness of function': {},

/** (x = (delete x)) => { "use strict"; } **/
'"use strict" prologue sets strictness of default expressions': {},

/** for (x => x in y;;); **/
'arrow functions are restricted by no-in': {},

/** x || x => x **/
'arrow has correct precedence': {},

/** x
=> x **/
'new line restriction before arrow (1)': {},

/** (x)
=> x **/
'new line restriction before arrow (2)': {},

/** ()
=> x **/
'new line restriction before arrow (3)': {},

/** () + 1 **/
'empty parens not allowed without an arrow': {},


})
