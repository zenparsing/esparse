({

/** ({ x() {} }); **/
'object literal methods':
{ type: 'Script',
  start: 0,
  end: 13,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 13,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 12,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 11,
             properties:
              [ { type: 'MethodDefinition',
                  start: 3,
                  end: 9,
                  static: false,
                  kind: '',
                  name: { type: 'Identifier', start: 3, end: 4, value: 'x', context: '' },
                  params: [],
                  body: { type: 'FunctionBody', start: 7, end: 9, statements: [] } } ],
             trailingComma: false } } } ] },

/** ({ *x() {} }); **/
'generator method':
{ type: 'Script',
  start: 0,
  end: 14,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 14,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 13,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 12,
             properties:
              [ { type: 'MethodDefinition',
                  start: 3,
                  end: 10,
                  static: false,
                  kind: 'generator',
                  name: { type: 'Identifier', start: 4, end: 5, value: 'x', context: '' },
                  params: [],
                  body: { type: 'FunctionBody', start: 8, end: 10, statements: [] } } ],
             trailingComma: false } } } ] },

})
