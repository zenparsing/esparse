({

/** if (x) { y; } else { z; } **/
'if-then-else':
`if (x) {
  y;
} else {
  z;
}`,

/** switch (x) { case 1: a; break; case 2: b; break; default: break; } **/
'switch-cases':
`switch (x) {
  case 1:
    a;
    break;
  case 2:
    b;
    break;
  default:
    break;

}`,

/** try { x; } catch (e) { y; } **/
'try-catch':
`try {
  x;
} catch (e) {
  y;
}`,

/** try { x; } catch (e) { y; } finally { z; } **/
'try-catch-finally':
`try {
  x;
} catch (e) {
  y;
} finally {
  z;
}`,

/** try { x; } finally { z; } **/
'try-finally':
`try {
  x;
} finally {
  z;
}`,

/** for (let { x, y } of z); **/
'for-of':
`for (let {
  x,
  y
} of z) ;`,

})
