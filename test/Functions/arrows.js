{

/** () => x; **/
"empty paren with expression": 
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
"identifier with expression": 
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
"paren with expression":
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
"identifier with function body": 
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

/** "use strict"; (arguments) => {} **/
"binding to arguments is disallowed in strict mode": {},

/** "use strict"; ({ arguments }) => {} **/
"binding to arguments with destructuring is disallowed in strict mode (1)": {},

/** "use strict"; ({ args: arguments }) => {} **/
"binding to arguments with destructuring is disallowed in strict mode (2)": {},

/** "use strict"; (a, a) => {} **/
"duplicate parameters are not allowed in strict mode": {},

/** x => { "use strict"; delete x; } **/
"'use strict' prologue sets strictness of function": {},

/** (x = (delete x)) => { "use strict"; } **/
"'use strict' prologue sets strictness of default expressions": {},

/** for (x => x in y;;); **/
"arrow functions are restricted by no-in": {},

};