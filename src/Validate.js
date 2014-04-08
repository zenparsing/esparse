import { IntMap } from "IntMap.js";

// Object literal property name flags
var PROP_NORMAL = 1,
    PROP_DATA = 2,
    PROP_GET = 4,
    PROP_SET = 8;

// Identifiers which are reserved in strict mode    
var strictReservedWord = new RegExp("^(?:" +
    "implements|private|public|interface|package|let|protected|static|yield" +
")$");

// Returns true if the identifier is a reserved word in strict mode
function isStrictReserved(word) {

    return strictReservedWord.test(word);
}

// Returns true if the specified name is a restricted identifier in strict mode
function isPoisonIdent(name) {

    return name === "eval" || name === "arguments";
}

// Unwraps parens surrounding an expression
function unwrapParens(node) {

    // Remove any parenthesis surrounding the target
    for (; node.type === "ParenExpression"; node = node.expression);
    return node;
}

export class Validate {

    // Checks an assignment target for strict mode restrictions
    checkAssignTarget(node, simple) {
    
        // Remove any parenthesis surrounding the target
        for (; node.type === "ParenExpression"; node = node.expression);
        
        switch (node.type) {
        
            case "Identifier":
            
                // Mark identifier node as a variable
                node.context = "variable";

                if (isPoisonIdent(node.value))
                    this.addStrictError("Cannot modify " + node.value + " in strict mode", node);
        
                break;
            
            case "MemberExpression":
                break;
                    
            case "ObjectLiteral":
            case "ArrayLiteral":
            
                if (!simple) {
                
                    this.transformPattern(node, false);
                    break;
                }
            
            default:
                this.fail("Invalid left-hand side in assignment", node);
        }
    }
    
    // Checks an identifier for strict mode reserved words
    checkIdentifier(node) {
    
        var ident = node.value;
        
        // TODO: Add a restriction for await in async functions?
        
        if (ident === "yield" && this.context.functionType === "generator")
            this.fail("yield cannot be an identifier inside of a generator function", node);
        else if (isStrictReserved(ident))
            this.addStrictError(ident + " cannot be used as an identifier in strict mode", node);
    }
    
    // Checks a binding identifier for strict mode restrictions
    checkBindingIdentifier(node, strict) {
    
        // Perform basic identifier check
        this.checkIdentifier(node);
        
        // Mark identifier node as a declaration
        node.context = "declaration";
            
        var name = node.value;
        
        if (isPoisonIdent(name)) {
        
            var msg = "Binding cannot be created for '" + name + "' in strict mode";
            
            if (strict) this.fail(msg, node);
            else this.addStrictError(msg, node);
        }
    }
    
    // Checks function formal parameters for strict mode restrictions
    checkParameters(params, kind) {
    
        var names = new IntMap, 
            name,
            node,
            i;
        
        // TODO: We need to check for duplicate names in some non-strict contexts
        // as well (method definitions, arrow parameters, and maybe generator functions).
        // How do these rules apply when parameters are patterns, though?
        
        // I think (the early errors portion of the spec is very hard to understand)
        // that you have to force strict-like validation in the following cases:
        // method definitions, functions and generators using new parameter list 
        // features (patterns, initializers, or rest), and arrow functions.
        
        for (i = 0; i < params.length; ++i) {
        
            node = params[i];
            
            if (node.type !== "FormalParameter" || node.pattern.type !== "Identifier")
                continue;
            
            name = node.pattern.value;
            
            if (isPoisonIdent(name))
                this.addStrictError("Parameter name " + name + " is not allowed in strict mode", node);
            
            if (names.get(name))
                this.addStrictError("Strict mode function may not have duplicate parameter names", node);
            
            names.set(name, 1);
        }
    }
    
    // TODO: Add a method for validating the parameter list of arrow functions, which may
    // contain identifiers or initializers which are not valid within the containing context.
    
    // TODO: For identifiers within an arrow function parameter list, we have
    // to take into account the parent context.  For example, yield is not
    // allowed as an identifier within the parameter list of an arrow function
    // contained within a generator.  For "modified" arrow functions (e.g. 
    // async arrows) we'll have to take the union of these restrictions.
    
    // Performs validation on transformed arrow formal parameters
    checkArrowParameters(params) {
    
        this.checkParameters(params);
    }
    
    // Performs validation on the init portion of a for-in or for-of statement
    checkForInit(init, type) {
    
        if (init.type === "VariableDeclaration") {
            
            // For-in/of may only have one variable declaration
            if (init.declarations.length !== 1)
                this.fail("for-" + type + " statement may not have more than one variable declaration", init);
        
            // A variable initializer is only allowed in for-in where 
            // variable type is "var" and it is not a pattern
            
            var decl = init.declarations[0];
        
            if (decl.initializer && (
                type === "of" ||
                init.kind !== "var" ||
                decl.pattern.type !== "Identifier")) {
            
                this.fail("Invalid initializer in for-" + type + " statement", init);
            }
            
        } else {
        
            this.checkAssignTarget(init);
        }
    }
    
    // Checks for duplicate object literal property names
    checkPropertyName(node, nameSet) {
    
        // TODO:  This is hot code.  Correctly detecting property name conflicts
        // results in a significant performance degredation.  Investigate ways
        // to make this more efficient.
        
        var flag = PROP_NORMAL,
            currentFlags = 0,
            name = "";
        
        switch (node.name.type) {
        
            case "ComputedPropertyName":
                // If property name is computed, skip duplicate check
                return;
            
            case "Number":
                name = String(node.name.value);
                break;
            
            default:
                name = node.name.value;
                break;
        }
        
        switch (node.type) {

            case "PropertyDefinition":
            
                // Duplicates only allowed for "x: expr" form
                if (node.expression)
                    flag = PROP_DATA;
                
                break;
    
            case "MethodDefinition":
        
                switch (node.kind) {

                    case "get": flag = PROP_GET; break;
                    case "set": flag = PROP_SET; break;
                }
                
                break;
        }

        // If this name has already been added...
        if (currentFlags = nameSet.get(name)) {
        
            var duplicate = true;
            
            switch (flag) {
    
                case PROP_DATA:
                    
                    if (currentFlags === PROP_DATA) {
                    
                        this.addStrictError("Duplicate data property names in object literal not allowed in strict mode", node);
                        duplicate = false;
                    }
                    
                    break;
                
                case PROP_GET:
                    if (currentFlags === PROP_SET) duplicate = false;
                    break;
                    
                case PROP_SET:
                    if (currentFlags === PROP_GET) duplicate = false;
                    break;
            }
            
            if (duplicate)
                this.addInvalidNode("Duplicate property names in object literal not allowed", node);
        }

        // Set name flag
        nameSet.set(name, currentFlags | flag);
    }
    
    checkInvalidNodes() {
    
        var context = this.context,
            parent = context.parent,
            list = context.invalidNodes,
            item,
            node,
            error,
            i;
        
        for (i = 0; i < list.length; ++i) {
        
            item = list[i];
            node = item.node;
            error = node.error;
            
            // Skip if error has been resolved
            if (!error)
                continue;
            
            // Throw if item is not a strict-mode error, or
            // if the current context is strict
            if (!item.strict || context.mode === "strict")
                this.fail(error, node);
            
            // Skip strict errors in sloppy mode
            if (context.mode === "sloppy")
                continue;
            
            // NOTE:  If parent context is sloppy, then we ignore.
            // If the parent context is strict, then this context would
            // also be known to be strict and therefore handled above.
            
            // If parent mode has not been determined, add error to
            // parent context
            if (!parent.mode)
                parent.invalidNodes.push(item);
        }
        
    }
    
    checkDelete(node) {
    
        node = unwrapParens(node);
        
        if (node.type === "Identifier")
            this.addStrictError("Cannot delete unqualified property in strict mode", node);
    }
    
}