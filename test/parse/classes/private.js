({

/** class C { @x } **/
'private declaration':
{ type: 'Script',
  start: 0,
  end: 14,
  statements:
   [ { type: 'ClassDeclaration',
       start: 0,
       end: 14,
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
          end: 14,
          elements:
           [ { type: 'PrivateDeclaration',
               start: 10,
               end: 12,
               static: false,
               name: { type: 'AtName', start: 10, end: 12, value: '@x' },
               initializer: null } ] } } ] },

/** class C { @x = a = 1 } **/
'private declaration with initializer':
{ type: 'Script',
  start: 0,
  end: 22,
  statements:
   [ { type: 'ClassDeclaration',
       start: 0,
       end: 22,
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
          end: 22,
          elements:
           [ { type: 'PrivateDeclaration',
               start: 10,
               end: 20,
               static: false,
               name: { type: 'AtName', start: 10, end: 12, value: '@x' },
               initializer:
                { type: 'AssignmentExpression',
                  start: 15,
                  end: 20,
                  operator: '=',
                  left:
                   { type: 'Identifier',
                     start: 15,
                     end: 16,
                     value: 'a',
                     context: 'variable' },
                  right: { type: 'NumberLiteral', start: 19, end: 20, value: 1 } } } ] } } ] },

/** class C { static @x = 1 } **/
'private static field with initializer':
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
           [ { type: 'PrivateDeclaration',
               start: 10,
               end: 23,
               static: true,
               name: { type: 'AtName', start: 17, end: 19, value: '@x' },
               initializer: { type: 'NumberLiteral', start: 22, end: 23, value: 1 } } ] } } ] },

/** class C { @x() {} } **/
'private class method':
{ type: 'Script',
  start: 0,
  end: 19,
  statements:
   [ { type: 'ClassDeclaration',
       start: 0,
       end: 19,
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
          end: 19,
          elements:
           [ { type: 'MethodDefinition',
               start: 10,
               end: 17,
               static: false,
               kind: '',
               name: { type: 'AtName', start: 10, end: 12, value: '@x' },
               params: [],
               body: { type: 'FunctionBody', start: 15, end: 17, statements: [] } } ] } } ] },

/** class C { get @x() {} set @x(v) {} } **/
'private class getter and setters not allowed': {},

/** class C { *@x() {} } **/
'private class generator method':
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
       base: null,
       body:
        { type: 'ClassBody',
          start: 8,
          end: 20,
          elements:
           [ { type: 'MethodDefinition',
               start: 10,
               end: 18,
               static: false,
               kind: 'generator',
               name: { type: 'AtName', start: 11, end: 13, value: '@x' },
               params: [],
               body: { type: 'FunctionBody', start: 16, end: 18, statements: [] } } ] } } ] },

/** class C { static @x() {} } **/
'private static class method':
{ type: 'Script',
  start: 0,
  end: 26,
  statements:
   [ { type: 'ClassDeclaration',
       start: 0,
       end: 26,
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
          end: 26,
          elements:
           [ { type: 'MethodDefinition',
               start: 10,
               end: 24,
               static: true,
               kind: '',
               name: { type: 'AtName', start: 17, end: 19, value: '@x' },
               params: [],
               body: { type: 'FunctionBody', start: 22, end: 24, statements: [] } } ] } } ] },

/** class C { static get @x() {} static set @x(v) {} } **/
'private static class getter and setter not allowed': {},

/** ({ @x: 1 }) **/
'private object property not allowed': {},

/** ({ @x() {} }) **/
'private object method not allowed': {},

/** ({ get @x() {}, set @x(v) {} }) **/
'private object getter and setter not allowed': {},

/** ({ *@x() {} }) **/
'private object generator method not allowed': {},

/** this.@x; **/
'private member expression':
{ type: 'Script',
  start: 0,
  end: 8,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 8,
       expression:
        { type: 'MemberExpression',
          start: 0,
          end: 7,
          object: { type: 'ThisExpression', start: 0, end: 4 },
          property: { type: 'AtName', start: 5, end: 7, value: '@x' },
          computed: false } } ] },

/** ({ @x: x }) = a; **/
'destructuring pattern with private property not allowed': {},

/** ({ @x }) **/
'shorthand private names not allowed in object literals': {},

/** ({ @x } = y) **/
'shorthand private names not allowed in object patterns': {},

/** class C { @x; @x; } **/
'duplicate private names not allowed - 1': {},

/** class C { @x() {}; @x; } **/
'duplicate private names not allowed - 2': {},

/** class C { @x; get @x() {} } **/
'duplicate private names not allowed - 3': {},

/** ({ @x: 1, @x: 1 }) **/
'duplicate private names not allowed - 4': {},

/** ({ get @x() {}, @x: 1 }) **/
'duplicate private names not allowed - 5': {},

/** ({ @x() {}, @x: 1 }) **/
'duplicate private names not allowed - 6': {},


});
