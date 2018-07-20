({

/** @A class C {} **/
'class declaration':
[ {
  type: 'Annotation',
  start: 0,
  end: 2,
  path:
   [ {
       type: 'Identifier',
       start: 1,
       end: 2,
       value: 'A',
       context: '' } ],
  arguments: null } ],

/** @A.B class C {} **/
'with path':
[ {
  type: 'Annotation',
  start: 0,
  end: 4,
  path:
   [ {
       type: 'Identifier',
       start: 1,
       end: 2,
       value: 'A',
       context: '' },
     { type: 'Identifier', start: 3, end: 4, value: 'B', context: '' } ],
  arguments: null } ],

/** @A(x) class C {} **/
'with arguments':
[ {
  type: 'Annotation',
  start: 0,
  end: 5,
  path:
   [ {
       type: 'Identifier',
       start: 1,
       end: 2,
       value: 'A',
       context: '' } ],
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
  start: 0,
  end: 2,
  path:
   [ {
       type: 'Identifier',
       start: 1,
       end: 2,
       value: 'A',
       context: '' } ],
  arguments: null },
{
  type: 'Annotation',
  start: 3,
  end: 5,
  path:
   [ {
       type: 'Identifier',
       start: 4,
       end: 5,
       value: 'B',
       context: '' } ],
  arguments: null } ],

/** @private x **/
'reserved words are allowed': [ {
  type: 'Annotation',
  start: 0,
  end: 8,
  path:
   [ {
       type: 'Identifier',
       start: 1,
       end: 8,
       value: 'private',
       context: '' } ],
  arguments: null } ],

/** @x 'abc'
    @y 'def' **/
'ASI works with annotations': [ {
  type: 'Annotation',
  start: 0,
  end: 2,
  path:
   [ { type: 'Identifier', start: 1, end: 2, value: 'x', context: '' } ],
  arguments: null }, {
  type: 'Annotation',
  start: 13,
  end: 15,
  path:
   [ { type: 'Identifier', start: 14, end: 15, value: 'y', context: '' } ],
  arguments: null } ],

})
