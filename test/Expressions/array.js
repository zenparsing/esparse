{

/** x = [ 1, 2,, 3, ] **/
"Array literal with holes and trailing comma": 
{   type: "Script",
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
            {   type: "ArrayLiteral",
                elements: [
                {   type: "Number",
                    value: 1
                },
                {   type: "Number",
                    value: 2
                },
                null,
                {   type: "Number",
                    value: 3
                }]
            }
        }
    }]
}

};