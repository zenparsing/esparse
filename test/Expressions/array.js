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
                {   type: "NumberLiteral",
                    value: 1
                },
                {   type: "NumberLiteral",
                    value: 2
                },
                null,
                {   type: "NumberLiteral",
                    value: 3
                }]
            }
        }
    }]
}

};