import { parse } from "../../src/";
import { runTests, objectLike } from "../runner.js";

var inspect = require("util").inspect;

var SKIP_KEYS = {

    "start": 1,
    "end": 1,
    "message": 1,
    "context": 1,
    "error": 1
}

// Returns true if the specified AST is "like" another AST
function astLike(a, b) {

    return objectLike(a, b, SKIP_KEYS);
}

// Displays an object tree
function displayTree(tree) {

    return inspect(tree, false, 20, true);
}

runTests({

    dir:  __dirname,
    render: displayTree,
    process: parse,
    compare: astLike

});
