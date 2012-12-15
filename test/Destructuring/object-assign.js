[

/** ({ x: x } = a); **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "ParenExpression",
            expression:
        
            {   type: "AssignmentExpression",
                operator: "=",
                
                left:
                {   type: "ObjectPattern",
                
                    properties: [
                    
                    {   type: "PatternProperty",
                    
                        name: 
                        {   type: "Identifier",
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
        }
    }]
},

/** ({ x = 123 } = a); **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "ParenExpression",
            expression:
        
            {   type: "AssignmentExpression",
                operator: "=",
                
                left:
                {   type: "ObjectPattern",
                
                    properties: [
                    
                    {   type: "PatternProperty",
                    
                        name: 
                        {   type: "Identifier",
                            value: "x"
                        },
                        
                        pattern: null,
                        
                        init:
                        {   type: "Number",
                            value: 123
                        }
                    }]
                },
                
                right:
                {   type: "Identifier",
                    value: "a"
                }
            }
        }
    }]
},

// Parens are allowed around pattern
/** (({ x: x })) = a; **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "AssignmentExpression",
            operator: "=",
            
            left:
            {   type: "ParenExpression",
                expression:
                
                {   type: "ParenExpression",
                    expression:
                    
                    {   type: "ObjectPattern",
                        properties: [
                        
                        {   type: "PatternProperty",
                        
                            name: 
                            {   type: "Identifier",
                                value: "x"
                            },
                            
                            pattern:
                            {   type: "Identifier",
                                value: "x"
                            },
                            
                            init: null
                        }]
                    }
                }
            },
            
            right:
            {   type: "Identifier",
                value: "a"
            }
        }
    }]
},

// Invalid object literals throw
/** ({ x = 123 }); **/
{},

// Keywords cannot be used as simple names
/** ({ if } = a); **/
{},

// Assignment to arguments should throw
/** ({ args: arguments }) = a; **/
{},

// Assignment to arguments should throw
/** ({ arguments }) = a; **/
{},

// Duplicate names do not throw
/** "use strict"; ({ x: a, x: b }) = q; **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "String",
            value: "use strict"
        }
    },
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "AssignmentExpression",
            operator: "=",
            
            left:
            {   type: "ParenExpression",
                expression:
                
                {   type: "ObjectPattern",
                    properties: [
                    
                    {   type: "PatternProperty",
                        name:
                        {   type: "Identifier",
                            value: "x"
                        },
                        pattern:
                        {   type: "Identifier",
                            value: "a"
                        },
                        init: null
                    },
                    
                    {   type: "PatternProperty",
                        name:
                        {   type: "Identifier",
                            value: "x"
                        },
                        pattern:
                        {   type: "Identifier",
                            value: "b"
                        },
                        init: null
                    }]
                }
            },
            
            right:
            {   type: "Identifier",
                value: "q"
            }
        }
    }]
},

];