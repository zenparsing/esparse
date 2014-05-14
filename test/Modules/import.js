({

/** import "x"; **/
'import not allowed in non-module': {},

/*** import { x } from "x"; ***/
'import from a url': 
{ type: 'Module',
  start: 0,
  end: 22,
  statements: 
   [ { type: 'ImportDeclaration',
       start: 0,
       end: 22,
       specifiers: 
        [ { type: 'ImportSpecifier',
            start: 9,
            end: 10,
            imported: 
             { type: 'Identifier',
               start: 9,
               end: 10,
               value: 'x',
               context: 'declaration' },
            local: null } ],
       from: { type: 'StringLiteral', start: 18, end: 21, value: 'x' } } ] },

/*** import { x } from y; ***/
'import from a lexical module': 
{ type: 'Module',
  start: 0,
  end: 20,
  statements: 
   [ { type: 'ImportDeclaration',
       start: 0,
       end: 20,
       specifiers: 
        [ { type: 'ImportSpecifier',
            start: 9,
            end: 10,
            imported: 
             { type: 'Identifier',
               start: 9,
               end: 10,
               value: 'x',
               context: 'declaration' },
            local: null } ],
       from: 
        { type: 'ModulePath',
          start: 18,
          end: 19,
          elements: [ { type: 'Identifier', start: 18, end: 19, value: 'y', context: '' } ] } } ] },

/*** import { x as y } from "x"; ***/
'renaming imported bindings': 
{ type: 'Module',
  start: 0,
  end: 27,
  statements: 
   [ { type: 'ImportDeclaration',
       start: 0,
       end: 27,
       specifiers: 
        [ { type: 'ImportSpecifier',
            start: 9,
            end: 15,
            imported: { type: 'Identifier', start: 9, end: 10, value: 'x', context: '' },
            local: 
             { type: 'Identifier',
               start: 14,
               end: 15,
               value: 'y',
               context: 'declaration' } } ],
       from: { type: 'StringLiteral', start: 23, end: 26, value: 'x' } } ] },

/*** import {} from "x"; ***/
'empty import specifier set': 
{ type: 'Module',
  start: 0,
  end: 19,
  statements: 
   [ { type: 'ImportDeclaration',
       start: 0,
       end: 19,
       specifiers: [],
       from: { type: 'StringLiteral', start: 15, end: 18, value: 'x' } } ] },

/*** import { x, } from "x"; ***/
'import list may end with a comma':
{ type: 'Module',
  start: 0,
  end: 23,
  statements: 
   [ { type: 'ImportDeclaration',
       start: 0,
       end: 23,
       specifiers: 
        [ { type: 'ImportSpecifier',
            start: 9,
            end: 10,
            imported: 
             { type: 'Identifier',
               start: 9,
               end: 10,
               value: 'x',
               context: 'declaration' },
            local: null } ],
       from: { type: 'StringLiteral', start: 19, end: 22, value: 'x' } } ] },

/*** import { default as y } from "x"; ***/
'import a keyword-named binding': 
{ type: 'Module',
  start: 0,
  end: 33,
  statements: 
   [ { type: 'ImportDeclaration',
       start: 0,
       end: 33,
       specifiers: 
        [ { type: 'ImportSpecifier',
            start: 9,
            end: 21,
            imported: 
             { type: 'Identifier',
               start: 9,
               end: 16,
               value: 'default',
               context: '' },
            local: 
             { type: 'Identifier',
               start: 20,
               end: 21,
               value: 'y',
               context: 'declaration' } } ],
       from: { type: 'StringLiteral', start: 29, end: 32, value: 'x' } } ] },

/*** import { default } from "x"; ***/
'importing of non-identifier bindings is not allowed': {},

/*** import "x"; ***/
'import declaration without a specifier list':
{ type: 'Module',
  start: 0,
  end: 11,
  statements: 
   [ { type: 'ImportDeclaration',
       start: 0,
       end: 11,
       specifiers: null,
       from: { type: 'StringLiteral', start: 7, end: 10, value: 'x' } } ] },

})