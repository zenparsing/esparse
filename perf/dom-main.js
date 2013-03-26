import "../src/es6parse.js" as Parser;
import "parsers/esprima.js" as Esprima;
import "parsers/acorn.js" as Acorn;

import "lib/domino.js" as DOM;
import Promise from DOM;

var inputFiles = [

    "codearea.js"
];

var parsers = [

    { name: "es6parse", parser: Parser },
    { name: "acorn", parser: Acorn },
    { name: "esprima", parser: Esprima }
];

exports.run = function(opt) {

    opt || (opt = {});
    
    var repeat = opt.repeat || 1,
        isolate = opt.isolate || false;
    
    DOM.loaded().then(ok => Promise.forEach(inputFiles, name => {
        
        return DOM.http("input/" + name).then(response => {
        
            var input = response.responseText,
                ms;
        
            console.log("[" + name + "]");
            
            ms = churn(val => Parser.parseScript(input));
            console.log("  " + "es6parse" + ": " + ms + "ms");
            
            /*
            if (!isolate) {
                
                ms = churn(function() { Esprima.parse(input) });
                console.log("  esprima: " + ms + "ms");
                
                ms = churn(function() { Acorn.parse(input) });
                console.log("  acorn: " + ms + "ms");
            }
            */
        });
    }));
    
    function churn(fn) {
    
        var ts = +new Date, i;
        for (i = repeat; i--;) fn();
        return +new Date - ts;
    }
    
};