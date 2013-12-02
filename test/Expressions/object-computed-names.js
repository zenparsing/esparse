{

/** ({ [x]: 1 }) **/
"computed data properties":
{   type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression:
        {   type: "ParenExpression",
            expression:
            {   type: "ObjectLiteral",
                properties: [
                {   type: "PropertyDefinition",
                    name:
                    {   type: "ComputedPropertyName",
                        expression:
                        {   type: "Identifier",
                            value: "x"
                        }
                    },
                    expression:
                    {   type: "Number",
                        value: 1
                    }
                }]
            }
        }
    }]          
},

/** ({ [x]() {} }) **/
"computed method names":
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
                    {   type: "ComputedPropertyName",
                        expression:
                        {   type: "Identifier",
                            value: "x"
                        }
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

/** ({ get [x]() {}, set [x](value) {} }) **/
"computed accessors":
{   type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression:
        {   type: "ParenExpression",
            expression:
            {   type: "ObjectLiteral",
                properties: [
                {   type: "MethodDefinition",
                    kind: "get",
                    name:
                    {   type: "ComputedPropertyName",
                        expression:
                        {   type: "Identifier",
                            value: "x"
                        }
                    },
                    params: [],
                    body:
                    {   type: "FunctionBody",
                        statements: []
                    }
                },
                {   type: "MethodDefinition",
                    kind: "set",
                    name:
                    {   type: "ComputedPropertyName",
                        expression:
                        {   type: "Identifier",
                            value: "x"
                        }
                    },
                    params: [
                    {   type: "FormalParameter",
                        pattern:
                        {   type: "Identifier",
                            value: "value"
                        },
                        initializer: null
                    }],
                    body:
                    {   type: "FunctionBody",
                        statements: []
                    }
                }]
            }
        }
    }]          
},

/** ({ *[x]() {} }) **/
"computed generators":
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
                    {   type: "ComputedPropertyName",
                        expression:
                        {   type: "Identifier",
                            value: "x"
                        }
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