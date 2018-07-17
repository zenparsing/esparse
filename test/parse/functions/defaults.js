({

/** function f(a = 1) { "use strict"; } **/
'functions with non-simple params cannot have strict directive': {},

/** function f(a) { "use strict"; } **/
'functions with simple params can have strict directive': {
  type: 'Script',
  start: 0,
  end: 31,
  statements:
   [ {
       type: 'FunctionDeclaration',
       start: 0,
       end: 31,
       kind: '',
       identifier:
        {
          type: 'Identifier',
          start: 9,
          end: 10,
          value: 'f',
          context: 'declaration' },
       params:
        [ {
            type: 'FormalParameter',
            start: 11,
            end: 12,
            pattern:
             {
               type: 'Identifier',
               start: 11,
               end: 12,
               value: 'a',
               context: 'declaration' },
            initializer: null } ],
       body:
        {
          type: 'FunctionBody',
          start: 14,
          end: 31,
          statements:
           [ {
               type: 'Directive',
               start: 16,
               end: 29,
               value: 'use strict',
               expression:
                { type: 'StringLiteral', start: 16, end: 28, value: 'use strict' } } ] } } ] },

})
