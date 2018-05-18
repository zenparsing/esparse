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
       imports:
        { type: 'NamedImports',
          start: 7,
          end: 12,
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
               local: null } ] },
       from: { type: 'StringLiteral', start: 18, end: 21, value: 'x' } } ] },

/*** import { x as y } from "x"; ***/
'renaming imported bindings':
{ type: 'Module',
  start: 0,
  end: 27,
  statements:
   [ { type: 'ImportDeclaration',
       start: 0,
       end: 27,
       imports:
        { type: 'NamedImports',
          start: 7,
          end: 17,
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
                  context: 'declaration' } } ] },
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
       imports: { type: 'NamedImports', start: 7, end: 9, specifiers: [] },
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
       imports:
        { type: 'NamedImports',
          start: 7,
          end: 13,
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
               local: null } ] },
       from: { type: 'StringLiteral', start: 19, end: 22, value: 'x' } } ] },

/*** import { , } from "x"; ***/
'import list cannot contain only a comma': {},

/*** import { default as y } from "x"; ***/
'import a keyword-named binding':
{ type: 'Module',
  start: 0,
  end: 33,
  statements:
   [ { type: 'ImportDeclaration',
       start: 0,
       end: 33,
       imports:
        { type: 'NamedImports',
          start: 7,
          end: 23,
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
                  context: 'declaration' } } ] },
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
       imports: null,
       from: { type: 'StringLiteral', start: 7, end: 10, value: 'x' } } ] },

/*** import * as x from "x.js"; ***/
'importing the module namespace':
{ type: 'Module',
  start: 0,
  end: 26,
  statements:
   [ { type: 'ImportDeclaration',
       start: 0,
       end: 26,
       imports:
        { type: 'NamespaceImport',
          start: 7,
          end: 13,
          identifier:
           { type: 'Identifier',
             start: 12,
             end: 13,
             value: 'x',
             context: 'declaration' } },
       from: { type: 'StringLiteral', start: 19, end: 25, value: 'x.js' } } ] },

/*** import x, * as y from "a"; ***/
'importing a default and namespace':
{ type: 'Module',
  start: 0,
  end: 26,
  statements:
   [ { type: 'ImportDeclaration',
       start: 0,
       end: 26,
       imports:
        { type: 'DefaultImport',
          start: 7,
          end: 16,
          identifier:
           { type: 'Identifier',
             start: 7,
             end: 8,
             value: 'x',
             context: 'declaration' },
          imports:
           { type: 'NamespaceImport',
             start: 10,
             end: 16,
             identifier:
              { type: 'Identifier',
                start: 15,
                end: 16,
                value: 'y',
                context: 'declaration' } } },
       from: { type: 'StringLiteral', start: 22, end: 25, value: 'a' } } ] },

/*** import x, { y } from "a"; ***/
'importing a default and named imports':
{ type: 'Module',
  start: 0,
  end: 25,
  statements:
   [ { type: 'ImportDeclaration',
       start: 0,
       end: 25,
       imports:
        { type: 'DefaultImport',
          start: 7,
          end: 15,
          identifier:
           { type: 'Identifier',
             start: 7,
             end: 8,
             value: 'x',
             context: 'declaration' },
          imports:
           { type: 'NamedImports',
             start: 10,
             end: 15,
             specifiers:
              [ { type: 'ImportSpecifier',
                  start: 12,
                  end: 13,
                  imported:
                   { type: 'Identifier',
                     start: 12,
                     end: 13,
                     value: 'y',
                     context: 'declaration' },
                  local: null } ] } },
       from: { type: 'StringLiteral', start: 21, end: 24, value: 'a' } } ] },

/*** 1; import 'x'; 2; ***/
'import declarations allowed between statements': { type: 'Module',
  start: 0,
  end: 17,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 2,
       expression: { type: 'NumberLiteral', start: 0, end: 1, value: 1 } },
     { type: 'ImportDeclaration',
       start: 3,
       end: 14,
       imports: null,
       from: { type: 'StringLiteral', start: 10, end: 13, value: 'x' } },
     { type: 'ExpressionStatement',
       start: 15,
       end: 17,
       expression: { type: 'NumberLiteral', start: 15, end: 16, value: 2 } } ] },

/*** await (1); ***/
'await is reserved within modules - 1': {},

/*** { await (1); } ***/
'await is reserved within modules - 2': {},

/** await (1) **/
'await is not reserved in scripts':
{ type: 'Script',
  start: 0,
  end: 9,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 9,
       expression:
        { type: 'CallExpression',
          start: 0,
          end: 9,
          callee:
           { type: 'Identifier',
             start: 0,
             end: 5,
             value: 'await',
             context: 'variable' },
          arguments: [ { type: 'NumberLiteral', start: 7, end: 8, value: 1 } ],
          trailingComma: false } } ] },

/*** import.meta ***/
'import.meta meta property':
{ type: 'Module',
  start: 0,
  end: 11,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 11,
       expression:
        { type: 'MetaProperty',
          start: 0,
          end: 11,
          left: 'import',
          right: 'meta' } } ] },

/** import.meta **/
'import.meta only allowed in modules':
{},

/*** import('foobar') ***/
'dynamic import':
{
  type: 'Module',
  start: 0,
  end: 16,
  statements:
   [ {
       type: 'ExpressionStatement',
       start: 0,
       end: 16,
       expression:
        {
          type: 'ImportCall',
          argument: { type: 'StringLiteral', start: 7, end: 15, value: 'foobar' },
          start: 0,
          end: 16 } } ] },

/** import('foobar') **/
'dynamic import allowed in script':
{
  type: 'Script',
  start: 0,
  end: 16,
  statements:
   [ {
       type: 'ExpressionStatement',
       start: 0,
       end: 16,
       expression:
        {
          type: 'ImportCall',
          argument: { type: 'StringLiteral', start: 7, end: 15, value: 'foobar' },
          start: 0,
          end: 16 } } ] },

})
