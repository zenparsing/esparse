({

/** /abc/i **/
'a basic regular expression':
{ type: 'Script',
  start: 0,
  end: 6,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 6,
       expression:
        { type: 'RegularExpression',
          start: 0,
          end: 6,
          value: 'abc',
          flags: 'i' } } ] },

/** /abc/ **/
'a regular expression with no flags':
{ type: 'Script',
  start: 0,
  end: 5,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 5,
       expression:
        { type: 'RegularExpression',
          start: 0,
          end: 5,
          value: 'abc',
          flags: '' } } ] },

/** /abc/000 **/
'regular expression flags can start with a number':
{ type: 'Script',
  start: 0,
  end: 8,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 8,
       expression:
        { type: 'RegularExpression',
          start: 0,
          end: 8,
          value: 'abc',
          flags: '000' } } ] },

/** /abc/i\u0065 **/
'regular expression flags cannot contain unicode escapes': {},

})
