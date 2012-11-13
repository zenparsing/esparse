[

/** ({ x: x } = a); **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "AssignmentExpression",
            operator: "=",
            
            left:
            {   type: "ObjectPattern",
            
                properties: [
                
                {   type: "PatternProperty",
                
                    name: 
                    {   type: "IdentifierName",
                        value: "x"
                    },
                    
                    pattern:
                    {   type: "Identifier",
                        value: "x"
                    },
                    
                    init: null
                }]
            },
            
            right:
            {   type: "Identifier",
                value: "a"
            }
        }
    }]
},


];