({

/** class C {} **/
'class declaration':
{ type: 'Script',
  start: 0,
  end: 10,
  statements:
   [ { type: 'ClassDeclaration',
       start: 0,
       end: 10,
       identifier:
        { type: 'Identifier',
          start: 6,
          end: 7,
          value: 'C',
          context: 'declaration' },
       base: null,
       body: { type: 'ClassBody', start: 8, end: 10, elements: [] } } ] },

/** (class C {}); **/
'class expression':
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
           { type: 'ClassExpression',
             start: 1,
             end: 11,
             identifier:
              { type: 'Identifier',
                start: 7,
                end: 8,
                value: 'C',
                context: 'declaration' },
             base: null,
             body: { type: 'ClassBody', start: 9, end: 11, elements: [] } } } } ] },

/** class C extends B {} **/
'class with extends':
{ type: 'Script',
  start: 0,
  end: 20,
  statements:
   [ { type: 'ClassDeclaration',
       start: 0,
       end: 20,
       identifier:
        { type: 'Identifier',
          start: 6,
          end: 7,
          value: 'C',
          context: 'declaration' },
       base:
        { type: 'Identifier',
          start: 16,
          end: 17,
          value: 'B',
          context: 'variable' },
       body: { type: 'ClassBody', start: 18, end: 20, elements: [] } } ] },

/** class C { static S() {} } **/
'static method':
{ type: 'Script',
  start: 0,
  end: 25,
  statements:
   [ { type: 'ClassDeclaration',
       start: 0,
       end: 25,
       identifier:
        { type: 'Identifier',
          start: 6,
          end: 7,
          value: 'C',
          context: 'declaration' },
       base: null,
       body:
        { type: 'ClassBody',
          start: 8,
          end: 25,
          elements:
           [ { type: 'ClassElement',
               start: 10,
               end: 23,
               static: true,
               definition:
                { type: 'MethodDefinition',
                  start: 17,
                  end: 23,
                  kind: '',
                  name: { type: 'Identifier', start: 17, end: 18, value: 'S', context: '' },
                  params: [],
                  body: { type: 'FunctionBody', start: 21, end: 23, statements: [] } } } ] } } ] },

/** class C { m() { new super; } } **/
'new super without argument list':
{ type: 'Script',
  start: 0,
  end: 30,
  statements:
   [ { type: 'ClassDeclaration',
       start: 0,
       end: 30,
       identifier:
        { type: 'Identifier',
          start: 6,
          end: 7,
          value: 'C',
          context: 'declaration' },
       base: null,
       body:
        { type: 'ClassBody',
          start: 8,
          end: 30,
          elements:
           [ { type: 'ClassElement',
               start: 10,
               end: 28,
               static: false,
               definition:
                { type: 'MethodDefinition',
                  start: 10,
                  end: 28,
                  kind: '',
                  name: { type: 'Identifier', start: 10, end: 11, value: 'm', context: '' },
                  params: [],
                  body:
                   { type: 'FunctionBody',
                     start: 14,
                     end: 28,
                     statements:
                      [ { type: 'ExpressionStatement',
                          start: 16,
                          end: 26,
                          expression:
                           { type: 'NewExpression',
                             start: 16,
                             end: 25,
                             callee: { type: 'SuperExpression', start: 20, end: 25 },
                             arguments: null } } ] } } } ] } } ] },

/** class C extends A + B {} **/
'extends clause does not allow assignment expression': {},

/** (class C extends A + B {}) **/
'extends clause does not allow assignment expression in class expression': {},

/** super() **/
'super cannot appear outside of a function': {},

/** class C { a() {} a() {} } **/
'duplicate methods are allowed':
{ type: 'Script',
  start: 0,
  end: 25,
  statements:
   [ { type: 'ClassDeclaration',
       start: 0,
       end: 25,
       identifier:
        { type: 'Identifier',
          start: 6,
          end: 7,
          value: 'C',
          context: 'declaration' },
       base: null,
       body:
        { type: 'ClassBody',
          start: 8,
          end: 25,
          elements:
           [ { type: 'ClassElement',
               start: 10,
               end: 16,
               static: false,
               definition:
                { type: 'MethodDefinition',
                  start: 10,
                  end: 16,
                  kind: '',
                  name: { type: 'Identifier', start: 10, end: 11, value: 'a', context: '' },
                  params: [],
                  body: { type: 'FunctionBody', start: 14, end: 16, statements: [] } } },
             { type: 'ClassElement',
               start: 17,
               end: 23,
               static: false,
               definition:
                { type: 'MethodDefinition',
                  start: 17,
                  end: 23,
                  kind: '',
                  name: { type: 'Identifier', start: 17, end: 18, value: 'a', context: '' },
                  params: [],
                  body: { type: 'FunctionBody', start: 21, end: 23, statements: [] } } } ] } } ] },

/** class C { static a() {} static a() {} } **/
'duplicate static methods are allowed':
{ type: 'Script',
  start: 0,
  end: 39,
  statements:
   [ { type: 'ClassDeclaration',
       start: 0,
       end: 39,
       identifier:
        { type: 'Identifier',
          start: 6,
          end: 7,
          value: 'C',
          context: 'declaration' },
       base: null,
       body:
        { type: 'ClassBody',
          start: 8,
          end: 39,
          elements:
           [ { type: 'ClassElement',
               start: 10,
               end: 23,
               static: true,
               definition:
                { type: 'MethodDefinition',
                  start: 17,
                  end: 23,
                  kind: '',
                  name: { type: 'Identifier', start: 17, end: 18, value: 'a', context: '' },
                  params: [],
                  body: { type: 'FunctionBody', start: 21, end: 23, statements: [] } } },
             { type: 'ClassElement',
               start: 24,
               end: 37,
               static: true,
               definition:
                { type: 'MethodDefinition',
                  start: 31,
                  end: 37,
                  kind: '',
                  name: { type: 'Identifier', start: 31, end: 32, value: 'a', context: '' },
                  params: [],
                  body: { type: 'FunctionBody', start: 35, end: 37, statements: [] } } } ] } } ] },

/** class C { a() {} static a() {} } **/
'static and instance methods may have the same name':
{ type: 'Script',
  start: 0,
  end: 32,
  statements:
   [ { type: 'ClassDeclaration',
       start: 0,
       end: 32,
       identifier:
        { type: 'Identifier',
          start: 6,
          end: 7,
          value: 'C',
          context: 'declaration' },
       base: null,
       body:
        { type: 'ClassBody',
          start: 8,
          end: 32,
          elements:
           [ { type: 'ClassElement',
               start: 10,
               end: 16,
               static: false,
               definition:
                { type: 'MethodDefinition',
                  start: 10,
                  end: 16,
                  kind: '',
                  name: { type: 'Identifier', start: 10, end: 11, value: 'a', context: '' },
                  params: [],
                  body: { type: 'FunctionBody', start: 14, end: 16, statements: [] } } },
             { type: 'ClassElement',
               start: 17,
               end: 30,
               static: true,
               definition:
                { type: 'MethodDefinition',
                  start: 24,
                  end: 30,
                  kind: '',
                  name: { type: 'Identifier', start: 24, end: 25, value: 'a', context: '' },
                  params: [],
                  body: { type: 'FunctionBody', start: 28, end: 30, statements: [] } } } ] } } ] },

/** class C { get constructor() {} } **/
'special constructor method not allowed - 1': {},

/** class C { set constructor() {} } **/
'special constructor method not allowed - 2': {},

/** class C { *constructor() {} } **/
'special constructor method not allowed - 3': {},

/** class C { static prototype() {} } **/
'static prototype method not allowed - 1': {},

/** class C { static get prototype() {} } **/
'static prototype method not allowed - 2': {},

/** class C { static set prototype() {} } **/
'static prototype method not allowed - 3': {},

/** class C { static *prototype() {} } **/
'static prototype method not allowed - 4': {},

/** function() { super`kasdf`; } **/
'super followed by template not allowed': {},


})
