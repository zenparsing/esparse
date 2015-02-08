import { isStrictReservedWord } from "./Scanner.js";


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

    // Validates an assignment target
    checkAssignmentTarget(node, simple) {

        switch (node.type) {

            case "Identifier":

                if (isPoisonIdent(node.value))
                    this.addStrictError("Cannot modify " + node.value + " in strict mode", node);

                return;

            case "MemberExpression":
            case "AtName":
                return;

            case "ObjectPattern":
            case "ArrayPattern":
                if (!simple) return;
                break;

            case "ObjectLiteral":
                if (!simple) { this.transformObjectPattern(node, false); return }
                break;

            case "ArrayLiteral":
                if (!simple) { this.transformArrayPattern(node, false); return }
                break;

        }

        this.fail("Invalid left-hand side in assignment", node);
    }

    // Validates a binding target
    checkBindingTarget(node) {

        var name;

        switch (node.type) {

            case "Identifier":

                // Perform basic identifier validation
                this.checkIdentifier(node);

                // Mark identifier node as a declaration
                node.context = "declaration";

                name = node.value;

                if (isPoisonIdent(name))
                    this.addStrictError("Binding cannot be created for '" + name + "' in strict mode", node);

                return;

            case "ArrayLiteral":
            case "ArrayPattern":
                this.transformArrayPattern(node, true);
                return;

            case "ObjectLiteral":
            case "ObjectPattern":
                this.transformObjectPattern(node, true);
                return;

        }

        this.fail("Invalid binding target", node);
    }

    // Validates a target in a binding or assignment pattern
    checkPatternTarget(node, binding) {

        return binding ? this.checkBindingTarget(node) : this.checkAssignmentTarget(node, false);
    }

    // Checks an identifier for strict mode reserved words
    checkIdentifier(node) {

        var ident = node.value;

        if (ident === "yield" && this.context.isGenerator)
            this.fail("yield cannot be an identifier inside of a generator function", node);
        else if (ident === "await" && this.context.isAsync)
            this.fail("await cannot be an identifier inside of an async function", node);
        else if (isStrictReservedWord(ident))
            this.addStrictError(ident + " cannot be used as an identifier in strict mode", node);
    }

    // Checks function formal parameters for strict mode restrictions
    checkParameters(params, kind) {

        var name, node;

        for (var i = 0; i < params.length; ++i) {

            node = params[i];

            if (node.type !== "FormalParameter" || node.pattern.type !== "Identifier")
                continue;

            name = node.pattern.value;

            if (isPoisonIdent(name))
                this.addStrictError("Parameter name " + name + " is not allowed in strict mode", node);
        }
    }

    // Performs validation on transformed arrow formal parameters
    checkArrowParameters(params) {

        params = this.transformFormals(params);
        // TODO: Check that formal parameters do not contain yield expressions or
        // await expressions
        this.checkParameters(params);
        return params;
    }

    // Performs validation on the init portion of a for-in or for-of statement
    checkForInit(init, type) {

        if (init.type === "VariableDeclaration") {

            // For-in/of may only have one variable declaration
            if (init.declarations.length !== 1)
                this.fail("for-" + type + " statement may not have more than one variable declaration", init);

            var decl = init.declarations[0];

            // Initializers are not allowed in for in and for of
            if (decl.initializer)
                this.fail("Invalid initializer in for-" + type + " statement", init);

        } else {

            this.checkAssignmentTarget(this.unwrapParens(init));
        }
    }

    checkInvalidNodes() {

        var context = this.context,
            parent = context.parent,
            list = context.invalidNodes,
            item,
            node,
            error;

        for (var i = 0; i < list.length; ++i) {

            item = list[i];
            node = item.node;
            error = node.error;

            // Skip if error has been resolved
            if (!error)
                continue;

            // Throw if item is not a strict-mode-only error, or if the current
            // context is strict
            if (!item.strict || context.mode === "strict")
                this.fail(error, node);

            // Skip strict errors in sloppy mode
            if (context.mode === "sloppy")
                continue;

            // If the parent context is sloppy, then we ignore. If the parent context
            // is strict, then this context would also be known to be strict and
            // therefore handled above.

            // If parent mode has not been determined, add error to
            // parent context
            if (!parent.mode)
                parent.invalidNodes.push(item);
        }

    }

    checkDelete(node) {

        node = this.unwrapParens(node);

        if (node.type === "Identifier")
            this.addStrictError("Cannot delete unqualified property in strict mode", node);
    }

}
