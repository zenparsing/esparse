({

/** ({ a: 1, ...b, c: 2, ...d }) **/
'spread properties': {
  type: 'Script',
  start: 0,
  end: 28,
  statements:
   [ {
       type: 'ExpressionStatement',
       start: 0,
       end: 28,
       expression:
        {
          type: 'ParenExpression',
          start: 0,
          end: 28,
          expression:
           {
             type: 'ObjectLiteral',
             start: 1,
             end: 27,
             properties:
              [ {
                  type: 'PropertyDefinition',
                  start: 3,
                  end: 7,
                  name: { type: 'Identifier', start: 3, end: 4, value: 'a', context: '' },
                  expression: { type: 'NumberLiteral', start: 6, end: 7, value: 1 } },
                {
                  type: 'SpreadExpression',
                  start: 9,
                  end: 13,
                  expression:
                   {
                     type: 'Identifier',
                     start: 12,
                     end: 13,
                     value: 'b',
                     context: 'variable' } },
                {
                  type: 'PropertyDefinition',
                  start: 15,
                  end: 19,
                  name: { type: 'Identifier', start: 15, end: 16, value: 'c', context: '' },
                  expression: { type: 'NumberLiteral', start: 18, end: 19, value: 2 } },
                {
                  type: 'SpreadExpression',
                  start: 21,
                  end: 25,
                  expression:
                   {
                     type: 'Identifier',
                     start: 24,
                     end: 25,
                     value: 'd',
                     context: 'variable' } } ],
             trailingComma: false } } } ] },

/** let { a, ...b } = x; **/
'rest binding patterns': {
  type: 'Script',
  start: 0,
  end: 20,
  statements:
   [ {
       type: 'VariableDeclaration',
       start: 0,
       end: 20,
       kind: 'let',
       declarations:
        [ {
            type: 'VariableDeclarator',
            start: 4,
            end: 19,
            pattern:
             {
               type: 'ObjectPattern',
               start: 4,
               end: 15,
               properties:
                [ {
                    type: 'PatternProperty',
                    start: 6,
                    end: 7,
                    name:
                     {
                       type: 'Identifier',
                       start: 6,
                       end: 7,
                       value: 'a',
                       context: 'declaration' },
                    pattern: null,
                    initializer: null },
                  {
                    type: 'PatternRestElement',
                    start: 9,
                    end: 13,
                    pattern:
                     {
                       type: 'Identifier',
                       start: 12,
                       end: 13,
                       value: 'b',
                       context: 'declaration' } } ],
               trailingComma: false },
            initializer:
             {
               type: 'Identifier',
               start: 18,
               end: 19,
               value: 'x',
               context: 'variable' } } ] } ] },

/** ({ a, ...b } = x); **/
'rest assignment patterns': {
  type: 'Script',
  start: 0,
  end: 18,
  statements:
   [  {
       type: 'ExpressionStatement',
       start: 0,
       end: 18,
       expression:
         {
          type: 'ParenExpression',
          start: 0,
          end: 17,
          expression:
            {
             type: 'AssignmentExpression',
             start: 1,
             end: 16,
             operator: '=',
             left:
               {
                type: 'ObjectPattern',
                start: 1,
                end: 12,
                properties:
                 [  {
                     type: 'PatternProperty',
                     start: 3,
                     end: 4,
                     name:
                       {
                        type: 'Identifier',
                        start: 3,
                        end: 4,
                        value: 'a',
                        context: 'variable' },
                     pattern: null,
                     initializer: null },
                    {
                     type: 'PatternRestElement',
                     start: 6,
                     end: 10,
                     pattern:
                       {
                        type: 'Identifier',
                        start: 9,
                        end: 10,
                        value: 'b',
                        context: 'variable' } } ],
                trailingComma: false },
             right:
               {
                type: 'Identifier',
                start: 15,
                end: 16,
                value: 'x',
                context: 'variable' } } } } ] },

                /** ({ ...this.x } = x); **/
                'rest assignment property may be member expression': {
                  type: 'Script',
                  start: 0,
                  end: 20,
                  statements:
                   [  {
                       type: 'ExpressionStatement',
                       start: 0,
                       end: 20,
                       expression:
                         {
                          type: 'ParenExpression',
                          start: 0,
                          end: 19,
                          expression:
                            {
                             type: 'AssignmentExpression',
                             start: 1,
                             end: 18,
                             operator: '=',
                             left:
                               {
                                type: 'ObjectPattern',
                                start: 1,
                                end: 14,
                                properties:
                                 [  {
                                     type: 'PatternRestElement',
                                     start: 3,
                                     end: 12,
                                     pattern:
                                       {
                                        type: 'MemberExpression',
                                        start: 6,
                                        end: 12,
                                        object:  { type: 'ThisExpression', start: 6, end: 10 },
                                        property:  { type: 'Identifier', start: 11, end: 12, value: 'x', context: '' },
                                        computed: false } } ],
                                trailingComma: false },
                             right:
                               {
                                type: 'Identifier',
                                start: 17,
                                end: 18,
                                value: 'x',
                                context: 'variable' } } } } ] },

/** let { ...y, } = {}; **/
'trailing comma not allowed after rest binding property': {},

/** let { ...y, a } = {}; **/
'rest binding property must be last pattern': {},

/** let { ...{ a } } = {}; **/
'rest binding property must not be an object pattern': {},

/** let { ...[a] } = {}; **/
'rest binding property must not be an array pattern': {},

/** ({ ...{ a } } = x); **/
'rest assignment property must not be an object pattern': {},

/** ({ ...[a] } = x); **/
'rest assignment property must not be an array pattern': {},

})
