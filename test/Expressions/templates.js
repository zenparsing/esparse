[

/** `abcdefg`; **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "TemplateExpression",
            
            literals: [
            {   type: "Template",
                value: "abcdefg",
                templateEnd: true,
            }],
            
            substitutions: []
        }
    }]
},

/** `abc$efg`; **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression: 
        
        {   type: "TemplateExpression",
        
            literals: [
                
            {   type: "Template",
                value: "abc$efg",
                templateEnd: true
            }],
                
            substitutions: []
        }
    }]
},

/** `abc${ d }efg`; **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression: 
        
        {   type: "TemplateExpression",
        
            literals: [
                
            {   type: "Template",
                value: "abc",
                templateEnd: false
            },
            
            {   type: "Template",
                value: "efg",
                templateEnd: true
            }],
                
            substitutions: [
            
            {   type: "Identifier",
                value: "d"
            }]
        }
    }]
},

/** `abc${ `d` }efg`; **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression: 
        
        {   type: "TemplateExpression",
        
            literals: [
                
            {   type: "Template",
                value: "abc",
                templateEnd: false
            },
            
            {   type: "Template",
                value: "efg",
                templateEnd: true
            }],
                
            substitutions: [
            
            {   type: "TemplateExpression",
            
                literals: [
                        
                {   type: "Template",
                    value: "d",
                    templateEnd: true
                }],
                
                substitutions: []
            }]
        }
    }]
},

/** a.b`z`; **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression: 
        
        {   type: "TaggedTemplateExpression",
        
            tag: 
            {   type: "MemberExpression",
                object:
                {   type: "Identifier",
                    value: "a"
                },
                property:
                {   type: "Identifier",
                    value: "b"
                },
                computed: false
            },
            
            template:
            {   type: "TemplateExpression",
            
                literals: [
                {   type: "Template",
                    value: "z",
                    templateEnd: true
                }],
                
                substitutions: []
            }
        }
    }]
},

];