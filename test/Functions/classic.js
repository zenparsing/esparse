{

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

}