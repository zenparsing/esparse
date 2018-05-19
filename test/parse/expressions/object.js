({

/** ({ x: 1 }) **/
'identifier-named data propertes':
{ type: 'Script',
  start: 0,
  end: 10,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 10,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 10,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 9,
             properties:
              [ { type: 'PropertyDefinition',
                  start: 3,
                  end: 7,
                  name: { type: 'Identifier', start: 3, end: 4, value: 'x', context: '' },
                  expression: { type: 'NumberLiteral', start: 6, end: 7, value: 1 } } ],
             trailingComma: false } } } ] },

/** ({ "x": 1 }) **/
'string-named data properties':
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
                  name: { type: 'StringLiteral', start: 3, end: 6, value: 'x' },
                  expression: { type: 'NumberLiteral', start: 8, end: 9, value: 1 } } ],
             trailingComma: false } } } ] },

/** ({ 1: 1 }) **/
'number-named data properties':
{ type: 'Script',
  start: 0,
  end: 10,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 10,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 10,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 9,
             properties:
              [ { type: 'PropertyDefinition',
                  start: 3,
                  end: 7,
                  name: { type: 'NumberLiteral', start: 3, end: 4, value: 1 },
                  expression: { type: 'NumberLiteral', start: 6, end: 7, value: 1 } } ],
             trailingComma: false } } } ] },

/** ({ x: 1, }); **/
'trailing comma':
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
          end: 11,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 10,
             properties:
              [ { type: 'PropertyDefinition',
                  start: 3,
                  end: 7,
                  name: { type: 'Identifier', start: 3, end: 4, value: 'x', context: '' },
                  expression: { type: 'NumberLiteral', start: 6, end: 7, value: 1 } } ],
             trailingComma: true } } } ] },

/** ({ x }); **/
'data property without initializer':
{ type: 'Script',
  start: 0,
  end: 8,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 8,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 7,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 6,
             properties:
              [ { type: 'PropertyDefinition',
                  start: 3,
                  end: 4,
                  name:
                   { type: 'Identifier',
                     start: 3,
                     end: 4,
                     value: 'x',
                     context: 'variable' },
                  expression: null } ],
             trailingComma: false } } } ] },

/** ({ x: 1, x: 1 }) **/
'duplicate data properties allowed in sloppy mode':
{ type: 'Script',
  start: 0,
  end: 16,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 16,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 16,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 15,
             properties:
              [ { type: 'PropertyDefinition',
                  start: 3,
                  end: 7,
                  name: { type: 'Identifier', start: 3, end: 4, value: 'x', context: '' },
                  expression: { type: 'NumberLiteral', start: 6, end: 7, value: 1 } },
                { type: 'PropertyDefinition',
                  start: 9,
                  end: 13,
                  name: { type: 'Identifier', start: 9, end: 10, value: 'x', context: '' },
                  expression: { type: 'NumberLiteral', start: 12, end: 13, value: 1 } } ],
             trailingComma: false } } } ] },

/** "use strict"; ({ package: 0 }); **/
'strict mode keywords are allowed as property names':
{ type: 'Script',
  start: 0,
  end: 31,
  statements:
   [ { type: 'Directive',
       start: 0,
       end: 13,
       value: 'use strict',
       expression: { type: 'StringLiteral', start: 0, end: 12, value: 'use strict' } },
     { type: 'ExpressionStatement',
       start: 14,
       end: 31,
       expression:
        { type: 'ParenExpression',
          start: 14,
          end: 30,
          expression:
           { type: 'ObjectLiteral',
             start: 15,
             end: 29,
             properties:
              [ { type: 'PropertyDefinition',
                  start: 17,
                  end: 27,
                  name:
                   { type: 'Identifier',
                     start: 17,
                     end: 24,
                     value: 'package',
                     context: '' },
                  expression: { type: 'NumberLiteral', start: 26, end: 27, value: 0 } } ],
             trailingComma: false } } } ] },

/** "use strict"; ({ x: 1, x: 1 }); **/
'duplicate data properties allowed in strict mode':
{ type: 'Script',
  start: 0,
  end: 31,
  statements:
   [ { type: 'Directive',
       start: 0,
       end: 13,
       value: 'use strict',
       expression: { type: 'StringLiteral', start: 0, end: 12, value: 'use strict' } },
     { type: 'ExpressionStatement',
       start: 14,
       end: 31,
       expression:
        { type: 'ParenExpression',
          start: 14,
          end: 30,
          expression:
           { type: 'ObjectLiteral',
             start: 15,
             end: 29,
             properties:
              [ { type: 'PropertyDefinition',
                  start: 17,
                  end: 21,
                  name: { type: 'Identifier', start: 17, end: 18, value: 'x', context: '' },
                  expression: { type: 'NumberLiteral', start: 20, end: 21, value: 1 } },
                { type: 'PropertyDefinition',
                  start: 23,
                  end: 27,
                  name: { type: 'Identifier', start: 23, end: 24, value: 'x', context: '' },
                  expression: { type: 'NumberLiteral', start: 26, end: 27, value: 1 } } ],
             trailingComma: false } } } ] },

/** ({ get x() {}, get x() {} }); **/
'duplicate getters allowed':
{ type: 'Script',
  start: 0,
  end: 29,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 29,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 28,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 27,
             properties:
              [ { type: 'MethodDefinition',
                  start: 3,
                  end: 13,
                  static: false,
                  kind: 'get',
                  name: { type: 'Identifier', start: 7, end: 8, value: 'x', context: '' },
                  params: [],
                  body: { type: 'FunctionBody', start: 11, end: 13, statements: [] } },
                { type: 'MethodDefinition',
                  start: 15,
                  end: 25,
                  static: false,
                  kind: 'get',
                  name: { type: 'Identifier', start: 19, end: 20, value: 'x', context: '' },
                  params: [],
                  body: { type: 'FunctionBody', start: 23, end: 25, statements: [] } } ],
             trailingComma: false } } } ] },

/** ({ set x(val) {}, set x(val) {} }); **/
'duplicate setters allowed':
{ type: 'Script',
  start: 0,
  end: 35,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 35,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 34,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 33,
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
                  body: { type: 'FunctionBody', start: 14, end: 16, statements: [] } },
                { type: 'MethodDefinition',
                  start: 18,
                  end: 31,
                  static: false,
                  kind: 'set',
                  name: { type: 'Identifier', start: 22, end: 23, value: 'x', context: '' },
                  params:
                   [ { type: 'FormalParameter',
                       start: 24,
                       end: 27,
                       pattern:
                        { type: 'Identifier',
                          start: 24,
                          end: 27,
                          value: 'val',
                          context: 'declaration' },
                       initializer: null } ],
                  body: { type: 'FunctionBody', start: 29, end: 31, statements: [] } } ],
             trailingComma: false } } } ] },

/** ({ get x() {}, x: 1 }); **/
'conflict between getter and data property allowed':
{ type: 'Script',
  start: 0,
  end: 23,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 23,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 22,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 21,
             properties:
              [ { type: 'MethodDefinition',
                  start: 3,
                  end: 13,
                  static: false,
                  kind: 'get',
                  name: { type: 'Identifier', start: 7, end: 8, value: 'x', context: '' },
                  params: [],
                  body: { type: 'FunctionBody', start: 11, end: 13, statements: [] } },
                { type: 'PropertyDefinition',
                  start: 15,
                  end: 19,
                  name: { type: 'Identifier', start: 15, end: 16, value: 'x', context: '' },
                  expression: { type: 'NumberLiteral', start: 18, end: 19, value: 1 } } ],
             trailingComma: false } } } ] },

/** ({ set x(val) {}, x: 1 }); **/
'conflict between setter and data property allowed':
{ type: 'Script',
  start: 0,
  end: 26,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 26,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 25,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 24,
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
                  body: { type: 'FunctionBody', start: 14, end: 16, statements: [] } },
                { type: 'PropertyDefinition',
                  start: 18,
                  end: 22,
                  name: { type: 'Identifier', start: 18, end: 19, value: 'x', context: '' },
                  expression: { type: 'NumberLiteral', start: 21, end: 22, value: 1 } } ],
             trailingComma: false } } } ] },

/** ({ x(val) {}, x: 1 }); **/
'conflict between method and data property allowed':
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
                  end: 12,
                  static: false,
                  kind: '',
                  name: { type: 'Identifier', start: 3, end: 4, value: 'x', context: '' },
                  params:
                   [ { type: 'FormalParameter',
                       start: 5,
                       end: 8,
                       pattern:
                        { type: 'Identifier',
                          start: 5,
                          end: 8,
                          value: 'val',
                          context: 'declaration' },
                       initializer: null } ],
                  body: { type: 'FunctionBody', start: 10, end: 12, statements: [] } },
                { type: 'PropertyDefinition',
                  start: 14,
                  end: 18,
                  name: { type: 'Identifier', start: 14, end: 15, value: 'x', context: '' },
                  expression: { type: 'NumberLiteral', start: 17, end: 18, value: 1 } } ],
             trailingComma: false } } } ] },

/** ({ x, x }) **/
'duplicate data properties without initializers allowed':
{ type: 'Script',
  start: 0,
  end: 10,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 10,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 10,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 9,
             properties:
              [ { type: 'PropertyDefinition',
                  start: 3,
                  end: 4,
                  name:
                   { type: 'Identifier',
                     start: 3,
                     end: 4,
                     value: 'x',
                     context: 'variable' },
                  expression: null },
                { type: 'PropertyDefinition',
                  start: 6,
                  end: 7,
                  name:
                   { type: 'Identifier',
                     start: 6,
                     end: 7,
                     value: 'x',
                     context: 'variable' },
                  expression: null } ],
             trailingComma: false } } } ] },

/** ({ get x() {}, set x(val) {} }); **/
'getter and setter with same name':
{ type: 'Script',
  start: 0,
  end: 32,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 32,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 31,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 30,
             properties:
              [ { type: 'MethodDefinition',
                  start: 3,
                  end: 13,
                  static: false,
                  kind: 'get',
                  name: { type: 'Identifier', start: 7, end: 8, value: 'x', context: '' },
                  params: [],
                  body: { type: 'FunctionBody', start: 11, end: 13, statements: [] } },
                { type: 'MethodDefinition',
                  start: 15,
                  end: 28,
                  static: false,
                  kind: 'set',
                  name: { type: 'Identifier', start: 19, end: 20, value: 'x', context: '' },
                  params:
                   [ { type: 'FormalParameter',
                       start: 21,
                       end: 24,
                       pattern:
                        { type: 'Identifier',
                          start: 21,
                          end: 24,
                          value: 'val',
                          context: 'declaration' },
                       initializer: null } ],
                  body: { type: 'FunctionBody', start: 26, end: 28, statements: [] } } ],
             trailingComma: false } } } ] },

/** ({ x = 1 }) **/
'object pattern initializer not allowed': {},

/** ({ delete }) **/
'shorthand data property cannot be a reserved word': {},

/** "use strict"; ({ package }); **/
'shorthand data property cannot be a strict reserved word in strict mode': {},

/** ({ package }) **/
'shorthand data property with strict reserved word':
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
          end: 13,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 12,
             properties:
              [ { type: 'PropertyDefinition',
                  start: 3,
                  end: 10,
                  name:
                   { type: 'Identifier',
                     start: 3,
                     end: 10,
                     value: 'package',
                     context: 'variable',
                     error: 'package cannot be used as an identifier in strict mode' },
                  expression: null } ],
             trailingComma: false } } } ] },


})
