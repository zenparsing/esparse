({

/** export var x; **/
"export not allowed outside of module": {},

/*** export var x; ***/
"export a var": {
    type: "Module",
    statements: [
    {   type: "ExportDeclaration",
        binding: {
            type: "VariableDeclaration",
            kind: "var",
            declarations: [
            {   type: "VariableDeclarator",
                pattern: {
                    type: "Identifier",
                    value: "x"
                },
                initializer: null
            }]
        }
    }]
},

/*** export { x }; ***/
"export an identifier": {
    type: "Module",
    statements: [
    {   type: "ExportDeclaration",
        binding: {
            type: "ExportsList",
            specifiers: [
            {   type: "ExportSpecifier",
                local: {
                    type: "Identifier",
                    value: "x"
                },
                remote: null
            }],
            from: null
        }
    }]
},

/*** export { x, y }; ***/
"export multiple identifiers":{
    type: "Module",
    statements: [
    {   type: "ExportDeclaration",
        binding: {
            type: "ExportsList",
            specifiers: [
            {   type: "ExportSpecifier",
                local: {
                    type: "Identifier",
                    value: "x"
                },
                remote: null
            },
            {   type: "ExportSpecifier",
                local: {
                    type: "Identifier",
                    value: "y"
                },
                remote: null
            }],
            from: null
        }
    }]
},

/*** export { x as y }; ***/
"export and rename identifier": {
    type: "Module",
    statements: [
    {   type: "ExportDeclaration",
        binding: {
            type: "ExportsList",
            specifiers: [
            {   type: "ExportSpecifier",
                local: {
                    type: "Identifier",
                    value: "x"
                },
                remote: {
                    type: "Identifier",
                    value: "y"
                }
            }],
            from: null
        }
    }]
},

/*** export { x as default }; ***/
"exporting a default binding": {
    type: "Module",
    statements: [
    {   type: "ExportDeclaration",
        binding: {
            type: "ExportsList",
            specifiers: [
            {   type: "ExportSpecifier",
                local: {
                    type: "Identifier",
                    value: "x"
                },
                remote: {
                    type: "Identifier",
                    value: "default"
                }
            }],
            from: null
        }
    }]
},

/*** export { x as y } from "x.js"; ***/
"exporting a named set from an external module": {
    type: "Module",
    statements: [
    {   type: "ExportDeclaration",
        binding: {
            type: "ExportsList",
            specifiers: [
            {   type: "ExportSpecifier",
                local: {
                    type: "Identifier",
                    value: "x"
                },
                remote: {
                    type: "Identifier",
                    value: "y"
                }
            }],
            from: {
                type: "String",
                value: "x.js"
            }
        }
    }]
},

/*** export * from "x.js"; ***/
"exporting everything from an external module": {
    type: "Module",
    statements: [
    {   type: "ExportDeclaration",
        binding: {
            type: "ExportsList",
            specifiers: null,
            from: {
                type: "String",
                value: "x.js"
            }
        }
    }]
},

/*** export *; ***/
"exporting everything must include a specifier": { }

})