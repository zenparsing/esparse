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

/** class C { m() { new super; } } **/
"new super without argument list": 
{   type: "Script",
    statements: [
    {   type: "ClassDeclaration",
        identifier: 
        {   type: "Identifier",
            value: "C" },
        base: null,
        body: 
        {   type: "ClassBody",
            elements: [
            {   type: "ClassElement",
                static: false,
                method: 
                {
                    type: "MethodDefinition",
                    kind: "",
                    name: 
                    {   type: "Identifier",
                        value: "m" 
                    },
                    params: [],
                    body: 
                    {   type: "FunctionBody",
                        statements: [
                        {   type: "ExpressionStatement",
                            expression: 
                            {   type: "NewExpression",
                                callee:
                                {   type: "SuperExpression" 
                                },
                                arguments: null
                            }
                        }]
                    }
                }
            }]
        }
    }]
},

/** class C extends A + B {} **/
"extends clause does not allow assignment expression": {},

/** (class C extends A + B {}) **/
"extends clause does not allow assignment expression in class expression": {},

/** super() **/
'super cannot appear outside of a function': {},

})