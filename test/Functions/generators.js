[

/** function *g() {} **/
{   type: "Script",
    statements: [
    
    {   type: "FunctionDeclaration",
        generator: true,
        
        ident: 
        {   type: "Identifier",
            value: "g"
        },
        
        params: [],
        
        body: 
        {   type: "FunctionBody",
            statements: []
        }
    }]
},

/** (function *g() {}); **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "ParenExpression",
            expression:
        
            {   type: "FunctionExpression",
                generator: true,
                
                ident: 
                {   type: "Identifier",
                    value: "g"
                },
                
                params: [],
                
                body: 
                {   type: "FunctionBody",
                    statements: []
                }
            }
        }
    }]
},

];