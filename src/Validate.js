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

// Encodes a string as a map key for use in regular object
function mapKey(name) { 

    return "." + (name || "");
}

// Returns true if the specified name is a restricted identifier in strict mode
function isPoisonIdent(name) {

    return name === "eval" || name === "arguments";
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
        
        // TODO:  Add a restriction for await in async functions?
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
    checkParameters(params) {
    
        var names = {}, 
            name,
            key,
            node,
            i;
        
        for (i = 0; i < params.length; ++i) {
        
            node = params[i];
            
            if (node.type !== "FormalParameter" || node.pattern.type !== "Identifier")
                continue;
            
            name = node.pattern.value;
            key = mapKey(name);
            
            if (isPoisonIdent(name))
                this.addStrictError("Parameter name " + name + " is not allowed in strict mode", node);
            
            if (names[key])
                this.addStrictError("Strict mode function may not have duplicate parameter names", node);
            
            names[key] = 1;
        }
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
    
        if (node.name.type !== "Identifier")
            return;
        
        var flag = PROP_NORMAL,
            name;
        
        switch (node.type) {

            case "PropertyDefinition": flag = PROP_DATA; break;
    
            case "MethodDefinition":
        
                switch (node.kind) {

                    case "get": flag = PROP_GET; break;
                    case "set": flag = PROP_SET; break;
                }
        }

        // Check for duplicate names
        name = mapKey(node.name.value);

        if (this.isDuplicateName(flag, nameSet[name], false))
            this.addInvalidNode("Duplicate property names in object literal not allowed", node, false);
        else if (this.isDuplicateName(flag, nameSet[name], true))
            this.addInvalidNode("Duplicate data property names in object literal not allowed in strict mode", node, true);

        // Set name flag
        nameSet[name] |= flag;
    }
    
    // Checks for duplicate class element names
    checkClassElementName(node, nameSet) {
    
        if (node.name.type !== "Identifier")
            return;
        
        var flag = PROP_NORMAL,
            name;
        
        switch (node.kind) {

            case "get": flag = PROP_GET; break;
            case "set": flag = PROP_SET; break;
        }

        // Check for duplicate names
        name = mapKey(node.name.value);

        if (this.isDuplicateName(flag, nameSet[name], false))
            this.addInvalidNode("Duplicate method names in class not allowed", node, false);

        // Set name flag
        nameSet[name] |= flag;
    }
    
    // Returns true if the specified name type is a duplicate for a given set of flags
    isDuplicateName(type, flags, strict) {
    
        if (!flags)
            return false;
        
        switch (type) {
        
            case PROP_DATA: return strict || flags !== PROP_DATA;
            case PROP_GET: return flags !== PROP_SET;
            case PROP_SET: return flags !== PROP_GET;
            default: return !!flags;
        }
    }
    
    checkInvalidNodes() {
    
        var context = this.context,
            list = context.invalidNodes,
            item,
            node,
            i;
        
        if (list === null)
            return;
        
        for (i = 0; i < list.length; ++i) {
        
            item = list[i];
            node = item.node;
            
            if (node.error) {
            
                if (item.strict) this.addStrictError(node.error, node);
                else this.fail(node.error, node);
            }
        }
        
        context.invalidNodes = null;
    }
    
}