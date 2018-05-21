({

/** class C { foo; } **/
'Empty class field':
{
  type: 'Script',
  start: 0,
  end: 16,
  statements:
   [ {
       type: 'ClassDeclaration',
       start: 0,
       end: 16,
       identifier:
        {
          type: 'Identifier',
          start: 6,
          end: 7,
          value: 'C',
          context: 'declaration' },
       base: null,
       body:
        {
          type: 'ClassBody',
          start: 8,
          end: 16,
          elements:
           [ {
               type: 'ClassField',
               static: false,
               name:
                {
                  type: 'Identifier',
                  start: 10,
                  end: 13,
                  value: 'foo',
                  context: '' },
               initializer: null,
               start: 10,
               end: 14 } ] } } ] }

})
