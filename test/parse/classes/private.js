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
           [ { type: 'PrivateFieldDefinition',
               start: 10,
               end: 12,
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
           [ { type: 'PrivateFieldDefinition',
               start: 10,
               end: 20,
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

/** class C { @x; m() { @x } } **/
'shorthand private references':
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
           [ { type: 'PrivateFieldDefinition',
               start: 10,
               end: 13,
               name: { type: 'AtName', start: 10, end: 12, value: '@x' },
               initializer: null },
             { type: 'MethodDefinition',
               start: 14,
               end: 24,
               static: false,
               kind: '',
               name: { type: 'Identifier', start: 14, end: 15, value: 'm', context: '' },
               params: [],
               body:
                { type: 'FunctionBody',
                  start: 18,
                  end: 24,
                  statements:
                   [ { type: 'ExpressionStatement',
                       start: 20,
                       end: 22,
                       expression: { type: 'AtName', start: 20, end: 22, value: '@x' } } ] } } ] } } ] },

/** class C { static @x = 1 } **/
'private static fields not allowed': {},

/** class C { @x() {} } **/
'private methods not allowed': {},

/** class C { get @x() {} set @x(v) {} } **/
'private getter and setters not allowed': {},

/** class C { *@x() {} } **/
'private generator method not allowed': {},

/** class C { static @x() {} } **/
'private static class method': {},

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
