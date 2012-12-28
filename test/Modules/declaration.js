[

/** module x = "x.js"; **/
{   type: "Script",
    statements: [
    
    {   type: "ModuleAlias",
    
        ident: 
        {   type: "Identifier",
            value: "x"
        },
        
        specifier:
        {   type: "String",
            value: "x.js"
        }
    }]
},

/** module x = a.b.c; **/
{   type: "Script",
    statements: [
    
    {   type: "ModuleAlias",
    
        ident: 
        {   type: "Identifier",
            value: "x"
        },
        
        specifier:
        {   type: "BindingPath",
            elements: [ "a", "b", "c" ]
        }
    }]
},

/** module x {} **/
{   type: "Script",
    statements: [
    
    {   type: "ModuleDeclaration",
    
        ident: 
        {   type: "Identifier",
            value: "x"
        },
        
        body:
        {   type: "ModuleBody",
            statements: []
        }
    }]
},

/** module "x.js" {} **/
{   type: "Script",
    statements: [
    
    {   type: "ModuleRegistration",
    
        url: 
        {   type: "String",
            value: "x.js"
        },
        
        body:
        {   type: "ModuleBody",
            statements: []
        }
    }]
},

];