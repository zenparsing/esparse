({

/** function f(a, b,) {} **/
'trailing comma allowed in formal parameters': {
  type: 'Script',
  start: 0,
  end: 20,
  statements:
   [ {
       type: 'FunctionDeclaration',
       start: 0,
       end: 20,
       kind: '',
       identifier:
        {
          type: 'Identifier',
          start: 9,
          end: 10,
          value: 'f',
          context: 'declaration' },
       params:
        [ {
            type: 'FormalParameter',
            start: 11,
            end: 12,
            pattern:
             {
               type: 'Identifier',
               start: 11,
               end: 12,
               value: 'a',
               context: 'declaration' },
            initializer: null },
          {
            type: 'FormalParameter',
            start: 14,
            end: 15,
            pattern:
             {
               type: 'Identifier',
               start: 14,
               end: 15,
               value: 'b',
               context: 'declaration' },
            initializer: null } ],
       body: { type: 'FunctionBody', start: 18, end: 20, statements: [] } } ] },

/** m(a,) **/
"trailing comma allowed in call expressions": {
  type: 'Script',
  start: 0,
  end: 5,
  statements:
   [ {
       type: 'ExpressionStatement',
       start: 0,
       end: 5,
       expression:
        {
          type: 'CallExpression',
          start: 0,
          end: 5,
          callee:
           {
             type: 'Identifier',
             start: 0,
             end: 1,
             value: 'm',
             context: 'variable' },
          arguments:
           [ {
               type: 'Identifier',
               start: 2,
               end: 3,
               value: 'a',
               context: 'variable' } ],
          trailingComma: true } } ] },

/** (a,) => 1 **/
'trailing comma allowed in arrow functions': {
  type: 'Script',
  start: 0,
  end: 9,
  statements:
   [ {
       type: 'ExpressionStatement',
       start: 0,
       end: 9,
       expression:
        {
          type: 'ArrowFunction',
          start: 0,
          end: 9,
          kind: '',
          params:
           [ {
               type: 'FormalParameter',
               start: 1,
               end: 2,
               pattern:
                {
                  type: 'Identifier',
                  start: 1,
                  end: 2,
                  value: 'a',
                  context: 'declaration' },
               initializer: null } ],
          body: { type: 'NumberLiteral', start: 8, end: 9, value: 1 } } } ] },

/** async (m,) => 1 **/
'trailing comma allowed in async arrow function': {
  type: 'Script',
  start: 0,
  end: 15,
  statements:
   [ {
       type: 'ExpressionStatement',
       start: 0,
       end: 15,
       expression:
        {
          type: 'ArrowFunction',
          start: 0,
          end: 15,
          kind: 'async',
          params:
           [ {
               type: 'FormalParameter',
               start: 7,
               end: 8,
               pattern:
                {
                  type: 'Identifier',
                  start: 7,
                  end: 8,
                  value: 'm',
                  context: 'declaration' },
               initializer: null } ],
          body: { type: 'NumberLiteral', start: 14, end: 15, value: 1 } } } ] },

/** (x,); **/
'trailing comma not allowed in paren expression': {},

/** function f(...x,) {} **/
'trailing comma not allowed after rest parameter': {},

/** function f(,) {} **/
'trailing comma not allowed in empty parameter list': {},

/** (,) => {} **/
'trailing comma not allowed in arrow empty parameter list': {},

/** (...x,) => {} **/
'trailing comma not allowed in arrow after rest parameter': {},

/** async (...x,) => {} **/
'trailing comma not allowed in async arrow after rest parameter': {},

});
