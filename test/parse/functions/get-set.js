({

/** ({ get x() {} }); **/
'object literal with getter':
{ type: 'Script',
  start: 0,
  end: 17,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 17,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 16,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 15,
             properties:
              [ { type: 'MethodDefinition',
                  start: 3,
                  end: 13,
                  static: false,
                  kind: 'get',
                  name: { type: 'Identifier', start: 7, end: 8, value: 'x', context: '' },
                  params: [],
                  body: { type: 'FunctionBody', start: 11, end: 13, statements: [] } } ],
             trailingComma: false } } } ] },

/** ({ set x(val) {} }); **/
'object literal with setter':
{ type: 'Script',
  start: 0,
  end: 20,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 20,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 19,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 18,
             properties:
              [ { type: 'MethodDefinition',
                  start: 3,
                  end: 16,
                  static: false,
                  kind: 'set',
                  name: { type: 'Identifier', start: 7, end: 8, value: 'x', context: '' },
                  params:
                   [ { type: 'FormalParameter',
                       start: 9,
                       end: 12,
                       pattern:
                        { type: 'Identifier',
                          start: 9,
                          end: 12,
                          value: 'val',
                          context: 'declaration' },
                       initializer: null } ],
                  body: { type: 'FunctionBody', start: 14, end: 16, statements: [] } } ],
             trailingComma: false } } } ] },

/** ({ get: 0, set: 0 }); **/
'get and set are valid property names':
{ type: 'Script',
  start: 0,
  end: 21,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 21,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 20,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 19,
             properties:
              [ { type: 'PropertyDefinition',
                  start: 3,
                  end: 9,
                  name: { type: 'Identifier', start: 3, end: 6, value: 'get', context: '' },
                  expression: { type: 'NumberLiteral', start: 8, end: 9, value: 0 } },
                { type: 'PropertyDefinition',
                  start: 11,
                  end: 17,
                  name:
                   { type: 'Identifier',
                     start: 11,
                     end: 14,
                     value: 'set',
                     context: '' },
                  expression: { type: 'NumberLiteral', start: 16, end: 17, value: 0 } } ],
             trailingComma: false } } } ] },

/** ({ set x({ y }) {} }); **/
'setter can have a destructuring param':
{ type: 'Script',
  start: 0,
  end: 22,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 22,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 21,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 20,
             properties:
              [ { type: 'MethodDefinition',
                  start: 3,
                  end: 18,
                  static: false,
                  kind: 'set',
                  name: { type: 'Identifier', start: 7, end: 8, value: 'x', context: '' },
                  params:
                   [ { type: 'FormalParameter',
                       start: 9,
                       end: 14,
                       pattern:
                        { type: 'ObjectPattern',
                          start: 9,
                          end: 14,
                          properties:
                           [ { type: 'PatternProperty',
                               start: 11,
                               end: 12,
                               name:
                                { type: 'Identifier',
                                  start: 11,
                                  end: 12,
                                  value: 'y',
                                  context: 'declaration' },
                               pattern: null,
                               initializer: null } ],
                          trailingComma: false },
                       initializer: null } ],
                  body: { type: 'FunctionBody', start: 16, end: 18, statements: [] } } ],
             trailingComma: false } } } ] },

/** ({ get x(val) {} }); **/
'getter cannot have any parameters': {},

/** ({ set x() {} }); **/
'setter must have a single parameter - 1': {},

/** ({ set x(a, b) {} }); **/
'setter must have a single parameter - 2': {},

/** ({ set x(...args) {} }); **/
'setter cannot have a rest parameter': {},

/** ({ set x(val = 0) {} }); **/
'setter cannot have a parameter default': {},

});
