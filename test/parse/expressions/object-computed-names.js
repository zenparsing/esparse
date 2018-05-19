({

/** ({ [x]: 1 }) **/
'computed data properties':
{ type: 'Script',
  start: 0,
  end: 12,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 12,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 12,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 11,
             properties:
              [ { type: 'PropertyDefinition',
                  start: 3,
                  end: 9,
                  name:
                   { type: 'ComputedPropertyName',
                     start: 3,
                     end: 6,
                     expression:
                      { type: 'Identifier',
                        start: 4,
                        end: 5,
                        value: 'x',
                        context: 'variable' } },
                  expression: { type: 'NumberLiteral', start: 8, end: 9, value: 1 } } ],
             trailingComma: false } } } ] },

/** ({ [x]() {} }) **/
'computed method names':
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
          end: 14,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 13,
             properties:
              [ { type: 'MethodDefinition',
                  start: 3,
                  end: 11,
                  static: false,
                  kind: '',
                  name:
                   { type: 'ComputedPropertyName',
                     start: 3,
                     end: 6,
                     expression:
                      { type: 'Identifier',
                        start: 4,
                        end: 5,
                        value: 'x',
                        context: 'variable' } },
                  params: [],
                  body: { type: 'FunctionBody', start: 9, end: 11, statements: [] } } ],
             trailingComma: false } } } ] },

/** ({ get [x]() {}, set [x](value) {} }) **/
'computed accessors':
{ type: 'Script',
  start: 0,
  end: 37,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 37,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 37,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 36,
             properties:
              [ { type: 'MethodDefinition',
                  start: 3,
                  end: 15,
                  static: false,
                  kind: 'get',
                  name:
                   { type: 'ComputedPropertyName',
                     start: 7,
                     end: 10,
                     expression:
                      { type: 'Identifier',
                        start: 8,
                        end: 9,
                        value: 'x',
                        context: 'variable' } },
                  params: [],
                  body: { type: 'FunctionBody', start: 13, end: 15, statements: [] } },
                { type: 'MethodDefinition',
                  start: 17,
                  end: 34,
                  static: false,
                  kind: 'set',
                  name:
                   { type: 'ComputedPropertyName',
                     start: 21,
                     end: 24,
                     expression:
                      { type: 'Identifier',
                        start: 22,
                        end: 23,
                        value: 'x',
                        context: 'variable' } },
                  params:
                   [ { type: 'FormalParameter',
                       start: 25,
                       end: 30,
                       pattern:
                        { type: 'Identifier',
                          start: 25,
                          end: 30,
                          value: 'value',
                          context: 'declaration' },
                       initializer: null } ],
                  body: { type: 'FunctionBody', start: 32, end: 34, statements: [] } } ],
             trailingComma: false } } } ] }
,

/** ({ *[x]() {} }) **/
'computed generators':
{ type: 'Script',
  start: 0,
  end: 15,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 15,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 15,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 14,
             properties:
              [ { type: 'MethodDefinition',
                  start: 3,
                  end: 12,
                  static: false,
                  kind: 'generator',
                  name:
                   { type: 'ComputedPropertyName',
                     start: 4,
                     end: 7,
                     expression:
                      { type: 'Identifier',
                        start: 5,
                        end: 6,
                        value: 'x',
                        context: 'variable' } },
                  params: [],
                  body: { type: 'FunctionBody', start: 10, end: 12, statements: [] } } ],
             trailingComma: false } } } ] },

/** "use strict"; ({ [x]: 1, [x]: 1 }) **/
'computed names are not checked for duplicate keys':
{ type: 'Script',
  start: 0,
  end: 34,
  statements:
   [ { type: 'Directive',
       start: 0,
       end: 13,
       value: 'use strict',
       expression: { type: 'StringLiteral', start: 0, end: 12, value: 'use strict' } },
     { type: 'ExpressionStatement',
       start: 14,
       end: 34,
       expression:
        { type: 'ParenExpression',
          start: 14,
          end: 34,
          expression:
           { type: 'ObjectLiteral',
             start: 15,
             end: 33,
             properties:
              [ { type: 'PropertyDefinition',
                  start: 17,
                  end: 23,
                  name:
                   { type: 'ComputedPropertyName',
                     start: 17,
                     end: 20,
                     expression:
                      { type: 'Identifier',
                        start: 18,
                        end: 19,
                        value: 'x',
                        context: 'variable' } },
                  expression: { type: 'NumberLiteral', start: 22, end: 23, value: 1 } },
                { type: 'PropertyDefinition',
                  start: 25,
                  end: 31,
                  name:
                   { type: 'ComputedPropertyName',
                     start: 25,
                     end: 28,
                     expression:
                      { type: 'Identifier',
                        start: 26,
                        end: 27,
                        value: 'x',
                        context: 'variable' } },
                  expression: { type: 'NumberLiteral', start: 30, end: 31, value: 1 } } ],
             trailingComma: false } } } ] },

})
