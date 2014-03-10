import { inspect } from "node:util";
import { parseModule, parseScript } from "../main.js";

export function main(args) {

    var type = args[2],
        input = args[3],
        ast;
    
    switch (type) {
    
        case "module":
            ast = parseModule(input);
            break;
        
        case "script":
            ast = parseScript(input);
            break;
        
        default:
            console.log("ERROR! Invalid script type, expected 'script' or 'module'");
            return;
    }
    
    console.log(inspect(ast, { colors: true, depth: 10 }));
}
