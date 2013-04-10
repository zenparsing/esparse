import "../src/es6parse.js" as Parser;
import "parsers/esprima.js" as Esprima;
import "parsers/acorn.js" as Acorn;

import "lib/domino.js" as DOM;
import Promise from DOM;

var inputFiles = [

    "jquery-1.9.1.js"
];

exports.run = function() {
    
    DOM.loaded().then(ok => Promise.forEach(inputFiles, name => {
        
        return DOM.http("input/" + name).then(response => {
        
            var input = response.responseText;
        
            console.log("[" + name + "]");
            console.log("  es6parse: " + churn(val => Parser.parseScript(input)) + "ms");
        });
    }));
    
    function churn(fn) {
    
        var ts = +new Date;
        fn();
        return +new Date - ts;
    }  
};