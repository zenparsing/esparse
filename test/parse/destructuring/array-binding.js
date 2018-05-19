({

/** var [a] = x; **/
'basic array binding pattern':
{ type: 'Script',
  start: 0,
  end: 12,
  statements:
   [ { type: 'VariableDeclaration',
       start: 0,
       end: 12,
       kind: 'var',
       declarations:
        [ { type: 'VariableDeclarator',
            start: 4,
            end: 11,
            pattern:
             { type: 'ArrayPattern',
               start: 4,
               end: 7,
               elements:
                [ { type: 'PatternElement',
                    start: 5,
                    end: 6,
                    pattern:
                     { type: 'Identifier',
                       start: 5,
                       end: 6,
                       value: 'a',
                       context: 'declaration' },
                    initializer: null } ],
               trailingComma: false },
            initializer:
             { type: 'Identifier',
               start: 10,
               end: 11,
               value: 'x',
               context: 'variable' } } ] } ] },

/** var [a]; **/
'pattern must have an initializer':
{},

/** var ([a]) = x; **/
'parens are not unwrapped':
{},

/** var [...a] = x; **/
'rest target':
{ type: 'Script',
  start: 0,
  end: 15,
  statements:
   [ { type: 'VariableDeclaration',
       start: 0,
       end: 15,
       kind: 'var',
       declarations:
        [ { type: 'VariableDeclarator',
            start: 4,
            end: 14,
            pattern:
             { type: 'ArrayPattern',
               start: 4,
               end: 10,
               elements:
                [ { type: 'PatternRestElement',
                    start: 5,
                    end: 9,
                    pattern:
                     { type: 'Identifier',
                       start: 8,
                       end: 9,
                       value: 'a',
                       context: 'declaration' } } ],
               trailingComma: false },
            initializer:
             { type: 'Identifier',
               start: 13,
               end: 14,
               value: 'x',
               context: 'variable' } } ] } ] },

/** var [...a, b] = x; **/
'rest element must occur in last position':
{},

/** var [...a,] = x; **/
'rest element cannot be followed by a comma':
{},

/** var [] = x **/
'empty patterns are allowed':
{ type: 'Script',
  start: 0,
  end: 10,
  statements:
   [ { type: 'VariableDeclaration',
       start: 0,
       end: 10,
       kind: 'var',
       declarations:
        [ { type: 'VariableDeclarator',
            start: 4,
            end: 10,
            pattern:
             { type: 'ArrayPattern',
               start: 4,
               end: 6,
               elements: [],
               trailingComma: false },
            initializer:
             { type: 'Identifier',
               start: 9,
               end: 10,
               value: 'x',
               context: 'variable' } } ] } ] },

/** var [, a, , b] = x **/
'elisions are allowed':
{ type: 'Script',
  start: 0,
  end: 18,
  statements:
   [ { type: 'VariableDeclaration',
       start: 0,
       end: 18,
       kind: 'var',
       declarations:
        [ { type: 'VariableDeclarator',
            start: 4,
            end: 18,
            pattern:
             { type: 'ArrayPattern',
               start: 4,
               end: 14,
               elements:
                [ null,
                  { type: 'PatternElement',
                    start: 7,
                    end: 8,
                    pattern:
                     { type: 'Identifier',
                       start: 7,
                       end: 8,
                       value: 'a',
                       context: 'declaration' },
                    initializer: null },
                  null,
                  { type: 'PatternElement',
                    start: 12,
                    end: 13,
                    pattern:
                     { type: 'Identifier',
                       start: 12,
                       end: 13,
                       value: 'b',
                       context: 'declaration' },
                    initializer: null } ],
               trailingComma: false },
            initializer:
             { type: 'Identifier',
               start: 17,
               end: 18,
               value: 'x',
               context: 'variable' } } ] } ] },

})
