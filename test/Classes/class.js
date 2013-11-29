({

/** class C {} **/
"class declaration": {   
    type: "Script",
    statements: [
    {   type: "ClassDeclaration",
        identifier: {
            type: "Identifier",
            value: "C"
        },
        base: null,
        body: {
            type: "ClassBody",
            elements: []
        }
    }]
},

/** (class C {}); **/
"class expression": {
    type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression: {
            type: "ParenExpression",
            expression: {
                type: "ClassExpression",
                identifier: {
                    type: "Identifier",
                    value: "C"
                },
                base: null,
                body: {  
                    type: "ClassBody",
                    elements: []
                }
            }
        }
    }]
},

/** class C extends B {} **/
"class with extends": {
    type: "Script",
    statements: [
    {   type: "ClassDeclaration",
        identifier: {
            type: "Identifier",
            value: "C"
        },
        base: {
            type: "Identifier",
            value: "B"
        },
        body: {
            type: "ClassBody",
            elements: []
        }
    }]
},

/** class C { static S() {} } **/
"static method": {
    type: "Script",
    statements: [
    {   type: "ClassDeclaration",
        identifier: {
            type: "Identifier",
            value: "C"
        },
        base: null,
        body: {
            type: "ClassBody",
            elements: [
            
            {   type: "ClassElement",
                static: true,
                method: {
                    type: "MethodDefinition",
                    kind: "",
                    name: {
                        type: "Identifier",
                        value: "S"
                    },
                    params: [],
                    body: {
                        type: "FunctionBody",
                        statements: []
                    }
                }
            }]
        }
    }]
},

})