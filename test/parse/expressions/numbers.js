({

/** 42 **/
'integer literal':
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:
        {   type: "NumberLiteral",
            value: 42
        }
    }]
},

/** 42.42 **/
'decimal literal':
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:
        {   type: "NumberLiteral",
            value: 42.42
        }
    }]
},

/** .42 **/
'leading point':
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:
        {   type: "NumberLiteral",
            value: .42
        }
    }]
},

/** 0.42 **/
'zero followed by decimal point':
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:
        {   type: "NumberLiteral",
            value: 0.42
        }
    }]
},

/** 42e10 **/
'integer with exponent':
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:
        {   type: "NumberLiteral",
            value: 42e10
        }
    }]
},

/** 42e+10 **/
'integer with signed exponent':
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:
        {   type: "NumberLiteral",
            value: 42e+10
        }
    }]
},

/** 42e-10 **/
'integer with negative exponent':
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:
        {   type: "NumberLiteral",
            value: 42e-10
        }
    }]
},

/** 42E10 **/
'exponent with capital E':
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:
        {   type: "NumberLiteral",
            value: 42E10
        }
    }]
},

/** 42.42e10 **/
'decimal value with exponent':
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:
        {   type: "NumberLiteral",
            value: 42.42e10
        }
    }]
},

/** 0x42; **/
'hex':
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:
        {   type: "NumberLiteral",
            value: 0x42
        }
    }]
},

/** 0X42; **/
'hex with capital X':
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:
        {   type: "NumberLiteral",
            value: 0x42
        }
    }]
},

/** 0b1010; **/
'binary literal':
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:
        {   type: "NumberLiteral",
            value: 10
        }
    }]
},

/** 0B1010; **/
'binary literal with capital B':
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:
        {   type: "NumberLiteral",
            value: 10
        }
    }]
},

/** 0o777; **/
'ocatal literal':
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:
        {   type: "NumberLiteral",
            value: 511
        }
    }]
},

/** 0O777; **/
'octal literal with capital O':
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:
        {   type: "NumberLiteral",
            value: 511
        }
    }]
},

/** 0999; **/
'not a legacy octal':
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:
        {   type: "NumberLiteral",
            value: 0999
        }
    }]
},

/** 0777; **/
'legacy octal':
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:
        {   type: "NumberLiteral",
            value: 511
        }
    }]
},

/** "use strict"; 0777; **/
'legacy octals not allowed in strict mode':
{},

/** 42f **/
'identifier character not allowed afer number':
{},

/** 42n **/
'bigint integer literal':
{
    type: 'Script',
    start: 0,
    end: 3,
    statements:
     [ {
         type: 'ExpressionStatement',
         start: 0,
         end: 3,
         expression: { type: 'NumberLiteral', suffix: 'n', start: 0, end: 3, value: 42 } } ] },

/** 0x8n **/
'bigint hex literal':
{
    type: 'Script',
    start: 0,
    end: 4,
    statements:
     [ {
         type: 'ExpressionStatement',
         start: 0,
         end: 4,
         expression: { type: 'NumberLiteral', suffix: 'n', start: 0, end: 4, value: 8 } } ] },

/** 0b10101n **/
'bigint binary literal':
{
    type: 'Script',
    start: 0,
    end: 8,
    statements:
     [ {
         type: 'ExpressionStatement',
         start: 0,
         end: 8,
         expression: { type: 'NumberLiteral', suffix: 'n', start: 0, end: 8, value: 21 } } ] },

/** 0o777n **/
'bigint octal literal':
{
    type: 'Script',
    start: 0,
    end: 6,
    statements:
     [ {
         type: 'ExpressionStatement',
         start: 0,
         end: 6,
         expression: { type: 'NumberLiteral', suffix: 'n', start: 0, end: 6, value: 511 } } ] },

/** 42N **/
'no capital N for bigints': {},

})
