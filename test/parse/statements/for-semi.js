({

/** for (;;); **/
'empty for-;':
{ type: 'Script',
  start: 0,
  end: 9,
  statements:
   [ { type: 'ForStatement',
       start: 0,
       end: 9,
       initializer: null,
       test: null,
       update: null,
       body: { type: 'EmptyStatement', start: 8, end: 9 } } ] },

/** for (var x;;); **/
'for with var initializer':
{ type: 'Script',
  start: 0,
  end: 14,
  statements:
   [ { type: 'ForStatement',
       start: 0,
       end: 14,
       initializer:
        { type: 'VariableDeclaration',
          start: 5,
          end: 10,
          kind: 'var',
          declarations:
           [ { type: 'VariableDeclarator',
               start: 9,
               end: 10,
               pattern:
                { type: 'Identifier',
                  start: 9,
                  end: 10,
                  value: 'x',
                  context: 'declaration' },
               initializer: null } ] },
       test: null,
       update: null,
       body: { type: 'EmptyStatement', start: 13, end: 14 } } ] },

/** for (let x;;); **/
'for with let declaration':
{ type: 'Script',
  start: 0,
  end: 14,
  statements:
   [ { type: 'ForStatement',
       start: 0,
       end: 14,
       initializer:
        { type: 'VariableDeclaration',
          start: 5,
          end: 10,
          kind: 'let',
          declarations:
           [ { type: 'VariableDeclarator',
               start: 9,
               end: 10,
               pattern:
                { type: 'Identifier',
                  start: 9,
                  end: 10,
                  value: 'x',
                  context: 'declaration' },
               initializer: null } ] },
       test: null,
       update: null,
       body: { type: 'EmptyStatement', start: 13, end: 14 } } ] },

/** for (const x = 1;;); **/
'for with const declaration and initializer':
{ type: 'Script',
  start: 0,
  end: 20,
  statements:
   [ { type: 'ForStatement',
       start: 0,
       end: 20,
       initializer:
        { type: 'VariableDeclaration',
          start: 5,
          end: 16,
          kind: 'const',
          declarations:
           [ { type: 'VariableDeclarator',
               start: 11,
               end: 16,
               pattern:
                { type: 'Identifier',
                  start: 11,
                  end: 12,
                  value: 'x',
                  context: 'declaration' },
               initializer: { type: 'NumberLiteral', start: 15, end: 16, value: 1 } } ] },
       test: null,
       update: null,
       body: { type: 'EmptyStatement', start: 19, end: 20 } } ] },

/** for (const x;;); **/
'for with const declaration and no initializer': {},

/** for (let [x, y] = [];;); **/
'for with let declaration pattern':
{ type: 'Script',
  start: 0,
  end: 24,
  statements:
   [ { type: 'ForStatement',
       start: 0,
       end: 24,
       initializer:
        { type: 'VariableDeclaration',
          start: 5,
          end: 20,
          kind: 'let',
          declarations:
           [ { type: 'VariableDeclarator',
               start: 9,
               end: 20,
               pattern:
                { type: 'ArrayPattern',
                  start: 9,
                  end: 15,
                  elements:
                   [ { type: 'PatternElement',
                       start: 10,
                       end: 11,
                       pattern:
                        { type: 'Identifier',
                          start: 10,
                          end: 11,
                          value: 'x',
                          context: 'declaration' },
                       initializer: null },
                     { type: 'PatternElement',
                       start: 13,
                       end: 14,
                       pattern:
                        { type: 'Identifier',
                          start: 13,
                          end: 14,
                          value: 'y',
                          context: 'declaration' },
                       initializer: null } ],
                  trailingComma: false },
               initializer:
                { type: 'ArrayLiteral',
                  start: 18,
                  end: 20,
                  elements: [],
                  trailingComma: false } } ] },
       test: null,
       update: null,
       body: { type: 'EmptyStatement', start: 23, end: 24 } } ] },

/** for (let [x, y];;); **/
'for with let declaration pattern and no initializer': {},

})
