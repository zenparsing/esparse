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
                init: null
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
                init: null 
            },
            {   type: "FormalParameter",
                pattern: 
                {   type: "Identifier",
                    value: "y"
                },
                init: null
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
                init: null
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

/** (arguments) => { "use strict"; } **/
{},

/** ({ arguments }) => { "use strict"; } **/
{},

/** ({ args: arguments }) => { "use strict"; } **/
{},

/** ({ args: arguments }) => { "use strict"; } **/
{},

// Duplicate parameters should throw in strict mode

/** (a, a) => { "use strict"; } **/
{},

];