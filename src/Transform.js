import { AST } from "AST.js";

export class Transform {

    // Transform an expression into a formal parameter list
    transformFormals(expr) {
        
        if (!expr)
            return [];
            
        var param,
            list,
            node,
            expr,
            i;
        
        switch (expr.type) {
        
            case "SequenceExpression": list = expr.expressions; break;
            case "CallExpression": list = expr.arguments; break;
            default: list = [expr]; break;
        }
    
        for (i = 0; i < list.length; ++i) {
        
            node = list[i];
            
            if (i === list.length - 1 && node.type === "SpreadExpression") {
            
                expr = node.expression;
                
                // Rest parameters can only be identifiers
                if (expr.type !== "Identifier")
                    this.fail("Invalid rest parameter", expr);
                
                this.checkBindingIdentifier(expr);
                
                // Clear parser error for invalid spread expression
                node.error = "";
                
                param = new AST.RestParameter(expr, node.start, node.end);
                
            } else {
             
                param = new AST.FormalParameter(node, null, node.start, node.end);
                this.transformPatternElement(param, true);
            }
            
            list[i] = param;
        }
        
        return list;
    }
    
    transformArrayPattern(node, binding) {
    
        // ArrayPattern and ArrayLiteral are isomorphic, so we simply change the type
        node.type = "ArrayPattern";
        
        var elems = node.elements,
            rest = false,
            elem,
            i;
        
        for (i = 0; i < elems.length; ++i) {
        
            elem = elems[i];
            
            // Rest element must be last
            if (rest)
                this.fail("Invalid destructuring pattern", elem);
            
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
                // TODO: trailingComma is never assigned
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

        var invalid = false;
        
        switch (node.type) {
        
            case "Identifier":
                if (binding) this.checkBindingIdentifier(node, true);
                else this.checkAssignTarget(node);
                
                break;
            
            case "MemberExpression":
                if (binding) invalid = true;
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
                invalid = true;
                break;
        }
        
        if (invalid)
            this.fail("Invalid expression in pattern", node);
        
        return node;
    }
    
}

