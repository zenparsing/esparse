import { parse } from "../main.js";

var inspect = require("util").inspect;

export function main(args) {

    var type = args[2],
        input = args[3],
        ast;
    
    if (!input) {
    
        input = type;
        type = "script";
    }
    
    switch (type) {
    
        case "module":
            ast = parse(input, { module: true });
            break;
        
        case "script":
            ast = parse(input, { module: false });
            break;
        
        default:
            console.log("ERROR! Invalid script type, expected 'script' or 'module'");
            return;
    }
    
    console.log("\nGenerated AST:\n");
    console.log(inspect(ast, { colors: true, depth: 10 }));
    console.log("");
}
