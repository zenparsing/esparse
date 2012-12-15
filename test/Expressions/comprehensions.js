[

/** [x for x of y]; **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "ArrayComprehension",
        
            expression:
            {   type: "Identifier",
                value: "x"
            },
            
            list: [
            
            {   type: "ComprehensionFor",
                
                binding: 
                {   type: "Identifier",
                    value: "x"
                },
                
                of:
                {   type: "Identifier",
                    value: "y"
                }
            }],
            
            test: null
        }
    }]
}

];