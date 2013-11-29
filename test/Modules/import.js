({

/** import { x } from "x.js"; **/
"import from a url": {
    type: "Script",
    statements: [
    {   type: "ImportDeclaration",
        specifiers: [
        {   type: "ImportSpecifier",
            remote: {
                type: "Identifier",
                value: "x"
            },
            local: null
        }],
        from: {
            type: "String",
            value: "x.js"
        }
    }]
},

/** import { x } from y; **/
"import from a lexical module": {
    type: "Script",
    statements: [
    {   type: "ImportDeclaration",
        specifiers: [
        {   type: "ImportSpecifier",
            remote: {
                type: "Identifier",
                value: "x"
            },
            local: null
        }],
        from: {
            type: "ModulePath",
            elements: [ 
            {   type: "Identifier",
                value: "y"
            }]
        }
    }]
},

/** import { x as y } from "x.js"; **/
"renaming imported bindings": {
    type: "Script",
    statements: [
    {   type: "ImportDeclaration",
        specifiers: [
        {   type: "ImportSpecifier",
            remote: {
                type: "Identifier",
                value: "x"
            },
            local: {
                type: "Identifier",
                value: "y"
            }
        }],
        from: {
            type: "String",
            value: "x.js"
        }
    }]
},

/** import {} from "x.js"; **/
"empty import specifier set": {
    type: "Script",
    statements: [
    {   type: "ImportDeclaration",
        specifiers: [],
        from: {
            type: "String",
            value: "x.js"
        }
    }]
},

/** import { default as y } from "x.js"; **/
"import a keyword-named binding": {
    type: "Script",
    statements: [
    {   type: "ImportDeclaration",
        specifiers: [
        {   type: "ImportSpecifier",
            remote: {
                type: "Identifier",
                value: "default"
            },
            local: {
                type: "Identifier",
                value: "y"
            }
        }],
        from: {
            type: "String",
            value: "x.js"
        }
    }]
},

/** import { default } from "x.js"; **/
"importing of non-identifier bindings is not allowed": {}

})