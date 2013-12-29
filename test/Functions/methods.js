[

/** ({ x() {} }); **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "ParenExpression",
            expression:
        
            {   type: "ObjectLiteral",
                properties: [
                
                {   type: "MethodDefinition",
                    
                    kind: "",
                    
                    name: 
                    {   type: "Identifier",
                        value: "x"
                    },
                    
                    params: [],
                        
                    body: 
                    {   type: "FunctionBody",
                        statements: []
                    }
                }]
            }
        }
    }]
},

/** ({ *x() {} }); **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "ParenExpression",
            expression:
        
            {   type: "ObjectLiteral",
                properties: [
                
                {   type: "MethodDefinition",
                    
                    kind: "generator",
                    
                    name: 
                    {   type: "Identifier",
                        value: "x"
                    },
                    
                    params: [],
                        
                    body: 
                    {   type: "FunctionBody",
                        statements: []
                    }
                }]
            }
        }
    }]
},

]