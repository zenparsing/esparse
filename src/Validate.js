"use strict";

// Object literal property name flags
var PROP_NORMAL = 1,
    PROP_ASSIGN = 2,
    PROP_GET = 4,
    PROP_SET = 8;

// Returns true if the specified name is a restricted identifier in strict mode
function isPoisonIdent(name) {

    return name === "eval" || name === "arguments";
}

exports.methods = {

    // Checks an assignment target for strict mode restrictions
	checkAssignTarget: function(node, strict) {
	
		if (!strict && !this.context.strict)
		    return;
		
		if (node.type === "Identifier" && isPoisonIdent(node.value))
			this.fail("Cannot modify " + node.value + " in strict mode", node);
	},
	
	// Checks a binding identifier for strict mode restrictions
	checkBindingIdent: function(node, strict) {
	
	    if (!strict && !this.context.strict)
	        return;
	        
	    var name = node.value;
	    
	    if (isPoisonIdent(name))
		    this.fail("Binding cannot be created for '" + name + "' in strict mode", node);
	},
	
	// Checks function formal parameters for strict mode restrictions
	checkParameters: function(params) {
	
	    if (!this.context.strict)
	        return;
	    
	    var names = {}, 
	        name,
	        node,
	        i;
	    
	    for (i = 0; i < params.length; ++i) {
	    
	        node = params[i];
	        
	        if (node.type !== "FormalParameter" || node.pattern.type !== "Identifier")
	            continue;
	        
	        name = node.pattern.value;
	        
	        if (isPoisonIdent(name))
	            this.fail("Parameter name " + name + " is not allowed in strict mode", node);
	        
	        if (names[name] === 1)
	            this.fail("Strict mode function may not have duplicate parameter names", node);
	        
	        names[name] = 1;
	    }
	},
	
	// Performs validation on the init portion of a for-in or for-of statement
	checkForInit: function(init, type) {
	
        if (init.type === "VariableDeclaration") {
        
            // For-in/of may only have one variable declaration
            
            if (init.declarations.length !== 1)
                this.fail("for-" + type + " statement may not have more than one variable declaration", init);
            
            // A variable initializer is only allowed in for-in where 
            // variable type is "var" and it is not a pattern
                
            var decl = init.declarations[0];
            
            if (decl.init && (
                type === "of" ||
                init.keyword !== "var" ||
                decl.pattern.type !== "Identifier")) {
                
                this.fail("Invalid initializer in for-" + type + " statement", init);
            }
            
        } else {
        
            // Transform object and array patterns
            this.transformPattern(init, false);
        }
	},
	
	// Returns true if the specified name type is a duplicate for a given set of flags
	isDuplicateName: function(type, flags) {
	
	    if (!flags)
	        return false;
	    
	    switch (type) {
	    
	        case PROP_ASSIGN: return (this.context.strict || flags !== PROP_ASSIGN);
	        case PROP_GET: return (flags !== PROP_SET);
	        case PROP_SET: return (flags !== PROP_GET);
	        default: return !!flags;
	    }
	},
	
	// Checks for duplicate property names in object literals or classes
	checkInvalidNodes: function() {
	
	    var context = this.context,
	        list = context.invalidNodes,
	        node,
	        i;
	    
	    if (list === null)
	        return;
	    
	    for (i = 0; i < list.length; ++i) {
	    
	        node = list[i];
	        
	        if (node.error)
	            this.fail(node.error, node);
	    }
	    
	    context.invalidNodes = null;
	}
    
};