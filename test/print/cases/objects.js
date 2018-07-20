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
  get x() {

  }
});`,

})
