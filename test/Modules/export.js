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
          end: 13,
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
          from: { type: 'StringLiteral', start: 23, end: 26, value: 'x' } } } ] },

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
          from: { type: 'StringLiteral', start: 14, end: 17, value: 'x' } } } ] },

/*** export *; ***/
'exporting everything must include a specifier': {},

/*** export { if }; ***/
'local export does not allow identifier names': {},

/*** export { implements }; ***/
'local export does not allow strict reserved words': {},

/*** export { if } from "x"; ***/
'export from should allow identifier names':
{ type: 'Module',
  start: 0,
  end: 23,
  statements:
   [ { type: 'ExportDeclaration',
       start: 0,
       end: 23,
       declaration:
        { type: 'ExportsList',
          start: 7,
          end: 22,
          specifiers:
           [ { type: 'ExportSpecifier',
               start: 9,
               end: 11,
               local: { type: 'Identifier', start: 9, end: 11, value: 'if', context: '' },
               exported: null } ],
          from: { type: 'StringLiteral', start: 19, end: 22, value: 'x' } } } ] },

/*** export default class C {} ***/
'export default class declaration':
{ type: 'Module',
  start: 0,
  end: 25,
  statements:
   [ { type: 'ExportDeclaration',
       start: 0,
       end: 25,
       declaration:
        { type: 'DefaultExport',
          binding:
           { type: 'ClassDeclaration',
             start: 15,
             end: 25,
             identifier:
              { type: 'Identifier',
                start: 21,
                end: 22,
                value: 'C',
                context: 'declaration' },
             base: null,
             body: { type: 'ClassBody', start: 23, end: 25, elements: [] } },
          start: 7,
          end: 25 } } ] },

/*** export default class {}; ***/
'export default class expression':
{ type: 'Module',
  start: 0,
  end: 24,
  statements:
   [ { type: 'ExportDeclaration',
       start: 0,
       end: 24,
       declaration:
        { type: 'DefaultExport',
          binding:
           { type: 'ClassExpression',
             start: 15,
             end: 23,
             identifier: null,
             base: null,
             body: { type: 'ClassBody', start: 21, end: 23, elements: [] } },
          start: 7,
          end: 24 } } ] },

/*** export default function F() {} ***/
'export default function declaration':
{ type: 'Module',
  start: 0,
  end: 30,
  statements:
   [ { type: 'ExportDeclaration',
       start: 0,
       end: 30,
       declaration:
        { type: 'DefaultExport',
          binding:
           { type: 'FunctionDeclaration',
             start: 15,
             end: 30,
             kind: '',
             identifier:
              { type: 'Identifier',
                start: 24,
                end: 25,
                value: 'F',
                context: 'declaration' },
             params: [],
             body: { type: 'FunctionBody', start: 28, end: 30, statements: [] } },
          start: 7,
          end: 30 } } ] },

/*** export default function() {}; ***/
'export default function expression':
{ type: 'Module',
  start: 0,
  end: 29,
  statements:
   [ { type: 'ExportDeclaration',
       start: 0,
       end: 29,
       declaration:
        { type: 'DefaultExport',
          binding:
           { type: 'FunctionExpression',
             start: 15,
             end: 28,
             kind: '',
             identifier: null,
             params: [],
             body: { type: 'FunctionBody', start: 26, end: 28, statements: [] } },
          start: 7,
          end: 29 } } ] },

/*** export default 1 + 1; ***/
'export default assignment expression':
{ type: 'Module',
  start: 0,
  end: 21,
  statements:
   [ { type: 'ExportDeclaration',
       start: 0,
       end: 21,
       declaration:
        { type: 'DefaultExport',
          binding:
           { type: 'BinaryExpression',
             start: 15,
             end: 20,
             operator: '+',
             left: { type: 'NumberLiteral', start: 15, end: 16, value: 1 },
             right: { type: 'NumberLiteral', start: 19, end: 20, value: 1 } },
          start: 7,
          end: 21 } } ] },

})
