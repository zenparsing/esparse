({

/** export var x; **/
"export not allowed outside of module": {},

/** module X { export var x; } **/
"export a var": {
    type: "Script",
    statements: [
    {   type: "ModuleDeclaration",
        identifier: {
            type: "Identifier",
            value: "X"
        },
        body: {
            type: "ModuleBody",
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
        }
    }]
},

/** module X { export { x }; } **/
"export an identifier": {
    type: "Script",
    statements: [
    {   type: "ModuleDeclaration",
        identifier: {
            type: "Identifier",
            value: "X"
        },
        body: {
            type: "ModuleBody",
            statements: [
            {   type: "ExportDeclaration",
                binding: {
                    type: "ExportSpecifierSet",
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
        }
    }]
},

/** module X { export { x, y }; } **/
"export multiple identifiers": {
    type: "Script",
    statements: [
    {   type: "ModuleDeclaration",
        identifier: {
            type: "Identifier",
            value: "X"
        },
        body: {
            type: "ModuleBody",
            statements: [
            {   type: "ExportDeclaration",
                binding: {
                    type: "ExportSpecifierSet",
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
        }
    }]
},

/** module X { export { x as y }; } **/
"export and rename identifier": {
    type: "Script",
    statements: [
    {   type: "ModuleDeclaration",
        identifier: {
            type: "Identifier",
            value: "X"
        },
        body: {
            type: "ModuleBody",
            statements: [
            {   type: "ExportDeclaration",
                binding: {
                    type: "ExportSpecifierSet",
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
        }
    }]
},

/** module X { export { x as default }; } **/
"exporting a default binding": {
    type: "Script",
    statements: [
    {   type: "ModuleDeclaration",
        identifier: {
            type: "Identifier",
            value: "X"
        },
        body: {
            type: "ModuleBody",
            statements: [
            {   type: "ExportDeclaration",
                binding: {
                    type: "ExportSpecifierSet",
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
        }
    }]
},

/** module X { export { x as y } from "x.js"; } **/
"exporting a named set from an external module": {
    type: "Script",
    statements: [
    {   type: "ModuleDeclaration",
        identifier: {
            type: "Identifier",
            value: "X"
        },
        body: {
            type: "ModuleBody",
            statements: [
            {   type: "ExportDeclaration",
                binding: {
                    type: "ExportSpecifierSet",
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
        }
    }]
},

/** module X { export * from "x.js"; } **/
"exporting everything from an external module": {
    type: "Script",
    statements: [
    {   type: "ModuleDeclaration",
        identifier: {
            type: "Identifier",
            value: "X"
        },
        body: {
            type: "ModuleBody",
            statements: [
            {   type: "ExportDeclaration",
                binding: {
                    type: "ExportSpecifierSet",
                    specifiers: null,
                    from: {
                        type: "String",
                        value: "x.js"
                    }
                }
            }]
        }
    }]
},

/** module X { export *; } **/
"exporting everything must include a specifier": { }

})