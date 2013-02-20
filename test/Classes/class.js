[

/** class C {} **/
{   type: "Script",
    statements: [
    
    {   type: "ClassDeclaration",
        
        ident:
        {   type: "Identifier",
            value: "C"
        },
        
        base: null,
        
        body: 
        {   type: "ClassBody",
            elements: []
        }
    }]
},

/** (class C {}); **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "ParenExpression",
            expression:
            
            {   type: "ClassExpression",
                
                ident:
                {   type: "Identifier",
                    value: "C"
                },
                
                base: null,
                
                body: 
                {   type: "ClassBody",
                    elements: []
                }
            }
        }
    }]
},

/** class C { static S() {} } **/
{   type: "Script",
    statements: [
    
    {   type: "ClassDeclaration",
        
        ident:
        {   type: "Identifier",
            value: "C"
        },
        
        base: null,
        
        body: 
        {   type: "ClassBody",
            elements: [
            
            {   type: "MethodDefinition",
                static: true,
                generator: false,
                accessor: null,
                name:
                {   type: "Identifier",
                    value: "S"
                },
                params: [],
                body:
                {   type: "FunctionBody",
                    statements: []
                }
            }]
        }
    }]
},

]