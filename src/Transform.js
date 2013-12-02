module Node from "TreeNode.js";

export class Transform {

    // Transform an expression into a formal parameter list
    transformFormals(expr, rest) {
    
        if (expr === null)
            return [];
            
        var list = (expr.type === "SequenceExpression") ? expr.expressions : [expr],
            params = [],
            param,
            node,
            i;
    
        for (i = 0; i < list.length; ++i) {
        
            node = list[i];
            params.push(param = new Node.FormalParameter(node, null, node.start, node.end));
            this.transformPatternElement(param, true);
        }
        
        if (rest)
            params.push(rest);
        
        return params;
    }
    
    transformArrayPattern(node, binding) {
    
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
                
                elem = elems[i] = new Node.PatternElement(
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
                    prop = new Node.PatternProperty(
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
                if (binding) this.checkBindingIdent(node, true);
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

