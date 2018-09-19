({

/** with (x); **/
'with creates a scope':
{ type: 'var',
  names: {},
  free: [ { type: 'Identifier', value: 'x', context: 'variable' } ],
  strict: false,
  children:
   [ { type: 'block',
       names: {},
       free: [],
       strict: false,
       children:
        [ { type: 'with',
            names: {},
            free: [],
            strict: false,
            children: [] } ] } ] },

})
