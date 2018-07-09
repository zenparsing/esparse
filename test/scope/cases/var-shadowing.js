({

/**
let x;
{
    var x;
}
**/
'var cannot shadow let': {},

/**
'use strict';
function f(x) { var x }
**/
'var can shadow function parameters':
{ type: 'var',
  names:
   { f:
      { declarations:
         [ { type: 'Identifier',
             start: 23,
             end: 24,
             value: 'f',
             context: 'declaration' } ],
        references: [],
        const: false } },
  free: [],
  strict: false,
  parent: null,
  children:
   [ { type: 'block',
       names: {},
       free: [],
       strict: true,
       children:
        [ { type: 'function',
            names: {},
            free: [],
            strict: true,
            children:
             [ { type: 'param',
                 names:
                  { x:
                     { declarations:
                        [ { type: 'Identifier',
                            start: 25,
                            end: 26,
                            value: 'x',
                            context: 'declaration' } ],
                       references: [],
                       const: false } },
                 free: [],
                 strict: true,
                 children:
                  [ { type: 'var',
                      names:
                       { x:
                          { declarations:
                             [ { type: 'Identifier',
                                 start: 34,
                                 end: 35,
                                 value: 'x',
                                 context: 'declaration' } ],
                            references: [],
                            const: false } },
                      free: [],
                      strict: true,
                      children:
                       [ { type: 'block',
                           names: {},
                           free: [],
                           strict: true,
                           children: [],
                           varNames: null } ],
                      varNames: null } ],
                 varNames: null } ],
            varNames: null } ],
       varNames: null } ],
  varNames: [] },

})
