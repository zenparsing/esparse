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

/** module "X" {} **/
"an empty module registration": {
    type: "Script",
    statements: [
    {   type: "ModuleRegistration",
        name: {
            type: "String",
            value: "X"
        },
        body: {
            type: "ModuleBody",
            statements: []
        }
    }]
},

/** module A = B.C; **/
"module alias": {
    type: "Script",
    statements: [
    {   type: "ModuleAlias",
        ident: {
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