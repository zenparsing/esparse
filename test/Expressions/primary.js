({

/** null **/
"null": {
    type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression: {
            type: "Null"
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
            type: "Boolean",
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
            type: "Boolean",
            value: false
        }
    }]
},

})