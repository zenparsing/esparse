({

  /** let e; try {} catch (e) { let e; } **/
  'catch parameters exist in a new scope':
  { type: 'var',
    names: {},
    free: [],
    strict: false,
    children:
     [ { type: 'block',
         names:
          { e:
             { declarations:
                [ { type: 'Identifier',
                    start: 4,
                    end: 5,
                    value: 'e',
                    context: 'declaration' } ],
               references: [],
               const: false } },
         free: [],
         strict: false,
         children:
          [ { type: 'block',
              names: {},
              free: [],
              strict: false,
              children: [] },
            { type: 'catch',
              names:
              { e:
                { declarations:
                   [ { type: 'Identifier',
                       start: 21,
                       end: 22,
                       value: 'e',
                       context: 'declaration' } ],
                  references: [],
                  const: false }
              },
              free: [],
              strict: false,
              children: [
                { type: 'block',
                  names:
                    { e:
                      { declarations:
                          [ { type: 'Identifier',
                              start: 30,
                              end: 31,
                              value: 'e',
                              context: 'declaration' } ],
                        references: [],
                        const: false } },
                  free: [],
                  strict: false,
                  children: [] } ] } ] } ] },

  })
