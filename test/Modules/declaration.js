({

/** module X {} **/
"an empty module": {
    type: "Script",
    statements: [
    {   type: "ModuleDeclaration",
        identifier: {
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
    {   type: "ModuleImport",
        identifier: {
            type: "Identifier",
            value: "x"
        },
        from: {
            type: "String",
            value: "x.js"
        }
    }]
},

/** module A = B.C; **/
"module alias": {
    type: "Script",
    statements: [
    {   type: "ModuleAlias",
        identifier: {
            type: "Identifier",
            value: "A"
        },
        path: {
            type: "ModulePath",
            elements: [
            {   type: "Identifier",
                value: "B"
            },
            {   type: "Identifier",
                value: "C"
            }]
        }
    }]
},

})