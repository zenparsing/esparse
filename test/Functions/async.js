{

/** async f() {} **/
"async declaration": {   
    type: "Script",
    statements: [
    
    {   type: "FunctionDeclaration",
        kind: "async",
        
        identifier: 
        {   type: "Identifier",
            value: "f"
        },
        
        params: [],
        
        body: 
        {   type: "FunctionBody",
            statements: []
        }
    }]
},

/** async
f
**/
"async declaration has newline restriction": {
    type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression:
        {   type: "Identifier",
            value: "async"
        }
    },
    {   type: "ExpressionStatement",
        expression:
        {   type: "Identifier",
            value: "f"
        }
    }]
},

/** (async f() {}); **/
"async expression": {   
    type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        {   type: "ParenExpression",
            expression:
            {   type: "FunctionExpression",
                kind: "async",
                identifier: 
                {   type: "Identifier",
                    value: "f"
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

/** async f() { await 0; } **/
"await expression": {
    type: "Script",
    statements: [
    {   type: "FunctionDeclaration",
        kind: "async",
        identifier:
        {   type: "Identifier",
            value: "f"
        },
        params: [],
        body:
        {   type: "FunctionBody",
            statements: [
            {   type: "ExpressionStatement",
                expression:
                {   type: "AwaitExpression",
                    expression:
                    {   type: "Number",
                        value: 0
                    }
                }
            }]
        }
    }]
},


/* * async f() { (await 0); } *
"await expression inside of paren": {
    type: "Script",
    statements: [
    {   type: "FunctionDeclaration",
        kind: "async",
        identifier:
        {   type: "Identifier",
            value: "f"
        },
        params: [],
        body:
        {   type: "FunctionBody",
            statements: [
            {   type: "ExpressionStatement",
                expression:
                {   type: "AwaitExpression",
                    expression:
                    {   type: "Number",
                        value: 0
                    }
                }
            }]
        }
    }]
},*/


/** async f() { await 
0; } **/
"empty await expression with newline": {
    type: "Script",
    statements: [
    {   type: "FunctionDeclaration",
        kind: "async",
        identifier:
        {   type: "Identifier",
            value: "f"
        },
        params: [],
        body:
        {   type: "FunctionBody",
            statements: [
            {   type: "ExpressionStatement",
                expression:
                {   type: "AwaitExpression",
                    expression: null
                }
            },
            {   type: "ExpressionStatement",
                expression:
                {   type: "Number",
                    value: 0
                }
            }]
        }
    }]
},

/** await 0; **/
"await not allowed outside of async": {},

/** ({ async f() {} }); **/
"async object methods": {
    type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression:
        {   type: "ParenExpression",
            expression:
            {   type: "ObjectLiteral",
                properties: [
                {   type: "MethodDefinition",
                    kind: "async",
                    name:
                    {   type: "Identifier",
                        value: "f"
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

};