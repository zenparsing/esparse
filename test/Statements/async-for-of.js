({

/** for async (let x of y); **/
'async for-of':
{ type: 'Script',
  start: 0,
  end: 23,
  statements:
   [ { type: 'ForOfStatement',
       async: true,
       start: 0,
       end: 23,
       left:
        { type: 'VariableDeclaration',
          start: 11,
          end: 16,
          kind: 'let',
          declarations:
           [ { type: 'VariableDeclarator',
               start: 15,
               end: 16,
               pattern:
                { type: 'Identifier',
                  start: 15,
                  end: 16,
                  value: 'x',
                  context: 'declaration' },
               initializer: null } ] },
       right:
        { type: 'Identifier',
          start: 20,
          end: 21,
          value: 'y',
          context: 'variable' },
       body: { type: 'EmptyStatement', start: 22, end: 23 } } ] },

/** for async (x in y); **/
'async for-in not allowed':
{},

/** for async (var i = 0; i < 10; ++i); **/
'async for-loop not allowed':
{},

});
