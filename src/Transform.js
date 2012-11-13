exports.methods = {

    // Transform an expression into a formal parameter list
	transformFormals: function(expr) {
	
	    if (expr === null)
	        return [];
	        
	    var list = (expr.type === "SequenceExpression") ? expr.expressions : [expr],
	        params = [],
	        param,
	        node,
	        i;
    
        for (i = 0; i < list.length; ++i) {
        
            node = list[i];
            
            params.push(param = {
            
                type: "FormalParameter",
                pattern: node,
                init: null,
                start: node.start,
                end: node.end,
                previousEnd: node.previousEnd
            });
            
            this.transformPatternElement(param, true);
        }
	    
	    return params;
	},
	
	transformArrayPattern: function(node, binding) {
	
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
                
                elem = elems[i] = {
                
                    type: "PatternElement",
                    pattern: rest ? elem.expression : elem,
                    init: null,
                    rest: rest,
                    start: elem.start,
                    end: elem.end,
                    previousEnd: elem.previousEnd
                };
                
                // No trailing comma allowed after rest
                if (rest && (node.trailingComma || i < elems.length - 1))
                    this.fail("Invalid destructuring pattern", elem);
            }
            
            if (elem.rest) this.transformPattern(elem.pattern, binding);
            else this.transformPatternElement(elem, binding);
        }
	},
	
	transformObjectPattern: function(node, binding) {

        node.type = "ObjectPattern";
        
        var props = node.properties, 
            prop,
            i;
        
        for (i = 0; i < props.length; ++i) {
        
            prop = props[i];
            
            switch (prop.type) {
            
                case "PatternProperty":
                    break;
                
                case "PropertyDefinition":
                    
                    prop.type = "PatternProperty";
                    prop.pattern = prop.expression;
                    prop.init = null;
                    
                    delete prop.expression;
                    break;
                
                default:
                    this.fail("Invalid pattern", prop);
            }
            
            if (prop.pattern)
                this.transformPatternElement(prop, binding);
        }
	},
	
	transformPatternElement: function(elem, binding) {
	
	    var node = elem.pattern;
	    
	    // Split assignment into pattern and initializer
	    if (node.type === "AssignmentExpression" && node.operator === "=") {
	    
	        elem.pattern = node.left;
	        elem.init = node.right;
	    }
	    
	    this.transformPattern(elem.pattern, binding);
	},
	
	// Transforms an expression to a pattern
	transformPattern: function(node, binding) {

        switch (node.type) {
        
            case "Identifier":
            
                if (binding) this.checkBindingIdent(node);
                else this.checkAssignTarget(node);
                
                break;
            
            case "MemberExpression":
            case "CallExpression":
                if (binding) this.fail("Invalid left-hand-side in binding pattern", node);
                break;
            
            case "ObjectExpression":
            case "ObjectPattern":
                this.transformObjectPattern(node, binding);
                break;
            
            case "ArrayExpression":
            case "ArrayPattern":
                this.transformArrayPattern(node, binding);
                break;
                
            default:
                this.fail("Invalid expression in pattern", node);
                break;
        }
        
        return node;
	}
    
};