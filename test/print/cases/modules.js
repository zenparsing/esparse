({

/*** export { x }; ***/
'exports names': 'export { x };',

/*** export x from 'foo'; ***/
'exports default from': `export x from 'foo';`,

/*** export default x; ***/
'exports default expression': `export default x;`,

/*** export * as m from 'foo'; ***/
'export namespace as': `export * as m from 'foo';`,

/*** export * from 'foo'; ***/
'export namespace': `export * from 'foo';`,

/*** var x; export function f() {} var y; ***/
'export function spacing':
`var x;

export function f() {}

var y;`,

/*** var x; export class C {} var y; ***/
'export class spacing':
`var x;

export class C {}

var y;`,

/*** var x; export default class C {} var y; ***/
'export default spacing':
`var x;

export default class C {}

var y;`,

})
