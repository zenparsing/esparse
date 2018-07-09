({

/** @A class C {} **/
'class declaration':
[ {
  type: 'Annotation',
  start: 1,
  end: 2,
  path:
   [ {
       type: 'Identifier',
       start: 1,
       end: 2,
       value: 'A',
       context: 'variable' } ],
  arguments: null } ],

/** (@A class {}) **/
'class expression':
[ {
  type: 'Annotation',
  start: 2,
  end: 3,
  path:
   [ {
       type: 'Identifier',
       start: 2,
       end: 3,
       value: 'A',
       context: 'variable' } ],
  arguments: null } ],

/** @A.B class C {} **/
'with path':
[ {
  type: 'Annotation',
  start: 1,
  end: 4,
  path:
   [ {
       type: 'Identifier',
       start: 1,
       end: 2,
       value: 'A',
       context: 'variable' },
     { type: 'Identifier', start: 3, end: 4, value: 'B', context: '' } ],
  arguments: null } ],

/** @A(x) class C {} **/
'with arguments':
[ {
  type: 'Annotation',
  start: 1,
  end: 5,
  path:
   [ {
       type: 'Identifier',
       start: 1,
       end: 2,
       value: 'A',
       context: 'variable' } ],
  arguments:
   [ {
       type: 'Identifier',
       start: 3,
       end: 4,
       value: 'x',
       context: 'variable' } ] } ],

/** @A @B class C {} **/
'multiple annotations':
[ {
  type: 'Annotation',
  start: 1,
  end: 2,
  path:
   [ {
       type: 'Identifier',
       start: 1,
       end: 2,
       value: 'A',
       context: 'variable' } ],
  arguments: null },
{
  type: 'Annotation',
  start: 4,
  end: 5,
  path:
   [ {
       type: 'Identifier',
       start: 4,
       end: 5,
       value: 'B',
       context: 'variable' } ],
  arguments: null } ],

})
