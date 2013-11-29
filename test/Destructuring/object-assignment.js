({

/** ({ x: x } = a); **/
"basic destructuring": {   
    type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression: {
            type: "ParenExpression",
            expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                    type: "ObjectPattern",
                    properties: [
                    
                    {   type: "PatternProperty",
                        name: {
                            type: "Identifier",
                            value: "x"
                        },
                        pattern: {
                            type: "Identifier",
                            value: "x"
                        },
                        initializer: null
                    }]
                },
                
                right: {
                    type: "Identifier",
                    value: "a"
                }
            }
        }
    }]
},

/** ({ x } = a); **/
"key shorthands": {   
    type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression: {
            type: "ParenExpression",
            expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                    type: "ObjectPattern",
                    properties: [
                    
                    {   type: "PatternProperty",
                        name: {
                            type: "Identifier",
                            value: "x"
                        },
                        pattern: null,
                        initializer: null
                    }]
                },
                
                right: {
                    type: "Identifier",
                    value: "a"
                }
            }
        }
    }]
},

/** ({ x = 123 } = a); **/
"defaults are allowed": {
    type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression: {
            type: "ParenExpression",
            expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                    type: "ObjectPattern",
                    properties: [
                    
                    {   type: "PatternProperty",
                        name: {
                            type: "Identifier",
                            value: "x"
                        },
                        pattern: null,
                        initializer: {
                            type: "Number",
                            value: 123
                        }
                    }]
                },
                right: {
                    type: "Identifier",
                    value: "a"
                }
            }
        }
    }]
},

/** (({ x: x })) = a; **/
"parens are allowed around pattern": {
    type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression: {
            type: "AssignmentExpression",
            operator: "=",
            left: {
                type: "ParenExpression",
                expression: {
                    type: "ParenExpression",
                    expression: {
                        type: "ObjectPattern",
                        properties: [
                        {   type: "PatternProperty",
                            name: {
                                type: "Identifier",
                                value: "x"
                            },
                            pattern: {
                                type: "Identifier",
                                value: "x"
                            },
                            initializer: null
                        }]
                    }
                }
            },
            right: {
                type: "Identifier",
                value: "a"
            }
        }
    }]
},

/** ({ x = 123 }); **/
"invalid object literals throw": {},
 
/** ({ if } = a); **/
"keywords cannot be used as simple names": {},
 
/** ({ args: arguments }) = a; **/
"assignment to arguments throws": {},

/** ({ arguments }) = a; **/
"shorthand assignment to arguments throws": {},

/** "use strict"; ({ x: a, x: b }) = q; **/
"duplicate names do not throw": {   
    type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression: {
            type: "String",
            value: "use strict"
        }
    },
    
    {   type: "ExpressionStatement",
        expression: {
            type: "AssignmentExpression",
            operator: "=",
            left: {
                type: "ParenExpression",
                expression: {
                    type: "ObjectPattern",
                    properties: [
                    
                    {   type: "PatternProperty",
                        name: {
                            type: "Identifier",
                            value: "x"
                        },
                        pattern: {
                            type: "Identifier",
                            value: "a"
                        },
                        initializer: null
                    },
                    
                    {   type: "PatternProperty",
                        name: {
                            type: "Identifier",
                            value: "x"
                        },
                        pattern: {
                            type: "Identifier",
                            value: "b"
                        },
                        initializer: null
                    }]
                }
            },
            
            right: {
                type: "Identifier",
                value: "q"
            }
        }
    }]
},

})