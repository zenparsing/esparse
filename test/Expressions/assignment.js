[

/** x = y; **/
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
            {   type: "Identifier",
                value: "y"
            }
        }
    }]
},

/** ((x)) = y; **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "AssignmentExpression",
            operator: "=",
            
            left:
            {   type: "ParenExpression",
                expression:
                {   type: "ParenExpression",
                    expression:
                    {   type: "Identifier",
                        value: "x"
                    }
                }
            },
            
            right:
            {   type: "Identifier",
                value: "y"
            }
        }
    }]
},

]