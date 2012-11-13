[

/** import x from "x.js"; **/
{   type: "Script",
    statements: [
    
    {   type: "ImportDeclaration",
    
        binding:
        {   type: "Identifier",
            value: "x"
        },
        
        from:
        {   type: "String",
            value: "x.js"
        }
    }]
},

/** import x from A.B; **/
{   type: "Script",
    statements: [
    
    {   type: "ImportDeclaration",
    
        binding:
        {   type: "Identifier",
            value: "x"
        },
        
        from:
        {   type: "Path",
            elements: [
            {   type: "Identifier",
                value: "A"
            },
            {   type: "Identifier",
                value: "B"
            }]
        }
    }]
},

/** import x = "x.js"; **/
{   type: "Script",
    statements: [
    
    {   type: "ModuleImport",
    
        id:
        {   type: "Identifier",
            value: "x"
        },
        
        from:
        {   type: "String",
            value: "x.js"
        }
    }]
},

];