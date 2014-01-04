[

/** 4 + 5 << (6) **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "BinaryExpression",
            operator: "<<",
            left: 
            {   type: "BinaryExpression",
                operator: "+",
                left:
                {   type: "Number",
                    value: 4
                },
                right:
                {   type: "Number",
                    value: 5
                }
            },
            
            right:
            {   type: "ParenExpression",
                expression:
                {   type: "Number",
                    value: 6
                }
            }
        }
    }]
},

/** 1+-1 **/
{   type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression:
        {   type: "BinaryExpression",
            operator: "+",
            left:
            {   type: "Number",
                value: 1
            },
            right:
            {   type: "UnaryExpression",
                operator: "-",
                expression:                
                {   type: "Number",
                    value: 1
                }
            }
        }
    }]
},

];