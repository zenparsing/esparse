({

/** "ab\xB5cd"; **/
'hex escape in string':
{ type: 'Script',
  start: 0,
  end: 11,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 11,
       expression: { type: 'StringLiteral', start: 0, end: 10, value: 'abµcd' } } ] },

/** "ab\u01BBcd"; **/
'unicode escape in string':
{ type: 'Script',
  start: 0,
  end: 13,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 13,
       expression: { type: 'StringLiteral', start: 0, end: 12, value: 'abƻcd' } } ] },

/** \u{64}efg; **/
"extended unicode escapes - 1": {
    type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression: {
            type: "Identifier",
            value: "defg"
        }
    }]
},

/** gfe\u{64}; **/
"extended unicode escapes - 2": {
    type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression: {
            type: "Identifier",
            value: "gfed"
        }
    }]
},

/** ƒ; **/
"unicode identifiers": {
    type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression: {
            type: "Identifier",
            value: "ƒ"
        }
    }]
},

/** "\u{2f804}" **/
'non-bmp unicode escapes':
{ type: 'Script',
  start: 0,
  end: 11,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 11,
       expression: { type: 'StringLiteral', start: 0, end: 11, value: '\ud87e\udc04' } } ] },

/** \u{1D4A2} **/
'non-bmp unicode escapes in identifiers':
{ type: 'Script',
  start: 0,
  end: 9,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 9,
       expression:
        { type: 'Identifier',
          start: 0,
          end: 9,
          value: '𝒢',
          context: 'variable' } } ] },

/** 𝒢; **/
'non-bmp identifier characters':
{ type: 'Script',
  start: 0,
  end: 3,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 3,
       expression:
        { type: 'Identifier',
          start: 0,
          end: 2,
          value: '𝒢',
          context: 'variable' } } ] },

/** 9𝒢; **/
'number cannot be followed by a non-BMP identifier start character': {},

/** \u{} **/
'unicode escapes must have a valid hex value - 1': {},

/** \u{hah} **/
'unicode escapes must have a valid hex value - 2': {},

/** \u{ **/
'unicode escapes must have balanced braces': {},

/** \u{12 } **/
'unicode escapes cannot use space': {},

/** \u0030abc; **/
'cannot use escape sequence to create invalid identifiers': {},

/** "\u{110000}" **/
'unicode escapes cannot be greater than 0x10ffff': {},

/** \u0064ebugger; **/
'reserved words cannot contain unicode escapes': {},

/** l\u0065t x = 1; **/
'contextual keywords cannot contain unicode escapes - 1': {},

/** a\u0073ync function af() {} **/
'contextual keywords cannot contain unicode escapes - 2': {},


})
