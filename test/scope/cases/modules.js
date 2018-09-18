({

/*** import { x } from 'y' ***/
'imported names': {
  type: 'var',
  names: {},
  free: [],
  strict: true,
  children:
   [ {
       type: 'block',
       names:
        { x:
           { declarations:
              [ {
                  type: 'Identifier',
                  start: 9,
                  end: 10,
                  value: 'x',
                  context: 'declaration' } ],
             references: [],
             const: true } },
       free: [],
       strict: true,
       children: [] } ] },

})
