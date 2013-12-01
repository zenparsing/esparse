{

/** label: x; label: x; **/
"duplicate labels":
{   type: "Script",
    statements: [
    
    {   type: "LabelledStatement",
        label:
        {   type: "Identifier",
            value: "label"
        },
        statement:
        {   type: "ExpressionStatement",
            expression:
            {   type: "Identifier",
                value: "x"
            }
        }
    },
    
    {   type: "LabelledStatement",
        label:
        {   type: "Identifier",
            value: "label"
        },
        statement:
        {   type: "ExpressionStatement",
            expression:
            {   type: "Identifier",
                value: "x"
            }
        }
    }]
},

/** label: { label: x; } **/
"duplicate nested labels are not allowed": {}

};