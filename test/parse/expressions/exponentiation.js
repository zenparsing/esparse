({

/** x ** y **/
"Exponentiation operator": {
    type: 'Script',
    start: 0,
    end: 6,
    statements: [{
        type: 'ExpressionStatement',
        start: 0,
        end: 6,
        expression: {
            type: 'BinaryExpression',
            start: 0,
            end: 6,
            operator: '**',
            left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                value: 'x',
                context: 'variable' },
            right: {
                type: 'Identifier',
                start: 5,
                end: 6,
                value: 'y',
                context: 'variable' } } } ] },

/** -x ** y **/
"Unary expression are not allowed on LHS": {},

/** x ** -y **/
"Unary expression is allowed on RHS": {
    type: 'Script',
    start: 0,
    end: 7,
    statements: [{
        type: 'ExpressionStatement',
        start: 0,
        end: 7,
        expression: {
            type: 'BinaryExpression',
            start: 0,
            end: 7,
            operator: '**',
            left: {
                type: 'Identifier',
                start: 0,
                end: 1,
                value: 'x',
                context: 'variable' },
            right: {
                type: 'UnaryExpression',
                start: 5,
                end: 7,
                operator: '-',
                expression: {
                    type: 'Identifier',
                    start: 6,
                    end: 7,
                    value: 'y',
                    context: 'variable' } } } } ] },

})
