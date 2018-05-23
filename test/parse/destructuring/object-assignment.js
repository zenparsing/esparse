({

/** ({ x: x } = a); **/
'basic destructuring':
{ type: 'Script',
  start: 0,
  end: 15,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 15,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 14,
          expression:
           { type: 'AssignmentExpression',
             start: 1,
             end: 13,
             operator: '=',
             left:
              { type: 'ObjectPattern',
                start: 1,
                end: 9,
                properties:
                 [ { type: 'PatternProperty',
                     start: 3,
                     end: 7,
                     name: { type: 'Identifier', start: 3, end: 4, value: 'x', context: '' },
                     pattern:
                      { type: 'Identifier',
                        start: 6,
                        end: 7,
                        value: 'x',
                        context: 'variable' },
                     initializer: null } ],
                trailingComma: false },
             right:
              { type: 'Identifier',
                start: 12,
                end: 13,
                value: 'a',
                context: 'variable' } } } } ] },

/** ({ x } = a); **/
'key shorthands':
{ type: 'Script',
  start: 0,
  end: 12,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 12,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 11,
          expression:
           { type: 'AssignmentExpression',
             start: 1,
             end: 10,
             operator: '=',
             left:
              { type: 'ObjectPattern',
                start: 1,
                end: 6,
                properties:
                 [ { type: 'PatternProperty',
                     start: 3,
                     end: 4,
                     name:
                      { type: 'Identifier',
                        start: 3,
                        end: 4,
                        value: 'x',
                        context: 'variable' },
                     pattern: null,
                     initializer: null } ],
                trailingComma: false },
             right:
              { type: 'Identifier',
                start: 9,
                end: 10,
                value: 'a',
                context: 'variable' } } } } ] },

/** ({ x = 123 } = a); **/
'defaults are allowed':
{ type: 'Script',
  start: 0,
  end: 18,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 18,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 17,
          expression:
           { type: 'AssignmentExpression',
             start: 1,
             end: 16,
             operator: '=',
             left:
              { type: 'ObjectPattern',
                start: 1,
                end: 12,
                properties:
                 [ { type: 'PatternProperty',
                     start: 3,
                     end: 10,
                     name:
                      { type: 'Identifier',
                        start: 3,
                        end: 4,
                        value: 'x',
                        context: 'variable' },
                     pattern: null,
                     initializer: { type: 'NumberLiteral', start: 7, end: 10, value: 123 },
                     error: '' } ],
                trailingComma: false },
             right:
              { type: 'Identifier',
                start: 15,
                end: 16,
                value: 'a',
                context: 'variable' } } } } ] },

/** ({ x: x }) = a; **/
'parens are not allowed around pattern': {},

/** ({ x = 123 }); **/
'invalid object literals throw': {},

/** ({ if } = a); **/
'keywords cannot be used as simple names': {},

/** "use strict"; ({ args: arguments } = a); **/
'assignment to arguments throws in strict mode': {},

/** "use strict"; ({ arguments } = a); **/
'shorthand assignment to arguments throws in strict mode': {},

/** "use strict"; ({ x: a, x: b } = q); **/
'duplicate names do not throw':
{ type: 'Script',
  start: 0,
  end: 35,
  statements:
   [ { type: 'Directive',
       start: 0,
       end: 13,
       value: 'use strict',
       expression: { type: 'StringLiteral', start: 0, end: 12, value: 'use strict' } },
     { type: 'ExpressionStatement',
       start: 14,
       end: 35,
       expression:
        { type: 'ParenExpression',
          start: 14,
          end: 34,
          expression:
           { type: 'AssignmentExpression',
             start: 15,
             end: 33,
             operator: '=',
             left:
              { type: 'ObjectPattern',
                start: 15,
                end: 29,
                properties:
                 [ { type: 'PatternProperty',
                     start: 17,
                     end: 21,
                     name: { type: 'Identifier', start: 17, end: 18, value: 'x', context: '' },
                     pattern:
                      { type: 'Identifier',
                        start: 20,
                        end: 21,
                        value: 'a',
                        context: 'variable' },
                     initializer: null },
                   { type: 'PatternProperty',
                     start: 23,
                     end: 27,
                     name: { type: 'Identifier', start: 23, end: 24, value: 'x', context: '' },
                     pattern:
                      { type: 'Identifier',
                        start: 26,
                        end: 27,
                        value: 'b',
                        context: 'variable' },
                     initializer: null } ],
                trailingComma: false },
             right:
              { type: 'Identifier',
                start: 32,
                end: 33,
                value: 'q',
                context: 'variable' } } } } ] },

/** ({ x: y.z } = a) **/
'assignment target can be a member expression':
{ type: 'Script',
  start: 0,
  end: 16,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 16,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 16,
          expression:
           { type: 'AssignmentExpression',
             start: 1,
             end: 15,
             operator: '=',
             left:
              { type: 'ObjectPattern',
                start: 1,
                end: 11,
                properties:
                 [ { type: 'PatternProperty',
                     start: 3,
                     end: 9,
                     name: { type: 'Identifier', start: 3, end: 4, value: 'x', context: '' },
                     pattern:
                      { type: 'MemberExpression',
                        start: 6,
                        end: 9,
                        object:
                         { type: 'Identifier',
                           start: 6,
                           end: 7,
                           value: 'y',
                           context: 'variable' },
                        property: { type: 'Identifier', start: 8, end: 9, value: 'z', context: '' },
                        computed: false },
                     initializer: null } ],
                trailingComma: false },
             right:
              { type: 'Identifier',
                start: 14,
                end: 15,
                value: 'a',
                context: 'variable' } } } } ] },

/** ({ x: (y) } = a); **/
'simple targets are unwrapped':
{
  type: 'Script',
  start: 0,
  end: 17,
  statements:
   [ {
       type: 'ExpressionStatement',
       start: 0,
       end: 17,
       expression:
        {
          type: 'ParenExpression',
          start: 0,
          end: 16,
          expression:
           {
             type: 'AssignmentExpression',
             start: 1,
             end: 15,
             operator: '=',
             left:
              {
                type: 'ObjectPattern',
                start: 1,
                end: 11,
                properties:
                 [ {
                     type: 'PatternProperty',
                     start: 3,
                     end: 9,
                     name: { type: 'Identifier', start: 3, end: 4, value: 'x', context: '' },
                     pattern:
                      {
                        type: 'ParenExpression',
                        start: 6,
                        end: 9,
                        expression:
                         {
                           type: 'Identifier',
                           start: 7,
                           end: 8,
                           value: 'y',
                           context: 'variable' } },
                     initializer: null } ],
                trailingComma: false },
             right:
              {
                type: 'Identifier',
                start: 14,
                end: 15,
                value: 'a',
                context: 'variable' } } } } ] },

/** ({ x: f() } = a); **/
'call expressions are invalid assignment targets': {},

/** ({ x: new f } = a); **/
'new expressions are invalid assignment targets': {},

})
