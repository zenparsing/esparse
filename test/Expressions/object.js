{

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
                  expression: { type: 'NumberLiteral', start: 6, end: 7, value: 1 } } ] } } } ] },

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
                  expression: { type: 'NumberLiteral', start: 8, end: 9, value: 1 } } ] } } } ] },

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
                  expression: { type: 'NumberLiteral', start: 6, end: 7, value: 1 } } ] } } } ] },

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
                  name: { type: 'Identifier', start: 3, end: 4, value: 'x', context: 'variable' },
                  expression: null } ] } } } ] },

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
                  expression: { type: 'NumberLiteral', start: 12, end: 13, value: 1 } } ] } } } ] },

/** "use strict"; ({ package: 0 }); **/
'strict mode keywords are allowed as property names': 
{ type: 'Script',
  start: 0,
  end: 31,
  statements: 
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 13,
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
                  expression: { type: 'NumberLiteral', start: 26, end: 27, value: 0 } } ] } } } ] },

/** "use strict"; ({ x: 1, x: 1 }); **/
'duplicate data properties not allowed in strict mode': {},

/** ({ get x() {}, get x() {} }); **/
'duplicate getters not allowed': {},

/** ({ set x() {}, set x() {} }); **/
'duplicate setters not allowed': {},

/** ({ get x() {}, x: 1 }); **/
'conflict between getter and data property not allowed': {},

/** ({ set x() {}, x: 1 }); **/
'conflict between setter and data property not allowed': {},

/** ({ x() {}, x: 1 }); **/
'conflict between method and data property not allowed': {},

/** ({ x, x }) **/
'duplicate data properties without initializers not allowed': {},

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
                  kind: 'get',
                  name: { type: 'Identifier', start: 7, end: 8, value: 'x', context: '' },
                  params: [],
                  body: { type: 'FunctionBody', start: 11, end: 13, statements: [] } },
                { type: 'MethodDefinition',
                  start: 15,
                  end: 28,
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
                  body: { type: 'FunctionBody', start: 26, end: 28, statements: [] } } ] } } } ] },

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
                     context: 'variable' },
                  expression: null } ] } } } ] },


};