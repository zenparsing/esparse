[

/** import x from "x.js"; **/
{   type: "Script",
    statements: [
    
    {   type: "ImportDeclaration",
    
        bindings: [
        
        {   type: "ImportClause",
            
            binding: 
            {   type: "Identifier",
                value: "x"
            },
            
            from:
            {   type: "String",
                value: "x.js"
            }
        }]
    }]
},

/** import { x } from "x.js"; **/
{   type: "Script",
    statements: [
    
    {   type: "ImportDeclaration",
    
        bindings: [
        
        {   type: "ImportClause",
            
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
    }]
},


];