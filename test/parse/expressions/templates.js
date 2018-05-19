({

/** `abcdefg`; **/
'template with single literal':
{ type: 'Script',
  start: 0,
  end: 10,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 10,
       expression:
        { type: 'TemplateExpression',
          start: 0,
          end: 9,
          literals:
           [ { type: 'TemplatePart',
               start: 0,
               end: 9,
               value: 'abcdefg',
               raw: 'abcdefg',
               templateEnd: true } ],
          substitutions: [] } } ] },

/** `abc$efg`; **/
'template with a standalone $':
{ type: 'Script',
  start: 0,
  end: 10,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 10,
       expression:
        { type: 'TemplateExpression',
          start: 0,
          end: 9,
          literals:
           [ { type: 'TemplatePart',
               start: 0,
               end: 9,
               value: 'abc$efg',
               raw: 'abc$efg',
               templateEnd: true } ],
          substitutions: [] } } ] },

/** `abc${ d }efg`; **/
'template with a single substitution':
{ type: 'Script',
  start: 0,
  end: 15,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 15,
       expression:
        { type: 'TemplateExpression',
          start: 0,
          end: 14,
          literals:
           [ { type: 'TemplatePart',
               start: 0,
               end: 6,
               value: 'abc',
               raw: 'abc',
               templateEnd: false },
             { type: 'TemplatePart',
               start: 9,
               end: 14,
               value: 'efg',
               raw: 'efg',
               templateEnd: true } ],
          substitutions:
           [ { type: 'Identifier',
               start: 7,
               end: 8,
               value: 'd',
               context: 'variable' } ] } } ] },

/** `abc${ `d` }efg`; **/
'template with a substitution containing a template':
{ type: 'Script',
  start: 0,
  end: 17,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 17,
       expression:
        { type: 'TemplateExpression',
          start: 0,
          end: 16,
          literals:
           [ { type: 'TemplatePart',
               start: 0,
               end: 6,
               value: 'abc',
               raw: 'abc',
               templateEnd: false },
             { type: 'TemplatePart',
               start: 11,
               end: 16,
               value: 'efg',
               raw: 'efg',
               templateEnd: true } ],
          substitutions:
           [ { type: 'TemplateExpression',
               start: 7,
               end: 10,
               literals:
                [ { type: 'TemplatePart',
                    start: 7,
                    end: 10,
                    value: 'd',
                    raw: 'd',
                    templateEnd: true } ],
               substitutions: [] } ] } } ] },

/** a.b`z`; **/
'tagged template with member expression tag':
{ type: 'Script',
  start: 0,
  end: 7,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 7,
       expression:
        { type: 'TaggedTemplateExpression',
          start: 0,
          end: 6,
          tag:
           { type: 'MemberExpression',
             start: 0,
             end: 3,
             object:
              { type: 'Identifier',
                start: 0,
                end: 1,
                value: 'a',
                context: 'variable' },
             property: { type: 'Identifier', start: 2, end: 3, value: 'b', context: '' },
             computed: false },
          template:
           { type: 'TemplateExpression',
             start: 3,
             end: 6,
             literals:
              [ { type: 'TemplatePart',
                  start: 3,
                  end: 6,
                  value: 'z',
                  raw: 'z',
                  templateEnd: true } ],
             substitutions: [] } } } ] },

/** `\n` **/
'raw value does not process escapes':
{ type: 'Script',
  start: 0,
  end: 4,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 4,
       expression:
        { type: 'TemplateExpression',
          start: 0,
          end: 4,
          literals:
           [ { type: 'TemplatePart',
               start: 0,
               end: 4,
               value: '\n',
               raw: '\\n',
               templateEnd: true } ],
          substitutions: [] } } ] },

/** `` **/
'empty template':
{ type: 'Script',
  start: 0,
  end: 2,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 2,
       expression:
        { type: 'TemplateExpression',
          start: 0,
          end: 2,
          literals:
           [ { type: 'TemplatePart',
               start: 0,
               end: 2,
               value: '',
               raw: '',
               templateEnd: true } ],
          substitutions: [] } } ] },

/** `${1}${1}` **/
'template with empty literals':
{ type: 'Script',
  start: 0,
  end: 10,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 10,
       expression:
        { type: 'TemplateExpression',
          start: 0,
          end: 10,
          literals:
           [ { type: 'TemplatePart',
               start: 0,
               end: 3,
               value: '',
               raw: '',
               templateEnd: false },
             { type: 'TemplatePart',
               start: 4,
               end: 7,
               value: '',
               raw: '',
               templateEnd: false },
             { type: 'TemplatePart',
               start: 8,
               end: 10,
               value: '',
               raw: '',
               templateEnd: true } ],
          substitutions:
           [ { type: 'NumberLiteral', start: 3, end: 4, value: 1 },
             { type: 'NumberLiteral', start: 7, end: 8, value: 1 } ] } } ] },

/** `\
` **/
'template with line continuation':
{ type: 'Script',
  start: 0,
  end: 4,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 4,
       expression:
        { type: 'TemplateExpression',
          start: 0,
          end: 4,
          literals:
           [ { type: 'TemplatePart',
               start: 0,
               end: 4,
               value: '\n',
               raw: '\\\n',
               templateEnd: true } ],
          substitutions: [] } } ] },

})
