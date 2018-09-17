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
`for (let { x, y } of z) ;`,

/** if (x) {} else {} **/
'if-else':
`if (x) {} else {}`,

/** if (x) 1; else 2; **/
'if-else-short':
`if (x) 1;
else 2;`,

/** switch (x) { case 1: case 2: case 3: a; } **/
'switch-case-empty-case':
`switch (x) {
  case 1:
  case 2:
  case 3:
    a;
}`,

/** 'use strict'; 1; **/
'use strict directive':
`'use strict';

1;`,

/** async function f() { for await (let x of y); } **/
'for-await':
`async function f() {
  for await (let x of y) ;
}`,

})
