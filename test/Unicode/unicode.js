({

/** "ab\xB5cd"; **/
"hex escape in string": {
    type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression: {
            type: "String",
            value: "ab\xB5cd",
        }
    }]
},

/** "ab\u01BBcd"; **/
"unicode escape in string": {
    type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression: {
            type: "String",
            value: "ab\u01BBcd",
        }
    }]
},

/** \u0064ebugger; **/
"keywords are detected after escaping": {
    type: "Script",
    statements: [
    {   type: "DebuggerStatement"
    }]
},

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

/** \u{} **/
"unicode escapes must have a valid hex value - 1": {},

/** \u{hah} **/
"unicode escapes must have a valid hex value - 2": {},

/** \u{ **/
"unicode escapes must have balanced braces": {},

/** \u{12 } **/
"unicode escapes cannot use space": {},

/** \u0030abc; **/
"cannot use escape sequence to create invalid identifiers": {},

/** "\u{110000}" **/
"unicode escapes cannot be greater than 0x10ffff": {}

});