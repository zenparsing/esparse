{

/** "use strict"; ({ package: 0 }); **/
"strict mode keywords are allowed as property names": {
    type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression:
        {   type: "String",
            value: "use strict"
        }
    },
    {   type: "ExpressionStatement",
        expression:
        {   type: "ParenExpression",
            expression:
            {   type: "ObjectLiteral",
                properties: [
                {   type: "PropertyDefinition",
                    name: 
                    {   type: "Identifier",
                        value: "package"
                    },
                    expression:
                    {   type: "Number",
                        value: 0
                    }
                }]
            }
        }
    }]
},

};