({

/** delete x **/
'unqualified delete in sloppy mode':
{ type: 'Script',
  start: 0,
  end: 8,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 8,
       expression:
        { type: 'UnaryExpression',
          start: 0,
          end: 8,
          operator: 'delete',
          expression:
           { type: 'Identifier',
             start: 7,
             end: 8,
             value: 'x',
             context: 'variable' } } } ] },


/** "use strict"; delete x **/
'unqualified delete cannot appear in strict mode': {},

/** "use strict"; delete (((x))) **/
'unqualified delete within parens cannot appear in strict mode': {},


})
