[

/** `abcdefg`; **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "QuasiExpression",
            
            literals: [
            {   type: "Quasi",
                quasiEnd: true,
                value: "abcdefg"
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
        
        {   type: "QuasiExpression",
        
            literals: [
                
            {   type: "Quasi",
                quasiEnd: true,
                value: "abc$efg"
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
        
        {   type: "QuasiExpression",
        
            literals: [
                
            {   type: "Quasi",
                quasiEnd: false,
                value: "abc"
            },
            
            {   type: "Quasi",
                quasiEnd: true,
                value: "efg"
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
        
        {   type: "QuasiExpression",
        
            literals: [
                
            {   type: "Quasi",
                quasiEnd: false,
                value: "abc"
            },
            
            {   type: "Quasi",
                quasiEnd: true,
                value: "efg"
            }],
                
            substitutions: [
            
            {   type: "QuasiExpression",
            
                literals: [
                        
                {   type: "Quasi",
                    quasiEnd: true,
                    value: "d"
                }],
                
                substitutions: []
            }]
        }
    }]
},

];