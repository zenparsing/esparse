({

/** x = [ 1, 2,, 3, ] **/
'array literal with holes and trailing comma':
{ type: 'Script',
  start: 0,
  end: 17,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 17,
       expression:
        { type: 'AssignmentExpression',
          start: 0,
          end: 17,
          operator: '=',
          left:
           { type: 'Identifier',
             start: 0,
             end: 1,
             value: 'x',
             context: 'variable' },
          right:
           { type: 'ArrayLiteral',
             start: 4,
             end: 17,
             elements:
              [ { type: 'NumberLiteral', start: 6, end: 7, value: 1 },
                { type: 'NumberLiteral', start: 9, end: 10, value: 2 },
                null,
                { type: 'NumberLiteral', start: 13, end: 14, value: 3 } ],
             trailingComma: true } } } ] },

})
