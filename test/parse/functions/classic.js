({

/** function x() {} **/
"function declaration": {
    type: "Script",
    statements: [
    {   type: "FunctionDeclaration",
        kind: "",
        identifier:
        {   type: "Identifier",
            value: "x",
            context: "declaration"
        },
        params: [],
        body: 
        {   type: "FunctionBody",
            statements: []
        }
    }]
},

/** function yield() { "use strict" } **/
"function identifier must follow strictness of body": {},

/** function x(...args) { } **/
"function with rest parameter": {
    type: "Script",
    statements: [
    {   type: "FunctionDeclaration",
        kind: "",
        identifier:
        {   type: "Identifier",
            value: "x",
            context: "declaration"
        },
        params: [
        {   type: "RestParameter",
            identifier:
            {   type: "Identifier",
                value: "args"
            }
        }],
        body: 
        {   type: "FunctionBody",
            statements: []
        }
    }]
},

/** function x(a, ...b) { } **/
"function with multiple parameters and a rest": {
    type: "Script",
    statements: [
    {   type: "FunctionDeclaration",
        kind: "",
        identifier:
        {   type: "Identifier",
            value: "x",
            context: "declaration"
        },
        params: [
        {   type: "FormalParameter",
            pattern:
            {   type: "Identifier",
                value: "a"
            },
            initializer: null
        },
        {   type: "RestParameter",
            identifier:
            {   type: "Identifier",
                value: "b"
            }
        }],
        body: 
        {   type: "FunctionBody",
            statements: []
        }
    }]
},

/** function x(...b, c) { } **/
"a parameter cannot follow a rest": {},

})