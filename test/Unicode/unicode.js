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
"extended unicode escapes": {
    type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression: {
            type: "Identifier",
            value: "defg"
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

// TODO: Support non-BMP unicode escapes
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

// TODO: Support surrogate pairs in identifiers

/*\u{1D4A2} 
'non-bmp unicode escapes in identifiers':
null,
**/

/* 𝒢;
'non-bmp identifier characters': null,
**/

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

});