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

/** import x from y; **/
{   type: "Script",
    statements: [
    
    {   type: "ImportDeclaration",
    
        binding: 
        {   type: "Identifier",
            value: "x"
        },
        
        from:
        {   type: "Identifier",
            value: "y"
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

/** import { x: y } from "x.js"; **/
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
                ident: 
                {   type: "Identifier",
                    value: "y"
                }
            }]
        },
        
        from:
        {   type: "String",
            value: "x.js"
        }
    }]
},

/** import "x.js" as x; **/
{   type: "Script",
    statements: [
    
    {   type: "ImportAsDeclaration",
        
        from:
        {   type: "String",
            value: "x.js"
        },
        
        ident:
        {   type: "Identifier",
            value: "x"
        }
    }]
},

];