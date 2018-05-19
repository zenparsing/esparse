({

/** label: x; label: x; **/
'duplicate labels are allowed':
{ type: 'Script',
  start: 0,
  end: 19,
  statements:
   [ { type: 'LabelledStatement',
       start: 0,
       end: 9,
       label:
        { type: 'Identifier',
          start: 0,
          end: 5,
          value: 'label',
          context: '' },
       statement:
        { type: 'ExpressionStatement',
          start: 7,
          end: 9,
          expression:
           { type: 'Identifier',
             start: 7,
             end: 8,
             value: 'x',
             context: 'variable' } } },
     { type: 'LabelledStatement',
       start: 10,
       end: 19,
       label:
        { type: 'Identifier',
          start: 10,
          end: 15,
          value: 'label',
          context: '' },
       statement:
        { type: 'ExpressionStatement',
          start: 17,
          end: 19,
          expression:
           { type: 'Identifier',
             start: 17,
             end: 18,
             value: 'x',
             context: 'variable' } } } ] },

/** label: { break label; } **/
'break allowed outside of iteration or switch':
{ type: 'Script',
  start: 0,
  end: 23,
  statements:
   [ { type: 'LabelledStatement',
       start: 0,
       end: 23,
       label:
        { type: 'Identifier',
          start: 0,
          end: 5,
          value: 'label',
          context: '' },
       statement:
        { type: 'Block',
          start: 7,
          end: 23,
          statements:
           [ { type: 'BreakStatement',
               start: 9,
               end: 21,
               label:
                { type: 'Identifier',
                  start: 15,
                  end: 20,
                  value: 'label',
                  context: '' } } ] } } ] },

/** switch (x) { default: break; } **/
'unlabelled break within switch':
{ type: 'Script',
  start: 0,
  end: 30,
  statements:
   [ { type: 'SwitchStatement',
       start: 0,
       end: 30,
       descriminant:
        { type: 'Identifier',
          start: 8,
          end: 9,
          value: 'x',
          context: 'variable' },
       cases:
        [ { type: 'SwitchCase',
            start: 13,
            end: 28,
            test: null,
            consequent: [ { type: 'BreakStatement', start: 22, end: 28, label: null } ] } ] } ] },

/** while (true) { break } **/
'unlabelled break within iteration statement':
{ type: 'Script',
  start: 0,
  end: 22,
  statements:
   [ { type: 'WhileStatement',
       start: 0,
       end: 22,
       test: { type: 'BooleanLiteral', start: 7, end: 11, value: true },
       body:
        { type: 'Block',
          start: 13,
          end: 22,
          statements: [ { type: 'BreakStatement', start: 15, end: 20, label: null } ] } } ] },

/** while (true) { continue } **/
'unlabelled continue inside of iteration statement':
{ type: 'Script',
  start: 0,
  end: 25,
  statements:
   [ { type: 'WhileStatement',
       start: 0,
       end: 25,
       test: { type: 'BooleanLiteral', start: 7, end: 11, value: true },
       body:
        { type: 'Block',
          start: 13,
          end: 25,
          statements: [ { type: 'ContinueStatement', start: 15, end: 23, label: null } ] } } ] },

/** label: function x() {} **/
'function declarations are allowed within labelled statements in sloppy mode (Annex B)':
{ type: 'Script',
  start: 0,
  end: 22,
  statements:
   [ { type: 'LabelledStatement',
       start: 0,
       end: 22,
       label:
        { type: 'Identifier',
          start: 0,
          end: 5,
          value: 'label',
          context: '' },
       statement:
        { type: 'FunctionDeclaration',
          start: 7,
          end: 22,
          kind: '',
          identifier:
           { type: 'Identifier',
             start: 16,
             end: 17,
             value: 'x',
             context: 'declaration' },
          params: [],
          body: { type: 'FunctionBody', start: 20, end: 22, statements: [] },
          error: 'Labeled FunctionDeclarations are disallowed in strict mode' } } ] },

/** "use strict"; label: function x() {} **/
'labelled function declarations are not allowed in strict mode': {},

/** label: { break lbl; } **/
'labelled break must refer to a named label': {},

/** label: { break; } **/
'unlabelled break outside of iteration or switch not allowed - 1': {},

/** break **/
'unlabelled break outside of iteration or switch not allowed - 2': {},

/** label: { label: x; } **/
'duplicate nested labels are not allowed': {},

/** label: { for (; true;) continue label; } **/
'continue statement with label must reference an iteration statement': {},

/** continue; **/
'continue not allowed outside of iteration statement - 1': {},

/** switch (x) { default: continue; } **/
'continue not allowed outside of iteration statement - 2': {}

})
