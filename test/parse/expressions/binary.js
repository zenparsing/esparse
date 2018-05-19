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
                {   type: "NumberLiteral",
                    value: 4
                },
                right:
                {   type: "NumberLiteral",
                    value: 5
                }
            },

            right:
            {   type: "ParenExpression",
                expression:
                {   type: "NumberLiteral",
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
            {   type: "NumberLiteral",
                value: 1
            },
            right:
            {   type: "UnaryExpression",
                operator: "-",
                expression:
                {   type: "NumberLiteral",
                    value: 1
                }
            }
        }
    }]
},

];
