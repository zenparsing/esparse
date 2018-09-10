({

/** ({ x: 1, y }) **/
'object literals':
`({
  x: 1,
  y
});`,

/** ({ x() { return 1; } }) **/
'object methods':
`({
  x() {
    return 1;
  }
});`,

/** ({ get x() {} }) **/
'getters':
`({
  get x() {}
});`,

/** ({}) **/
'empty objects': '({});',

/** ({ *g() {} }) **/
'generator methods':
`({
  *g() {}
});`,

/** ({ x, y, z }) **/
'concise objects': `({ x, y, z });`,

})
