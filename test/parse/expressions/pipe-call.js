({

/** x->f() **/
'basic pipe call':
{ type: 'Script',
  start: 0,
  end: 6,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 6,
       expression:
        { type: 'PipeExpression',
          start: 0,
          end: 6,
          left:
           { type: 'Identifier',
             start: 0,
             end: 1,
             value: 'x',
             context: 'variable' },
          right:
           { type: 'Identifier',
             start: 3,
             end: 4,
             value: 'f',
             context: 'variable' },
          arguments: [] } } ] },

/** x.y->z() **/
'complex pipe call':
{ type: 'Script',
  start: 0,
  end: 8,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 8,
       expression:
        { type: 'PipeExpression',
          start: 0,
          end: 8,
          left:
           { type: 'MemberExpression',
             start: 0,
             end: 3,
             object:
              { type: 'Identifier',
                start: 0,
                end: 1,
                value: 'x',
                context: 'variable' },
             property: { type: 'Identifier', start: 2, end: 3, value: 'y', context: '' },
             computed: false },
          right:
           { type: 'Identifier',
             start: 5,
             end: 6,
             value: 'z',
             context: 'variable' },
          arguments: [] } } ] },

/** new X->y() **/
'new on left':
{ type: 'Script',
  start: 0,
  end: 10,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 10,
       expression:
        { type: 'PipeExpression',
          start: 0,
          end: 10,
          left:
           { type: 'NewExpression',
             start: 0,
             end: 5,
             callee:
              { type: 'Identifier',
                start: 4,
                end: 5,
                value: 'X',
                context: 'variable' },
             arguments: null },
          right:
           { type: 'Identifier',
             start: 7,
             end: 8,
             value: 'y',
             context: 'variable' },
          arguments: [] } } ] },

/** x->new F()() **/
'new on right not allowed': {},

/** x->delete() **/
'keyword on right not allowed': {},

/** x->y.z() **/
'member lookup on right not allowed': {},

});
