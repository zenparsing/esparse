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

/** import { x } from "x.js"; **/
{   type: "Script",
    statements: [
    
    {   type: "ImportDeclaration",
            
        binding: 
        
        {   type: "ImportSpecifierSet",
        
            specifiers: [
            
            {   type: "ImportSpecifier",
                name: 
                {   type: "Identifier",
                    value: "x"
                },
                ident: null
            }]
        },
        
        from:
        {   type: "String",
            value: "x.js"
        }
    }]
},


];