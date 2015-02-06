{

/**
function x(a, a) {}
**/
'duplicates allowed in simple param lists':
{ type: 'var',
  names:
   { x:
      { declarations:
         [ { type: 'Identifier',
             start: 9,
             end: 10,
             value: 'x',
             context: 'declaration' } ],
        references: [] } },
  free: [],
  children:
   [ { type: 'block',
       names: {},
       free: null,
       children:
        [ { type: 'simple-params',
            names:
             { a:
                { declarations:
                   [ { type: 'Identifier',
                       start: 11,
                       end: 12,
                       value: 'a',
                       context: 'declaration' },
                     { type: 'Identifier',
                       start: 14,
                       end: 15,
                       value: 'a',
                       context: 'declaration' } ],
                  references: [] } },
            free: null,
            children:
             [ { type: 'var',
                 names: {},
                 free: null,
                 children: [ { type: 'block', names: {}, free: null, children: [] } ] } ] } ] } ] },

/**
function x(a, ...a) {}
**/
'duplicates not allowed with a rest parameter': {},

/**
function x(a, [a]) {}
**/
'duplicates not allowed with array destructuring': {},

/**
function x(a, {b:a}) {}
**/
'duplicates not allowed with object destructuring': {},

};
