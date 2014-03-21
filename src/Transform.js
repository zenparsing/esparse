import { AST } from "AST.js";

export class Transform {

    // Transform an expression into a formal parameter list
    transformFormals(expr, rest) {
    
        // TODO: We need to throw if an initizlier contains stuff that's not allowed,
        // like a yield expression or await expression.
        
        // TODO: Do we transform empty yield expressions into identifiers [(yield) => 0]
        
        if (expr === null)
            return rest ? [rest] : [];
            
        var params = [],
            param,
            list,
            node,
            i;
        
        switch (expr.type) {
        
            case "SequenceExpression":
                list = expr.expressions;
                break;
            
            case "CallExpression":
                list = expr.arguments;
                break;
            
            default:
                list = [expr];
                break;
        }
        
        if (!rest && list.length > 0 && list[list.length - 1].type === "SpreadExpression") {
        
            node = list.pop();
            rest = new AST.RestParameter(node.expression, node.start, node.end);
        }
    
        for (i = 0; i < list.length; ++i) {
        
            node = list[i];
            params.push(param = new AST.FormalParameter(node, null, node.start, node.end));
            this.transformPatternElement(param, true);
        }
        
        if (rest)
            params.push(rest);
        
        return params;
    }
    
    transformArrayPattern(node, binding) {
    
        // ArrayPattern and ArrayLiteral are isomorphic, so we simply change the type
        node.type = "ArrayPattern";
        
        var elems = node.elements,
            elem,
            rest,
            i;
        
        for (i = 0; i < elems.length; ++i) {
        
            elem = elems[i];
            
            if (!elem) 
                continue;
            
            if (elem.type !== "PatternElement") {
            
                rest = (elem.type === "SpreadExpression");
                
                elem = elems[i] = new AST.PatternElement(
                    rest ? elem.expression : elem,
                    null,
                    rest,
                    elem.start,
                    elem.end);
                
                // No trailing comma allowed after rest
                if (rest && (node.trailingComma || i < elems.length - 1))
                    this.fail("Invalid destructuring pattern", elem);
            }
            
            if (elem.rest) this.transformPattern(elem.pattern, binding);
            else this.transformPatternElement(elem, binding);
        }
    }
    
    transformObjectPattern(node, binding) {

        // ObjectPattern and ObjectLiteral are isomorphic, so we simply change the type
        node.type = "ObjectPattern";
        
        var props = node.properties, 
            prop,
            i;
        
        for (i = 0; i < props.length; ++i) {
        
            prop = props[i];
            
            // Clear the error flag
            prop.error = "";
            
            switch (prop.type) {
            
                case "PatternProperty":
                
                    break;
                    
                case "PropertyDefinition":
                    
                    // Replace node
                    prop = new AST.PatternProperty(
                        prop.name,
                        prop.expression,
                        null,
                        prop.start,
                        prop.end);
                    
                    props[i] = prop;
                    
                    break;
                
                default:
                
                    this.fail("Invalid pattern", prop);
            }
            
            if (prop.pattern) this.transformPatternElement(prop, binding);
            else this.transformPattern(prop.name, binding);
        }
    }
    
    transformPatternElement(elem, binding) {
    
        var node = elem.pattern;
        
        // Split assignment into pattern and initializer
        if (node.type === "AssignmentExpression" && node.operator === "=") {
        
            elem.pattern = node.left;
            elem.initializer = node.right;
        }
        
        this.transformPattern(elem.pattern, binding);
    }
    
    // Transforms an expression into a pattern
    transformPattern(node, binding) {

        switch (node.type) {
        
            case "Identifier":
                if (binding) this.checkBindingIdentifier(node, true);
                else this.checkAssignTarget(node);
                
                break;
            
            case "MemberExpression":
            case "CallExpression":
                if (binding) this.fail("Invalid left-hand-side in binding pattern", node);
                break;
            
            case "ObjectLiteral":
            case "ObjectPattern":
                this.transformObjectPattern(node, binding);
                break;
            
            case "ArrayLiteral":
            case "ArrayPattern":
                this.transformArrayPattern(node, binding);
                break;
                
            default:
                this.fail("Invalid expression in pattern", node);
                break;
        }
        
        return node;
    }
    
}

