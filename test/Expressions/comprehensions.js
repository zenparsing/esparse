[

/** [for x of y x]; **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "ArrayComprehension",
        
            qualifiers: [
            
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
        
            expression:
            {   type: "Identifier",
                value: "x"
            }
        }
    }]
}

];