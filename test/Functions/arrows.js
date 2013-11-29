[

/** () => x; **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "ArrowFunction",
            
            params: [],
            
            body: 
            {   type: "Identifier",
                value: "x"
            }
        }
    }]
},

/** x => x; **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "ArrowFunction",
            
            params: [
            {   type: "FormalParameter",
                pattern:
                {   type: "Identifier",
                    value: "x"
                },
                initializer: null
            }],
            
            body: 
            {   type: "Identifier",
                value: "x"
            }
        }
    }]
},

/** (x, y) => x + y; **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "ArrowFunction",
            
            params: [
            {   type: "FormalParameter",
                pattern:
                {   type: "Identifier",
                    value: "x"
                },
                initializer: null 
            },
            {   type: "FormalParameter",
                pattern: 
                {   type: "Identifier",
                    value: "y"
                },
                initializer: null
            }],
            
            body: 
            {   type: "BinaryExpression",
                operator: "+",
                left:
                {   type: "Identifier",
                    value: "x"
                },
                right: 
                {   type: "Identifier",
                    value: "y"
                }
            }
        }
    }]
},

/** x => { return x; } **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "ArrowFunction",
            
            params: [
            {   type: "FormalParameter",
                pattern:
                {   type: "Identifier",
                    value: "x"
                },
                initializer: null
            }],
            
            body: 
            {   type: "FunctionBody",
                statements: [
                    
                {   type: "ReturnStatement",
                    argument: 
                    {   type: "Identifier",
                        value: "x"
                    }
                }]
            }
        }
    }]
},

// Binding to "arguments" should throw if function is strict mode

/** "use strict"; (arguments) => {} **/
{},

/** "use strict"; ({ arguments }) => {} **/
{},

/** "use strict"; ({ args: arguments }) => {} **/
{},

/** "use strict"; ({ args: arguments }) => {} **/
{},

// Duplicate parameters should throw in strict mode

/** "use strict"; (a, a) => {} **/
{},

/** x => { "use strict"; delete x; } **/
{   type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression:
        {   type: "ArrowFunction",
            params: [
            {   type: "FormalParameter",
                pattern:
                {   type: "Identifier",
                    value: "x"
                },
                initializer: null
            }],
            body:
            {   type: "FunctionBody",
                statements: [
                {   type: "ExpressionStatement",
                    expression:
                    {   type: "String",
                        value: "use strict"
                    }
                },
                {   type: "ExpressionStatement",    
                    expression:
                    {   type: "UnaryExpression",
                        operator: "delete",
                        expression:
                        {   type: "Identifier",
                            value: "x"
                        }
                    }
                }]
            }
        }
    }]
}

];