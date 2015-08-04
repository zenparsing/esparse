({

/** a::b **/
'basic bind':
{ type: 'Script',
  start: 0,
  end: 4,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 4,
       expression:
        { type: 'BindExpression',
          start: 0,
          end: 4,
          object:
           { type: 'Identifier',
             start: 0,
             end: 1,
             value: 'a',
             context: 'variable' },
          property: { type: 'Identifier', start: 3, end: 4, value: 'b', context: '' } } } ] },

/** a::delete **/
'keyword identifier names are allowed':
{ type: 'Script',
  start: 0,
  end: 9,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 9,
       expression:
        { type: 'BindExpression',
          start: 0,
          end: 9,
          object:
           { type: 'Identifier',
             start: 0,
             end: 1,
             value: 'a',
             context: 'variable' },
          property:
           { type: 'Identifier',
             start: 3,
             end: 9,
             value: 'delete',
             context: '' } } } ] },

});
