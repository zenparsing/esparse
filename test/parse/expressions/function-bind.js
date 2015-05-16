({

/** x::f **/
'basic binary bind':
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
             context: 'variable' } } } ] },

/** x.y::a.b **/
'complex binary bind':
{ type: 'Script',
  start: 0,
  end: 8,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 8,
       expression:
        { type: 'BindExpression',
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
           { type: 'MemberExpression',
             start: 5,
             end: 8,
             object:
              { type: 'Identifier',
                start: 5,
                end: 6,
                value: 'a',
                context: 'variable' },
             property: { type: 'Identifier', start: 7, end: 8, value: 'b', context: '' },
             computed: false } } } ] },

/** new X::y() **/
'new on left':
{ type: 'Script',
  start: 0,
  end: 10,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 10,
       expression:
        { type: 'CallExpression',
          start: 0,
          end: 10,
          callee:
           { type: 'BindExpression',
             start: 0,
             end: 8,
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
                context: 'variable' } },
          arguments: [] } } ] },

/** x::new F() **/
'new on right':
{ type: 'Script',
  start: 0,
  end: 10,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 10,
       expression:
        { type: 'BindExpression',
          start: 0,
          end: 10,
          left:
           { type: 'Identifier',
             start: 0,
             end: 1,
             value: 'x',
             context: 'variable' },
          right:
           { type: 'NewExpression',
             start: 3,
             end: 10,
             callee:
              { type: 'Identifier',
                start: 7,
                end: 8,
                value: 'F',
                context: 'variable' },
             arguments: [] } } } ] },

/** ::a.b **/
'unary bind':
{ type: 'Script',
  start: 0,
  end: 5,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 5,
       expression:
        { type: 'BindExpression',
          start: 0,
          end: 5,
          left: null,
          right:
           { type: 'MemberExpression',
             start: 2,
             end: 5,
             object:
              { type: 'Identifier',
                start: 2,
                end: 3,
                value: 'a',
                context: 'variable' },
             property: { type: 'Identifier', start: 4, end: 5, value: 'b', context: '' },
             computed: false } } } ] },

/** ::foo **/
'unary operand must be property reference': {},

/** ::((a.b)) **/
'unary operand can be nested in parenthesis':
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
          left: null,
          right:
           { type: 'ParenExpression',
             start: 2,
             end: 9,
             expression:
              { type: 'ParenExpression',
                start: 3,
                end: 8,
                expression:
                 { type: 'MemberExpression',
                   start: 4,
                   end: 7,
                   object:
                    { type: 'Identifier',
                      start: 4,
                      end: 5,
                      value: 'a',
                      context: 'variable' },
                   property: { type: 'Identifier', start: 6, end: 7, value: 'b', context: '' },
                   computed: false } } } } } ] },

/** ({ f() { ::super.f } }) **/
'super not allowed as object in unary bind': {},

});
