({

/** export var x; **/
"export not allowed outside of module": {},

/** module X { export var x; } **/
"export a var": {
    type: "Script",
    statements: [
    {   type: "ModuleDeclaration",
        ident: {
            type: "Identifier",
            value: "X"
        },
        body: {
            type: "ModuleBody",
            statements: [
            {   type: "ExportDeclaration",
                binding: {
                    type: "VariableDeclaration",
                    keyword: "var",
                    declarations: [
                    {   type: "VariableDeclarator",
                        pattern: {
                            type: "Identifier",
                            value: "x"
                        },
                        init: null
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
        ident: {
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
        ident: {
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
        ident: {
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
}

})