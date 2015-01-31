/*

NOTE: We forego using classes and class-based inheritance because at this time
super() tends to be slow in transpiled code.  Instead, we use regular constructor
functions and give them a common prototype property.

*/

import * as Nodes from "./Nodes.js";
export * from "./Nodes.js";

function isNode(x) {

    return x !== null && typeof x === "object" && typeof x.type === "string";
}

class NodeBase {

    children() {

        var list = [];

        Object.keys(this).forEach(k => {

            // Don't iterate over backlinks to parent node
            if (k === "parent")
                return;

            var value = this[k];

            if (Array.isArray(value))
                value.forEach(x => { if (isNode(x)) list.push(x) });
            else if (isNode(value))
                list.push(value);
        });

        return list;
    }
}

Object.keys(Nodes).forEach(k => Nodes[k].prototype = NodeBase.prototype);
