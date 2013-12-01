{

/** function *g() {} **/
"generator declarations": 
{   type: "Script",
    statements: [
    
    {   type: "FunctionDeclaration",
        kind: "generator",
        
        identifier: 
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
"generator expresions": 
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "ParenExpression",
            expression:
        
            {   type: "FunctionExpression",
                kind: "generator",
                
                identifier: 
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

/** function *g() { yield 1; } **/
"yield is a keyword in generators": 
{   type: "Script",
    statements: [
    
    {   type: "FunctionDeclaration",
        kind: "generator",
        
        identifier: 
        {   type: "Identifier",
            value: "g"
        },
        
        params: [],
        
        body: 
        {   type: "FunctionBody",
            statements: [
            {   type: "ExpressionStatement",
                expression: 
                {   type: "YieldExpression",
                    delegate: false,
                    expression:
                    {   type: "Number",
                        value: 1
                    }
                }
            }]
        }
    }]
},

/** function *g() { 
yield
x } **/
"yield has no-line-terminator restriction":
{   type: "Script",
    statements: [
    
    {   type: "FunctionDeclaration",
        kind: "generator",
        
        identifier: 
        {   type: "Identifier",
            value: "g"
        },
        
        params: [],
        
        body: 
        {   type: "FunctionBody",
            statements: [
            {   type: "ExpressionStatement",
                expression: 
                {   type: "YieldExpression",
                    delegate: false,
                    expression: null
                }
            },
            {   type: "ExpressionStatement",
                expression:
                {   type: "Identifier",
                    value: "x"
                }
            }]
        }
    }]
},

};