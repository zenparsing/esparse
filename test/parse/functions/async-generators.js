({

/** async function *f() {} **/
'async generator declaration':
{ type: 'Script',
  start: 0,
  end: 22,
  statements:
   [ { type: 'FunctionDeclaration',
       start: 0,
       end: 22,
       kind: 'async-generator',
       identifier:
        { type: 'Identifier',
          start: 16,
          end: 17,
          value: 'f',
          context: 'declaration' },
       params: [],
       body: { type: 'FunctionBody', start: 20, end: 22, statements: [] } } ] },

/** (async function *f() {}); **/
'async generator expression':
{ type: 'Script',
  start: 0,
  end: 25,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 25,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 24,
          expression:
           { type: 'FunctionExpression',
             start: 1,
             end: 23,
             kind: 'async-generator',
             identifier:
              { type: 'Identifier',
                start: 17,
                end: 18,
                value: 'f',
                context: 'declaration' },
             params: [],
             body: { type: 'FunctionBody', start: 21, end: 23, statements: [] } } } } ] },

/** class C { async *ag() { await x; yield y; } } **/
'async generator methods':
{ type: 'Script',
  start: 0,
  end: 45,
  statements:
   [ { type: 'ClassDeclaration',
       start: 0,
       end: 45,
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
          end: 45,
          elements:
           [ { type: 'MethodDefinition',
               start: 10,
               end: 43,
               static: false,
               kind: 'async-generator',
               name:
                { type: 'Identifier',
                  start: 17,
                  end: 19,
                  value: 'ag',
                  context: '' },
               params: [],
               body:
                { type: 'FunctionBody',
                  start: 22,
                  end: 43,
                  statements:
                   [ { type: 'ExpressionStatement',
                       start: 24,
                       end: 32,
                       expression:
                        { type: 'UnaryExpression',
                          start: 24,
                          end: 31,
                          operator: 'await',
                          expression:
                           { type: 'Identifier',
                             start: 30,
                             end: 31,
                             value: 'x',
                             context: 'variable' } } },
                     { type: 'ExpressionStatement',
                       start: 33,
                       end: 41,
                       expression:
                        { type: 'YieldExpression',
                          start: 33,
                          end: 40,
                          delegate: false,
                          expression:
                           { type: 'Identifier',
                             start: 39,
                             end: 40,
                             value: 'y',
                             context: 'variable' } } } ] } } ] } } ] },

/** async function *f() { await x; yield y; } **/
'await and yield are allowed in async generators':
{ type: 'Script',
  start: 0,
  end: 41,
  statements:
   [ { type: 'FunctionDeclaration',
       start: 0,
       end: 41,
       kind: 'async-generator',
       identifier:
        { type: 'Identifier',
          start: 16,
          end: 17,
          value: 'f',
          context: 'declaration' },
       params: [],
       body:
        { type: 'FunctionBody',
          start: 20,
          end: 41,
          statements:
           [ { type: 'ExpressionStatement',
               start: 22,
               end: 30,
               expression:
                { type: 'UnaryExpression',
                  start: 22,
                  end: 29,
                  operator: 'await',
                  expression:
                   { type: 'Identifier',
                     start: 28,
                     end: 29,
                     value: 'x',
                     context: 'variable' } } },
             { type: 'ExpressionStatement',
               start: 31,
               end: 39,
               expression:
                { type: 'YieldExpression',
                  start: 31,
                  end: 38,
                  delegate: false,
                  expression:
                   { type: 'Identifier',
                     start: 37,
                     end: 38,
                     value: 'y',
                     context: 'variable' } } } ] } } ] },

})
