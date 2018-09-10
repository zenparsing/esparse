({

/** function f(a, b = 1) { a++ } **/
'function with default arguments':
`function f(a, b = 1) {
  a++;
}`,

/** function f(...[a]) {} **/
'function with pattern rest element':
`function f(...[a]) {}`,

/** function* g() { yield 1; yield * []; } **/
'generator functions':
`function* g() {
  yield 1;
  yield * [];
}`,

/** function f({ x, y }) {} **/
'destructuring params':
`function f({ x, y }) {}`,

/** var x; function f() {}  **/
'newline before function':
`var x;

function f() {}`,

})
