({

/** x = y; **/
'Basic assignment': {
    type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:

        {   type: "AssignmentExpression",
            operator: "=",

            left:
            {   type: "Identifier",
                value: "x"
            },

            right:
            {   type: "Identifier",
                value: "y"
            }
        }
    }]
},

/** ((x)) = y; **/
'LHS parens are unwrapped':
{
    type: 'Script',
    start: 0,
    end: 10,
    statements:
     [ {
         type: 'ExpressionStatement',
         start: 0,
         end: 10,
         expression:
          {
            type: 'AssignmentExpression',
            start: 0,
            end: 9,
            operator: '=',
            left:
             {
               type: 'ParenExpression',
               start: 0,
               end: 5,
               expression:
                {
                  type: 'ParenExpression',
                  start: 1,
                  end: 4,
                  expression:
                   {
                     type: 'Identifier',
                     start: 2,
                     end: 3,
                     value: 'x',
                     context: 'variable' } } },
            right:
             {
               type: 'Identifier',
               start: 8,
               end: 9,
               value: 'y',
               context: 'variable' } } } ] },

})
