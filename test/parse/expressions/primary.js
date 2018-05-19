({

/** null **/
"null": {
    type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression: {
            type: "NullLiteral"
        }
    }]
},

/** this **/
"this": {
    type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression: {
            type: "ThisExpression"
        }
    }]
},

/** true **/
"true": {
    type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression: {
            type: "BooleanLiteral",
            value: true
        }
    }]
},

/** false **/
"false": {
    type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression: {
            type: "BooleanLiteral",
            value: false
        }
    }]
},

})
