({

/** async function f() { for async (let x of y); } **/
'async for-of':
{ type: 'Script',
  start: 0,
  end: 46,
  statements:
   [ { type: 'FunctionDeclaration',
       start: 0,
       end: 46,
       kind: 'async',
       identifier:
        { type: 'Identifier',
          start: 15,
          end: 16,
          value: 'f',
          context: 'declaration' },
       params: [],
       body:
        { type: 'FunctionBody',
          start: 19,
          end: 46,
          statements:
           [ { type: 'ForOfStatement',
               async: true,
               start: 21,
               end: 44,
               left:
                { type: 'VariableDeclaration',
                  start: 32,
                  end: 37,
                  kind: 'let',
                  declarations:
                   [ { type: 'VariableDeclarator',
                       start: 36,
                       end: 37,
                       pattern:
                        { type: 'Identifier',
                          start: 36,
                          end: 37,
                          value: 'x',
                          context: 'declaration' },
                       initializer: null } ] },
               right:
                { type: 'Identifier',
                  start: 41,
                  end: 42,
                  value: 'y',
                  context: 'variable' },
               body: { type: 'EmptyStatement', start: 43, end: 44 } } ] } } ] },

/** for async (x of y); **/
'async for-of only allowed in async context':
{},

/** async function f() { for async (x in y); } **/
'async for-in not allowed':
{},

/** async function f() { for async (var i = 0; i < 10; ++i); } **/
'async for-loop not allowed':
{},

});
