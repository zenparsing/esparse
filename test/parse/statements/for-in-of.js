({

/** for (x in y); **/
'for-in':
{ type: 'Script',
  start: 0,
  end: 13,
  statements:
   [ { type: 'ForInStatement',
       start: 0,
       end: 13,
       left:
        { type: 'Identifier',
          start: 5,
          end: 6,
          value: 'x',
          context: 'variable' },
       right:
        { type: 'Identifier',
          start: 10,
          end: 11,
          value: 'y',
          context: 'variable' },
       body: { type: 'EmptyStatement', start: 12, end: 13 } } ] },

/** for (var x in y); **/
'for-in with var declaration':
{ type: 'Script',
  start: 0,
  end: 17,
  statements:
   [ { type: 'ForInStatement',
       start: 0,
       end: 17,
       left:
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
       right:
        { type: 'Identifier',
          start: 14,
          end: 15,
          value: 'y',
          context: 'variable' },
       body: { type: 'EmptyStatement', start: 16, end: 17 } } ] },

/** for (let x in y); **/
'for-in with let declaration':
{ type: 'Script',
  start: 0,
  end: 17,
  statements:
   [ { type: 'ForInStatement',
       start: 0,
       end: 17,
       left:
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
       right:
        { type: 'Identifier',
          start: 14,
          end: 15,
          value: 'y',
          context: 'variable' },
       body: { type: 'EmptyStatement', start: 16, end: 17 } } ] },

/** for (let {x} in y); **/
'for-in with pattern variable declarator':
{ type: 'Script',
  start: 0,
  end: 19,
  statements:
   [ { type: 'ForInStatement',
       start: 0,
       end: 19,
       left:
        { type: 'VariableDeclaration',
          start: 5,
          end: 12,
          kind: 'let',
          declarations:
           [ { type: 'VariableDeclarator',
               start: 9,
               end: 12,
               pattern:
                { type: 'ObjectPattern',
                  start: 9,
                  end: 12,
                  properties:
                   [ { type: 'PatternProperty',
                       start: 10,
                       end: 11,
                       name:
                        { type: 'Identifier',
                          start: 10,
                          end: 11,
                          value: 'x',
                          context: 'declaration' },
                       pattern: null,
                       initializer: null } ],
                  trailingComma: false },
               initializer: null } ] },
       right:
        { type: 'Identifier',
          start: 16,
          end: 17,
          value: 'y',
          context: 'variable' },
       body: { type: 'EmptyStatement', start: 18, end: 19 } } ] },

/** for (var i = 0 in x); **/
'initializer allowed in for-in head in sloppy mode':
{
  type: 'Script',
  start: 0,
  end: 21,
  statements:
   [ {
       type: 'ForInStatement',
       start: 0,
       end: 21,
       left:
        {
          type: 'VariableDeclaration',
          start: 5,
          end: 14,
          kind: 'var',
          declarations:
           [ {
               type: 'VariableDeclarator',
               start: 9,
               end: 14,
               pattern:
                {
                  type: 'Identifier',
                  start: 9,
                  end: 10,
                  value: 'i',
                  context: 'declaration' },
               initializer: { type: 'NumberLiteral', start: 13, end: 14, value: 0 } } ],
          error: 'Invalid initializer in for-in statement' },
       right:
        {
          type: 'Identifier',
          start: 18,
          end: 19,
          value: 'x',
          context: 'variable' },
       body: { type: 'EmptyStatement', start: 20, end: 21 } } ] },

/** 'use strict'; for (var i = 0 in x); **/
'initializer in for-in not allowed in strict mode':
{},

/** for (var x of y); **/
'for-of with declaration':
{ type: 'Script',
  start: 0,
  end: 17,
  statements:
   [ { type: 'ForOfStatement',
       async: false,
       start: 0,
       end: 17,
       left:
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
       right:
        { type: 'Identifier',
          start: 14,
          end: 15,
          value: 'y',
          context: 'variable' },
       body: { type: 'EmptyStatement', start: 16, end: 17 } } ] },

/** for (x of y); **/
'for-of no declaration':
{ type: 'Script',
  start: 0,
  end: 13,
  statements:
   [ { type: 'ForOfStatement',
       async: false,
       start: 0,
       end: 13,
       left:
        { type: 'Identifier',
          start: 5,
          end: 6,
          value: 'x',
          context: 'variable' },
       right:
        { type: 'Identifier',
          start: 10,
          end: 11,
          value: 'y',
          context: 'variable' },
       body: { type: 'EmptyStatement', start: 12, end: 13 } } ] },

/** for (const x of y); **/
'for-of with const declaration': { type: 'Script',
  start: 0,
  end: 19,
  statements:
   [ { type: 'ForOfStatement',
       async: false,
       start: 0,
       end: 19,
       left:
        { type: 'VariableDeclaration',
          start: 5,
          end: 12,
          kind: 'const',
          declarations:
           [ { type: 'VariableDeclarator',
               start: 11,
               end: 12,
               pattern:
                { type: 'Identifier',
                  start: 11,
                  end: 12,
                  value: 'x',
                  context: 'declaration' },
               initializer: null } ] },
       right:
        { type: 'Identifier',
          start: 16,
          end: 17,
          value: 'y',
          context: 'variable' },
       body: { type: 'EmptyStatement', start: 18, end: 19 } } ] },

/** for (let [x, y] = foo of z); **/
'initializers not allowed in for-of head': {},

})
