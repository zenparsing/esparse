({

/** switch (x) { case 1: let x; } **/
"case clauses can have declarations":
{ type: 'Script',
  start: 0,
  end: 29,
  statements:
   [ { type: 'SwitchStatement',
       start: 0,
       end: 29,
       descriminant:
        { type: 'Identifier',
          start: 8,
          end: 9,
          value: 'x',
          context: 'variable' },
       cases:
        [ { type: 'SwitchCase',
            start: 13,
            end: 27,
            test: { type: 'NumberLiteral', start: 18, end: 19, value: 1 },
            consequent:
             [ { type: 'VariableDeclaration',
                 start: 21,
                 end: 27,
                 kind: 'let',
                 declarations:
                  [ { type: 'VariableDeclarator',
                      start: 25,
                      end: 26,
                      pattern:
                       { type: 'Identifier',
                         start: 25,
                         end: 26,
                         value: 'x',
                         context: 'declaration' },
                      initializer: null } ] } ] } ] } ] },

})
