/*

NOTE: We forego using classes and class-based inheritance because at this time
super() tends to be slow in transpiled code.  Instead, we use regular constructor
functions and give them a common prototype property.

*/
import * as Nodes from './Nodes.js';
export * from './Nodes.js';

function isNode(x) {
  return x !== null && typeof x === 'object' && typeof x.type === 'string';
}

class AstNode {

  children() {
    let keys = Object.keys(this);
    let list = [];

    for (let i = 0; i < keys.length; ++i) {
      if (keys[i] === 'parent')
        continue;

      let value = this[keys[i]];

      if (Array.isArray(value)) {

        for (let j = 0; j < value.length; ++j) {
          if (isNode(value[j]))
            list.push(value[j]);
        }

      } else if (isNode(value)) {

        list.push(value);

      }
    }

    return list;
  }

}

Object.keys(Nodes).forEach(k => Nodes[k].prototype = AstNode.prototype);
