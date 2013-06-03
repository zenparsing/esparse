({

/** module X {} **/
"an empty module": {
    type: "Script",
    statements: [
    {   type: "ModuleDeclaration",
        ident: {
            type: "Identifier",
            value: "X"
        },
        body: {
            type: "ModuleBody",
            statements: []
        }
    }]
},

/** module x from "x.js"; **/
"module from": { 
    type: "Script",
    statements: [
    {   type: "ModuleFromDeclaration",
        ident: {
            type: "Identifier",
            value: "x"
        },
        from: {
            type: "String",
            value: "x.js"
        }
    }]
},

})