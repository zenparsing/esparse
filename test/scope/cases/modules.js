({

/*** import { x } from 'y' ***/
'imported names': {
  type: 'var',
  names: {},
  node: null,
  free: [],
  strict: false,
  children:
   [ {
       type: 'block',
       names:
        { x:
           { declarations:
              [ {
                  type: 'Identifier',
                  start: 9,
                  end: 10,
                  value: 'x',
                  context: 'declaration' } ],
             references: [],
             const: true } },
       node:
        {
          type: 'Module',
          start: 0,
          end: 21,
          statements:
           [ {
               type: 'ImportDeclaration',
               start: 0,
               end: 21,
               imports:
                {
                  type: 'NamedImports',
                  start: 7,
                  end: 12,
                  specifiers:
                   [ {
                       type: 'ImportSpecifier',
                       start: 9,
                       end: 10,
                       imported:
                        {
                          type: 'Identifier',
                          start: 9,
                          end: 10,
                          value: 'x',
                          context: 'declaration' },
                       local: null } ] },
               from:
                { type: 'StringLiteral', start: 18, end: 21, value: 'y' } } ] },
       free: [],
       strict: true,
       children: [],
       varNames: null } ],
  varNames: [] },

})
