({

/** x = y; **/
'Basic assignment': {
    type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:

        {   type: "AssignmentExpression",
            operator: "=",

            left:
            {   type: "Identifier",
                value: "x"
            },

            right:
            {   type: "Identifier",
                value: "y"
            }
        }
    }]
},

/** ((x)) = y; **/
'LHS parens are not unwrapped': {},

})
