[

/** [for x of y x]; **/
{   type: "Script",
    statements: [
    
    {   type: "ExpressionStatement",
        expression:
        
        {   type: "ArrayComprehension",
        
            qualifiers: [
            
            {   type: "ComprehensionFor",
                
                left: 
                {   type: "Identifier",
                    value: "x"
                },
                
                right:
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