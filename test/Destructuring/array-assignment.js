({

/** [a] = x **/
'basic array destructuring':
{ type: 'Script',
  start: 0,
  end: 7,
  statements: 
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 7,
       expression: 
        { type: 'AssignmentExpression',
          start: 0,
          end: 7,
          operator: '=',
          left: 
           { type: 'ArrayPattern',
             start: 0,
             end: 3,
             elements: 
              [ { type: 'PatternElement',
                  start: 1,
                  end: 2,
                  pattern: 
                   { type: 'Identifier',
                     start: 1,
                     end: 2,
                     value: 'a',
                     context: 'variable' },
                  initializer: null } ] },
          right: 
           { type: 'Identifier',
             start: 6,
             end: 7,
             value: 'x',
             context: 'variable' } } } ] },

/** [a = b] = x **/
'targets can have initializers':
{ type: 'Script',
  start: 0,
  end: 11,
  statements: 
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 11,
       expression: 
        { type: 'AssignmentExpression',
          start: 0,
          end: 11,
          operator: '=',
          left: 
           { type: 'ArrayPattern',
             start: 0,
             end: 7,
             elements: 
              [ { type: 'PatternElement',
                  start: 1,
                  end: 6,
                  pattern: 
                   { type: 'Identifier',
                     start: 1,
                     end: 2,
                     value: 'a',
                     context: 'variable' },
                  initializer: 
                   { type: 'Identifier',
                     start: 5,
                     end: 6,
                     value: 'b',
                     context: 'variable' } } ] },
          right: 
           { type: 'Identifier',
             start: 10,
             end: 11,
             value: 'x',
             context: 'variable' } } } ] },

/** [[a] = b] = x **/
'nested patterns can have initializers':
{ type: 'Script',
  start: 0,
  end: 13,
  statements: 
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 13,
       expression: 
        { type: 'AssignmentExpression',
          start: 0,
          end: 13,
          operator: '=',
          left: 
           { type: 'ArrayPattern',
             start: 0,
             end: 9,
             elements: 
              [ { type: 'PatternElement',
                  start: 1,
                  end: 8,
                  pattern: 
                   { type: 'ArrayPattern',
                     start: 1,
                     end: 4,
                     elements: 
                      [ { type: 'PatternElement',
                          start: 2,
                          end: 3,
                          pattern: 
                           { type: 'Identifier',
                             start: 2,
                             end: 3,
                             value: 'a',
                             context: 'variable' },
                          initializer: null } ] },
                  initializer: 
                   { type: 'Identifier',
                     start: 7,
                     end: 8,
                     value: 'b',
                     context: 'variable' } } ] },
          right: 
           { type: 'Identifier',
             start: 12,
             end: 13,
             value: 'x',
             context: 'variable' } } } ] },

/** ([a]) = x **/
'parens are unwrapped':
{ type: 'Script',
  start: 0,
  end: 9,
  statements: 
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 9,
       expression: 
        { type: 'AssignmentExpression',
          start: 0,
          end: 9,
          operator: '=',
          left: 
           { type: 'ParenExpression',
             start: 0,
             end: 5,
             expression: 
              { type: 'ArrayPattern',
                start: 1,
                end: 4,
                elements: 
                 [ { type: 'PatternElement',
                     start: 2,
                     end: 3,
                     pattern: 
                      { type: 'Identifier',
                        start: 2,
                        end: 3,
                        value: 'a',
                        context: 'variable' },
                     initializer: null } ] } },
          right: 
           { type: 'Identifier',
             start: 8,
             end: 9,
             value: 'x',
             context: 'variable' } } } ] },

/** [...a] = x **/
'rest element':
{ type: 'Script',
  start: 0,
  end: 10,
  statements: 
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 10,
       expression: 
        { type: 'AssignmentExpression',
          start: 0,
          end: 10,
          operator: '=',
          left: 
           { type: 'ArrayPattern',
             start: 0,
             end: 6,
             elements: 
              [ { type: 'PatternRestElement',
                  start: 1,
                  end: 5,
                  target: 
                   { type: 'Identifier',
                     start: 4,
                     end: 5,
                     value: 'a',
                     context: 'variable' } } ] },
          right: 
           { type: 'Identifier',
             start: 9,
             end: 10,
             value: 'x',
             context: 'variable' } } } ] },

/** [] = x **/
'array pattern can be empty':
{ type: 'Script',
  start: 0,
  end: 6,
  statements: 
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 6,
       expression: 
        { type: 'AssignmentExpression',
          start: 0,
          end: 6,
          operator: '=',
          left: { type: 'ArrayPattern', start: 0, end: 2, elements: [] },
          right: 
           { type: 'Identifier',
             start: 5,
             end: 6,
             value: 'x',
             context: 'variable' } } } ] },

/** [,,,] = x **/
'array pattern can contain only elisions':
{ type: 'Script',
  start: 0,
  end: 9,
  statements: 
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 9,
       expression: 
        { type: 'AssignmentExpression',
          start: 0,
          end: 9,
          operator: '=',
          left: 
           { type: 'ArrayPattern',
             start: 0,
             end: 5,
             elements: [ null, null ] },
          right: 
           { type: 'Identifier',
             start: 8,
             end: 9,
             value: 'x',
             context: 'variable' } } } ] },

/** [a,] = x **/
'array pattern can contain elision at end':
{ type: 'Script',
  start: 0,
  end: 8,
  statements: 
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 8,
       expression: 
        { type: 'AssignmentExpression',
          start: 0,
          end: 8,
          operator: '=',
          left: 
           { type: 'ArrayPattern',
             start: 0,
             end: 4,
             elements: 
              [ { type: 'PatternElement',
                  start: 1,
                  end: 2,
                  pattern: 
                   { type: 'Identifier',
                     start: 1,
                     end: 2,
                     value: 'a',
                     context: 'variable' },
                  initializer: null } ] },
          right: 
           { type: 'Identifier',
             start: 7,
             end: 8,
             value: 'x',
             context: 'variable' } } } ] },

/** [...a, b] = x **/
'rest element can be in middle':
{ type: 'Script',
  start: 0,
  end: 13,
  statements: 
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 13,
       expression: 
        { type: 'AssignmentExpression',
          start: 0,
          end: 13,
          operator: '=',
          left: 
           { type: 'ArrayPattern',
             start: 0,
             end: 9,
             elements: 
              [ { type: 'PatternRestElement',
                  start: 1,
                  end: 5,
                  target: 
                   { type: 'Identifier',
                     start: 4,
                     end: 5,
                     value: 'a',
                     context: 'variable' } },
                { type: 'PatternElement',
                  start: 7,
                  end: 8,
                  pattern: 
                   { type: 'Identifier',
                     start: 7,
                     end: 8,
                     value: 'b',
                     context: 'variable' },
                  initializer: null } ] },
          right: 
           { type: 'Identifier',
             start: 12,
             end: 13,
             value: 'x',
             context: 'variable' } } } ] },

/** [...a.b] = x **/
'rest target can be a member expression':
{ type: 'Script',
  start: 0,
  end: 12,
  statements: 
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 12,
       expression: 
        { type: 'AssignmentExpression',
          start: 0,
          end: 12,
          operator: '=',
          left: 
           { type: 'ArrayPattern',
             start: 0,
             end: 8,
             elements: 
              [ { type: 'PatternRestElement',
                  start: 1,
                  end: 7,
                  target: 
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
                     computed: false } } ] },
          right: 
           { type: 'Identifier',
             start: 11,
             end: 12,
             value: 'x',
             context: 'variable' } } } ] },

/** [[a]] = x **/
'nested patterns':
{ type: 'Script',
  start: 0,
  end: 9,
  statements: 
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 9,
       expression: 
        { type: 'AssignmentExpression',
          start: 0,
          end: 9,
          operator: '=',
          left: 
           { type: 'ArrayPattern',
             start: 0,
             end: 5,
             elements: 
              [ { type: 'PatternElement',
                  start: 1,
                  end: 4,
                  pattern: 
                   { type: 'ArrayPattern',
                     start: 1,
                     end: 4,
                     elements: 
                      [ { type: 'PatternElement',
                          start: 2,
                          end: 3,
                          pattern: 
                           { type: 'Identifier',
                             start: 2,
                             end: 3,
                             value: 'a',
                             context: 'variable' },
                          initializer: null } ] },
                  initializer: null } ] },
          right: 
           { type: 'Identifier',
             start: 8,
             end: 9,
             value: 'x',
             context: 'variable' } } } ] },

/** [([a])] = x **/
'nested patterns are not unwrapped':
{},

/** [...a, ...b] = x **/
'pattern can only have one rest element':
{},

/** [...[a]] = x **/
'rest element target cannot be a pattern':
{},

/** [...a = b] = x **/
'rest element target cannot have an initializer':
{},

/** ++[a]; **/
'update assignment targets cannot be patterns':
{},


})