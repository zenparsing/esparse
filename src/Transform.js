import { AST } from "./AST.js";
import { isReservedWord } from "./Scanner.js";


export class Transform {

    // Transform an expression into a formal parameter list
    transformFormals(expr) {

        if (!expr)
            return [];

        var param,
            list,
            node,
            expr;

        switch (expr.type) {

            case "SequenceExpression": list = expr.expressions; break;
            case "CallExpression": list = expr.arguments; break;
            default: list = [expr]; break;
        }

        for (var i = 0; i < list.length; ++i) {

            node = list[i];

            if (i === list.length - 1 && node.type === "SpreadExpression") {

                expr = node.expression;

                // Rest parameters can only be identifiers
                if (expr.type !== "Identifier")
                    this.fail("Invalid rest parameter", expr);

                this.checkBindingTarget(expr);

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

        // NOTE: ArrayPattern and ArrayLiteral are isomorphic
        node.type = "ArrayPattern";

        var elems = node.elements,
            elem,
            expr;

        for (var i = 0; i < elems.length; ++i) {

            elem = elems[i];

            // Skip holes in pattern
            if (!elem)
                continue;

            switch (elem.type) {

                case "SpreadExpression":

                    // Rest element must be in the last position and cannot be followed
                    // by a comma
                    if (i < elems.length - 1 || node.trailingComma)
                        this.fail("Invalid destructuring pattern", elem);

                    expr = elem.expression;

                    // Rest target cannot be a destructuring pattern
                    switch (expr.type) {

                        case "ObjectLiteral":
                        case "ObjectPattern":
                        case "ArrayLiteral":
                        case "ArrayPattern":
                            this.fail("Invalid rest pattern", expr);
                    }

                    elem = new AST.PatternRestElement(expr, elem.start, elem.end);
                    this.checkPatternTarget(elem.pattern, binding);
                    break;

                case "PatternRestElement":
                    this.checkPatternTarget(elem.pattern, binding);
                    break;

                case "PatternElement":
                    this.transformPatternElement(elem, binding);
                    break;

                default:
                    elem = new AST.PatternElement(elem, null, elem.start, elem.end);
                    this.transformPatternElement(elem, binding);
                    break;

            }

            elems[i] = elem;
        }

    }

    transformObjectPattern(node, binding) {

        // NOTE: ObjectPattern and ObjectLiteral are isomorphic
        node.type = "ObjectPattern";

        var props = node.properties;

        for (var i = 0; i < props.length; ++i) {

            var prop = props[i];

            // Clear the error flag
            prop.error = "";

            switch (prop.type) {

                case "PropertyDefinition":

                    // Replace node
                    props[i] = prop = new AST.PatternProperty(
                        prop.name,
                        prop.expression,
                        null,
                        prop.start,
                        prop.end);

                    break;

                case "PatternProperty":
                    break;

                default:
                    this.fail("Invalid pattern", prop);
            }

            if (prop.pattern) this.transformPatternElement(prop, binding);
            else this.checkPatternTarget(prop.name, binding);
        }
    }

    transformPatternElement(elem, binding) {

        var node = elem.pattern;

        // Split assignment into pattern and initializer
        if (node && node.type === "AssignmentExpression" && node.operator === "=") {

            elem.initializer = node.right;
            elem.pattern = node = node.left;
        }

        this.checkPatternTarget(node, binding);
    }

    transformIdentifier(node) {

        var value = node.value;

        if (isReservedWord(value))
            this.fail("Unexpected token " + value, node);

        this.checkIdentifier(node);
    }

}

