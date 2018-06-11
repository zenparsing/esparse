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
               end: 14 } ] } } ] },

/** class C { foo
  bar
  static baz
} **/
'Empty class fields support ASI':
{
  type: 'Script',
  start: 0,
  end: 34,
  statements:
   [ {
       type: 'ClassDeclaration',
       start: 0,
       end: 34,
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
          end: 34,
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
               end: 13 },
             {
               type: 'ClassField',
               static: false,
               name:
                {
                  type: 'Identifier',
                  start: 16,
                  end: 19,
                  value: 'bar',
                  context: '' },
               initializer: null,
               start: 16,
               end: 19 },
             {
               type: 'ClassField',
               static: true,
               name:
                {
                  type: 'Identifier',
                  start: 29,
                  end: 32,
                  value: 'baz',
                  context: '' },
               initializer: null,
               start: 22,
               end: 32 } ] } } ] },

/** class C { static constructor } **/
'Static constructor field not allowed': {},

/** class C { static prototype } **/
'Static prototype field not allowed': {},

/** class C { constructor } **/
'Instance constructor field not allowed': {},

})
