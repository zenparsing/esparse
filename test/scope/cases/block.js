({

/** class C {} **/
'class declarations are always block-scoped':
{ type: 'var',
  names: {},
  free: [],
  strict: false,
  parent: null,
  children:
   [ { type: 'block',
       names:
        { C:
           { declarations:
              [ { type: 'Identifier',
                  start: 6,
                  end: 7,
                  value: 'C',
                  context: 'declaration' } ],
             references: [],
             const: false } },
       free: [],
       strict: false,
       children:
        [ { type: 'class',
            names: {},
            free: [],
            strict: true,
            children: [],
            varNames: null } ],
       varNames: null } ],
  varNames: [] },

/** class C {} class C {} **/
'duplicate class declarations not allowed': {},

})
