({

/** [for x of y x]; **/
'basic array comprehension':
{ type: 'Script',
  start: 0,
  end: 15,
  statements: 
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 15,
       expression: 
        { type: 'ArrayComprehension',
          start: 0,
          end: 14,
          qualifiers: 
           [ { type: 'ComprehensionFor',
               start: 1,
               end: 11,
               left: 
                { type: 'Identifier',
                  start: 5,
                  end: 6,
                  value: 'x',
                  context: 'declaration' },
               right: 
                { type: 'Identifier',
                  start: 10,
                  end: 11,
                  value: 'y',
                  context: 'variable' } } ],
          expression: 
           { type: 'Identifier',
             start: 12,
             end: 13,
             value: 'x',
             context: 'variable' } },
       directive: null } ] },

/** (for x of y x) **/
'basic generator comprehension': 
{ type: 'Script',
  start: 0,
  end: 14,
  statements: 
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 14,
       expression: 
        { type: 'GeneratorComprehension',
          start: 0,
          end: 14,
          qualifiers: 
           [ { type: 'ComprehensionFor',
               start: 1,
               end: 11,
               left: 
                { type: 'Identifier',
                  start: 5,
                  end: 6,
                  value: 'x',
                  context: 'declaration' },
               right: 
                { type: 'Identifier',
                  start: 10,
                  end: 11,
                  value: 'y',
                  context: 'variable' } } ],
          expression: 
           { type: 'Identifier',
             start: 12,
             end: 13,
             value: 'x',
             context: 'variable' } },
       directive: null } ] },

/** function* g() { (for x of y yield x); } **/
'generator comprehension cannot contain yield expression': {},


});