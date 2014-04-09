({

/** export var x; **/
'export not allowed outside of module': {},

/*** export var x; ***/
'export a var': 
{ type: 'Module',
  start: 0,
  end: 13,
  statements: 
   [ { type: 'ExportDeclaration',
       start: 0,
       end: 13,
       declaration: 
        { type: 'VariableDeclaration',
          start: 7,
          end: 12,
          kind: 'var',
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
               initializer: null } ] } } ] },

/*** export { x }; ***/
'export an identifier': 
{ type: 'Module',
  start: 0,
  end: 13,
  statements: 
   [ { type: 'ExportDeclaration',
       start: 0,
       end: 13,
       declaration: 
        { type: 'ExportsList',
          start: 7,
          end: 12,
          specifiers: 
           [ { type: 'ExportSpecifier',
               start: 9,
               end: 10,
               local: { type: 'Identifier', start: 9, end: 10, value: 'x', context: '' },
               exported: null } ],
          from: null } } ] },

/*** export { x, y }; ***/
'export multiple identifiers':
{ type: 'Module',
  start: 0,
  end: 16,
  statements: 
   [ { type: 'ExportDeclaration',
       start: 0,
       end: 16,
       declaration: 
        { type: 'ExportsList',
          start: 7,
          end: 15,
          specifiers: 
           [ { type: 'ExportSpecifier',
               start: 9,
               end: 10,
               local: { type: 'Identifier', start: 9, end: 10, value: 'x', context: '' },
               exported: null },
             { type: 'ExportSpecifier',
               start: 12,
               end: 13,
               local: { type: 'Identifier', start: 12, end: 13, value: 'y', context: '' },
               exported: null } ],
          from: null } } ] },

/*** export { x as y }; ***/
'export and rename identifier': 
{ type: 'Module',
  start: 0,
  end: 18,
  statements: 
   [ { type: 'ExportDeclaration',
       start: 0,
       end: 18,
       declaration: 
        { type: 'ExportsList',
          start: 7,
          end: 17,
          specifiers: 
           [ { type: 'ExportSpecifier',
               start: 9,
               end: 15,
               local: { type: 'Identifier', start: 9, end: 10, value: 'x', context: '' },
               exported: { type: 'Identifier', start: 14, end: 15, value: 'y', context: '' } } ],
          from: null } } ] },

/*** export { x as default }; ***/
'exporting a default binding': 
{ type: 'Module',
  start: 0,
  end: 24,
  statements: 
   [ { type: 'ExportDeclaration',
       start: 0,
       end: 24,
       declaration: 
        { type: 'ExportsList',
          start: 7,
          end: 23,
          specifiers: 
           [ { type: 'ExportSpecifier',
               start: 9,
               end: 21,
               local: { type: 'Identifier', start: 9, end: 10, value: 'x', context: '' },
               exported: 
                { type: 'Identifier',
                  start: 14,
                  end: 21,
                  value: 'default',
                  context: '' } } ],
          from: null } } ] },

/*** export { x as y } from "x"; ***/
'exporting a named set from an external module': 
{ type: 'Module',
  start: 0,
  end: 27,
  statements: 
   [ { type: 'ExportDeclaration',
       start: 0,
       end: 27,
       declaration: 
        { type: 'ExportsList',
          start: 7,
          end: 26,
          specifiers: 
           [ { type: 'ExportSpecifier',
               start: 9,
               end: 15,
               local: { type: 'Identifier', start: 9, end: 10, value: 'x', context: '' },
               exported: { type: 'Identifier', start: 14, end: 15, value: 'y', context: '' } } ],
          from: { type: 'String', start: 23, end: 26, value: 'x' } } } ] },

/*** export * from "x"; ***/
'exporting everything from an external module': 
{ type: 'Module',
  start: 0,
  end: 18,
  statements: 
   [ { type: 'ExportDeclaration',
       start: 0,
       end: 18,
       declaration: 
        { type: 'ExportsList',
          start: 7,
          end: 17,
          specifiers: null,
          from: { type: 'String', start: 14, end: 17, value: 'x' } } } ] },

/*** export *; ***/
'exporting everything must include a specifier': {},

})