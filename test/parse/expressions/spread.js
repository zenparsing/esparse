({

/** f(...a) **/
'spread in function call':
{ type: 'Script',
  start: 0,
  end: 7,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 7,
       expression:
        { type: 'CallExpression',
          start: 0,
          end: 7,
          callee:
           { type: 'Identifier',
             start: 0,
             end: 1,
             value: 'f',
             context: 'variable' },
          arguments:
           [ { type: 'SpreadExpression',
               start: 2,
               end: 6,
               expression:
                { type: 'Identifier',
                  start: 5,
                  end: 6,
                  value: 'a',
                  context: 'variable' } } ],
          trailingComma: false } } ] },

/** f(a, ...1 + 1, b) **/
'spread allows any arbitrary expression':
{ type: 'Script',
  start: 0,
  end: 17,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 17,
       expression:
        { type: 'CallExpression',
          start: 0,
          end: 17,
          callee:
           { type: 'Identifier',
             start: 0,
             end: 1,
             value: 'f',
             context: 'variable' },
          arguments:
           [ { type: 'Identifier',
               start: 2,
               end: 3,
               value: 'a',
               context: 'variable' },
             { type: 'SpreadExpression',
               start: 5,
               end: 13,
               expression:
                { type: 'BinaryExpression',
                  start: 8,
                  end: 13,
                  operator: '+',
                  left: { type: 'NumberLiteral', start: 8, end: 9, value: 1 },
                  right: { type: 'NumberLiteral', start: 12, end: 13, value: 1 } } },
             { type: 'Identifier',
               start: 15,
               end: 16,
               value: 'b',
               context: 'variable' } ],
             trailingComma: false } } ] },

/** [...a] **/
'spread in an array literal':
{ type: 'Script',
  start: 0,
  end: 6,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 6,
       expression:
        { type: 'ArrayLiteral',
          start: 0,
          end: 6,
          elements:
           [ { type: 'SpreadExpression',
               start: 1,
               end: 5,
               expression:
                { type: 'Identifier',
                  start: 4,
                  end: 5,
                  value: 'a',
                  context: 'variable' } } ],
          trailingComma: false } } ] },

/** [...a] = [] **/
'spread in array assignment pattern':
{ type: 'Script',
  start: 0,
  end: 11,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 11,
       expression:
        { type: 'AssignmentExpression',
          start: 0,
          end: 11,
          operator: '=',
          left:
           { type: 'ArrayPattern',
             start: 0,
             end: 6,
             elements:
              [ { type: 'PatternRestElement',
                  start: 1,
                  end: 5,
                  pattern:
                   { type: 'Identifier',
                     start: 4,
                     end: 5,
                     value: 'a',
                     context: 'variable' } } ],
             trailingComma: false },
          right:
           { type: 'ArrayLiteral',
             start: 9,
             end: 11,
             elements: [],
             trailingComma: false } } } ] },

/** (...a) **/
'spread expressions are not allowed outside of arrays or function calls':
{},

})
