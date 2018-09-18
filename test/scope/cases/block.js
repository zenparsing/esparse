({

/** class C {} **/
'class declarations are always block-scoped':
{ type: 'var',
  names: {},
  free: [],
  strict: false,
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
            children: [] } ] } ] },

/** class C {} class C {} **/
'duplicate class declarations not allowed': {},

})
