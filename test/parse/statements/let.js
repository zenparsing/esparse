({

/** let(); **/
"let is an identifier in non-strict code": {
    type: "Script",
    statements: [

    {   type: "ExpressionStatement",

        expression:
        {   type: "CallExpression",
            callee:
            {   type: "Identifier",
                value: "let"
            },
            arguments: [],
            trailingComma: false,
        }
    }]
},

/** "use strict"; let(); **/
"let is an invalid identifier in strict mode": {},

/** let x; **/
"basic let declaration": {
    type: "Script",
    statements: [

    {   type: "VariableDeclaration",
        kind: "let",
        declarations: [
        {   type: "VariableDeclarator",
            pattern:
            {   type: "Identifier",
                value: "x"
            },
            initializer: null
        }]
    }]
}

})
