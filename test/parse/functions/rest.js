({

/** function f(...args) {} **/
'single rest parameter':
{ type: 'Script',
  start: 0,
  end: 22,
  statements:
   [ { type: 'FunctionDeclaration',
       start: 0,
       end: 22,
       kind: '',
       identifier:
        { type: 'Identifier',
          start: 9,
          end: 10,
          value: 'f',
          context: 'declaration' },
       params:
        [ { type: 'RestParameter',
            start: 11,
            end: 18,
            identifier:
             { type: 'Identifier',
               start: 14,
               end: 18,
               value: 'args',
               context: 'declaration' } } ],
       body: { type: 'FunctionBody', start: 20, end: 22, statements: [] } } ] },

/** function f(a, b, ...[c]) {} **/
'rest parameter cannot be a pattern':
{},

/** function f(a, ...b, c) {} **/
'rest parameter can only occur as the last formal parameter':
{},

})
