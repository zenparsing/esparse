({

/** function f(...args) {} **/
'single rest parameter':
{ type: 'Script',
  start: 0,
  end: 22,
  statements:
   [ { type: 'FunctionDeclaration',
       start: 0,
       end: 22,
       kind: '',
       identifier:
        { type: 'Identifier',
          start: 9,
          end: 10,
          value: 'f',
          context: 'declaration' },
       params:
        [ { type: 'RestParameter',
            start: 11,
            end: 18,
            identifier:
             { type: 'Identifier',
               start: 14,
               end: 18,
               value: 'args',
               context: 'declaration' } } ],
       body: { type: 'FunctionBody', start: 20, end: 22, statements: [] } } ] },

/** function f(a, b, ...[c]) {} **/
'rest parameter cannot be a pattern':
{
  type: 'Script',
  start: 0,
  end: 27,
  statements:
   [ {
       type: 'FunctionDeclaration',
       start: 0,
       end: 27,
       kind: '',
       identifier:
        {
          type: 'Identifier',
          start: 9,
          end: 10,
          value: 'f',
          context: 'declaration' },
       params:
        [ {
            type: 'FormalParameter',
            start: 11,
            end: 12,
            pattern:
             {
               type: 'Identifier',
               start: 11,
               end: 12,
               value: 'a',
               context: 'declaration' },
            initializer: null },
          {
            type: 'FormalParameter',
            start: 14,
            end: 15,
            pattern:
             {
               type: 'Identifier',
               start: 14,
               end: 15,
               value: 'b',
               context: 'declaration' },
            initializer: null },
          {
            type: 'RestParameter',
            start: 17,
            end: 23,
            identifier:
             {
               type: 'ArrayPattern',
               start: 20,
               end: 23,
               elements:
                [ {
                    type: 'PatternElement',
                    start: 21,
                    end: 22,
                    pattern:
                     {
                       type: 'Identifier',
                       start: 21,
                       end: 22,
                       value: 'c',
                       context: 'declaration' },
                    initializer: null } ],
               trailingComma: false } } ],
       body:
        { type: 'FunctionBody', start: 25, end: 27, statements: [] } } ] },

/** function f(a, ...b, c) {} **/
'rest parameter can only occur as the last formal parameter':
{},

})
