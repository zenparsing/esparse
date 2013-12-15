module AST from "AST.js";

import { Scanner } from "Scanner.js";
import { Transform } from "Transform.js";
import { Validate } from "Validate.js";

// Object literal property name flags
var PROP_NORMAL = 1,
    PROP_DATA = 2,
    PROP_GET = 4,
    PROP_SET = 8;

// Returns true if the specified operator is an increment operator
function isIncrement(op) {

    return op === "++" || op === "--";
}

// Returns a binary operator precedence level
function getPrecedence(op) {

    switch (op) {
    
        case "||": return 1;
        case "&&": return 2;
        case "|": return 3;
        case "^": return 4;
        case "&": return 5;
        case "==":
        case "!=":
        case "===":
        case "!==": return 6;
        case "<=":
        case ">=":
        case ">":
        case "<":
        case "instanceof":
        case "in": return 7;
        case ">>>":
        case ">>":
        case "<<": return 8;
        case "+":
        case "-": return 9;
        case "*":
        case "/":
        case "%": return 10;
    }
    
    return 0;
}

// Returns true if the specified operator is an assignment operator
function isAssignment(op) {

    if (op === "=")
        return true;
    
    switch (op) {
    
        case "*=": 
        case "&=": 
        case "^=": 
        case "|=": 
        case "<<=": 
        case ">>=": 
        case ">>>=": 
        case "%=": 
        case "+=": 
        case "-=": 
        case "/=":
            return true;
    }
    
    return false;
}

// Returns true if the specified operator is a unary operator
function isUnary(op) {
    
    switch (op) {
    
        case "delete":
        case "void": 
        case "typeof":
        case "!":
        case "~":
        case "+":
        case "-":
            return true;
    }
    
    return false;
}

// Encodes a string as a map key for use in regular object
function mapKey(name) { return "." + (name || "") }

class Token {

    constructor(s) {
    
        this.type = s.type;
        this.start = s.start;
        this.end = s.end;
        this.value = s.value;
        this.number = s.number;
        this.templateEnd = s.templateEnd;
        this.regExpFlags = s.regExpFlags;
        this.newlineBefore = s.newlineBefore;
        this.strictError = s.strictError;
    }
}

class Context {

    constructor(parent, isStrict, isFunction) {
    
        this.parent = parent;
        this.strict = isStrict;
        this.isFunction = isFunction;
        this.functionBody = false;
        this.functionType = null;
        this.labelSet = {};
        this.switchDepth = 0;
        this.invalidNodes = null;
        this.strictError = null;
    }
}

export class Parser {

    constructor(input, offset) {

        var scanner = new Scanner(input, offset);
        
        this.scanner = scanner;
        this.token = new Scanner;
        this.input = input;
        
        this.peek0 = null;
        this.peek1 = null;
        this.endOffset = scanner.offset;
        
        this.context = null;
        this.pushContext(false);
    }

    get startOffset() {
    
        return this.peekToken().start;
    }
    
    nextToken(context) {
    
        var scanner = this.scanner,
            type;
        
        do { type = scanner.next(context); }
        while (type === "COMMENT")
        
        return new Token(scanner);
    }
    
    readToken(type, context) {
    
        var token = this.peek0 || this.nextToken(context);
        
        this.peek0 = this.peek1;
        this.peek1 = null;
        this.endOffset = token.end;
        
        if (type && token.type !== type)
            this.fail("Unexpected token " + token.type, token);
        
        return token;
    }
    
    read(type, context) {
    
        return this.readToken(type, context).type;
    }
    
    peekToken(context, index) {
    
        if (index === 0 || index === void 0) {
        
            return this.peek0 || (this.peek0 = this.nextToken(context));
        
        } else if (index === 1) {
        
            if (this.peek1) {
            
                return this.peek1;
            
            } else if (this.peek0) {
            
                return this.peek1 = this.nextToken(context);
            }
        }
        
        throw new Error("Invalid lookahead");
    }
    
    peek(context, index) {
    
        return this.peekToken(context, index).type;
    }
    
    unpeek() {
    
        if (this.peek0) {
        
            this.scanner.offset = this.peek0.start;
            this.peek0 = null;
            this.peek1 = null;
        }
    }
    
    peekUntil(type, context) {
    
        var tok = this.peek(context);
        return tok !== "EOF" && tok !== type ? tok : null;
    }
    
    fail(msg, loc) {
    
        var pos = this.scanner.position(loc || this.peek0),
            err = new SyntaxError(msg);
        
        err.line = pos.line;
        err.column = err.column;
        err.lineOffset = pos.lineOffset;
        err.startOffset = pos.startOffset;
        err.endOffset = pos.endOffset;
        
        throw err;
    }
    
    readKeyword(word) {
    
        var token = this.readToken();
        
        if (token.type === word || token.type === "IDENTIFIER" && token.value === word)
            return token;
        
        this.fail("Unexpected token " + token.type, token);
    }
    
    peekKeyword(word) {
    
        var token = this.peekToken();
        return token.type === "IDENTIFIER" && token.value === word;
    }
    
    peekLet() {
    
        if (this.peekKeyword("let")) {
        
            switch (this.peek("div", 1)) {
            
                case "{":
                case "[":
                case "IDENTIFIER": return true;
            }
        }
        
        return false;
    }
    
    peekModule() {
    
        if (this.peekKeyword("module")) {
        
            var token = this.peekToken("div", 1);
            return (!token.newlineBefore && token.type === "IDENTIFIER");
        }
        
        return false;
    }
    
    peekYield() {
    
        return this.peekKeyword("yield") && 
            this.context.functionType === "generator" && 
            this.context.functionBody;
    }
    
    // == Context Management ==
    
    pushContext(isFunction, isStrict) {
    
        isStrict = isStrict || (this.context ? this.context.strict : null);
        this.context = new Context(this.context, isStrict, isFunction);
    }
    
    popContext(collapse) {
    
        var context = this.context,
            parent = context.parent;
        
        if (context.strict !== true)
            this.setStrict(false);
        
        // If collapsing into parent context, copy invalid nodes into parent
        if (collapse && parent && context.invalidNodes) {

            if (!parent.invalidNodes) {
            
                parent.invalidNodes = context.invalidNodes;
                
            } else {
                
                for (var i = 0; i < context.invalidNodes.length; ++i)
                    parent.invalidNodes.push(context.invalidNodes[i]);
            }
            
            context.invalidNodes = null;
        }
        
        this.checkInvalidNodes();
        
        this.context = this.context.parent;
    }
    
    setStrict(strict) {
    
        var context = this.context,
            parent = this.context.parent;
        
        if (context.strict === true)
            return;
        
        context.strict = strict;
        
        var node = context.strictError;
        if (!node) return;
        
        if (strict) {
        
            if (node.error)
                this.fail(node.error, node);
            
        } else if (parent) {
        
            if (parent.strict === null && !parent.strictError)
                parent.strictError = node;
        }
        
        context.strictError = null;
    }
    
    addStrictError(error, node) {
    
        var c = this.context;
        
        node.error = error;
        
        if (c.strict === true)
            this.fail(error, node);
        else if (c.strict === null && !c.strictError)
            c.strictError = node;
    }
    
    maybeEnd() {
    
        var token = this.peekToken();
        
        if (!token.newlineBefore) {
            
            switch (token.type) {
            
                case "EOF":
                case "}":
                case ";":
                    break;
                
                default:
                    return false;
            }
        }
        
        return true;
    }
    
    addInvalidNode(error, node, strict) {
    
        var context = this.context,
            list = context.invalidNodes,
            item = { node: node, strict: strict };
        
        node.error = error;
        
        if (!list) context.invalidNodes = [item];
        else list.push(item);
    }
    
    // === Top Level ===
    
    Script() {
    
        this.pushContext(false);
        
        var start = this.startOffset,
            statements = this.StatementList(true, false);
        
        this.popContext();
        
        return new AST.Script(statements, start, this.endOffset);
    }
    
    Module() {
    
        this.pushContext(false, true);
        
        var start = this.startOffset,
            statements = this.StatementList(true, true);
        
        this.popContext();
        
        return new AST.Module(statements, start, this.endOffset);
    }
    
    // === Expressions ===
    
    Expression(noIn) {
    
        var start = this.startOffset,
            expr = this.AssignmentExpression(noIn),
            list = null;
            
        while (this.peek("div") === ",") {
        
            // If the next token after "," is "...", we might be
            // trying to parse an arrow function formal parameter
            // list with a trailing rest parameter.  Return the 
            // expression up to, but not including ",".
            
            if (this.peek(null, 1) === "...")
                break;
            
            this.read();
            
            if (list === null)
                expr = new AST.SequenceExpression(list = [expr], start, -1);
            
            list.push(this.AssignmentExpression(noIn));
        }
        
        if (list)
            expr.end = this.endOffset;
        
        return expr;
    }
    
    AssignmentExpression(noIn) {
    
        var start = this.startOffset,
            left,
            lhs;
        
        if (this.peekYield())
            return this.YieldExpression();
        
        left = this.ConditionalExpression(noIn);
        
        if (left.type === "ArrowFunctionHead")
            return this.ArrowFunctionBody(left, noIn);
        
        // Check for assignment operator
        if (!isAssignment(this.peek("div")))
            return left;
        
        this.checkAssignTarget(left);
        
        return new AST.AssignmentExpression(
            this.read(),
            left,
            this.AssignmentExpression(noIn),
            start,
            this.endOffset);
    }
    
    SpreadAssignment(noIn) {
    
        if (this.peek() === "...") {
        
            var start = this.startOffset;
            
            this.read();
            
            return new AST.SpreadExpression(
                this.AssignmentExpression(noIn), 
                start, 
                this.endOffset);
        }
        
        return this.AssignmentExpression(noIn);
    }
    
    YieldExpression() {
    
        var start = this.startOffset,
            delegate = false,
            expr = null;
            
        this.readKeyword("yield");
        
        if (this.peek() === "*") {
        
            this.read();
            delegate = true;
        }
        
        if (delegate || !this.maybeEnd())
            expr = this.AssignmentExpression();
        
        return new AST.YieldExpression(
            expr, 
            delegate, 
            start, 
            this.endOffset);
    }
    
    ConditionalExpression(noIn) {
    
        var start = this.startOffset,
            left = this.BinaryExpression(noIn),
            middle,
            right;
        
        if (this.peek("div") !== "?")
            return left;
        
        this.read("?");
        middle = this.AssignmentExpression();
        this.read(":");
        right = this.AssignmentExpression(noIn);
        
        return new AST.ConditionalExpression(left, middle, right, start, this.endOffset);
    }
    
    BinaryExpression(noIn) {
    
        return this.PartialBinaryExpression(this.UnaryExpression(), 0, noIn);
    }
    
    PartialBinaryExpression(lhs, minPrec, noIn) {
    
        var prec,
            next, 
            max, 
            rhs,
            op;
        
        while (next = this.peek("div")) {
            
            // Exit if operator is "in" and in is not allowed
            if (next === "in" && noIn)
                break;
            
            prec = getPrecedence(next);
            
            // Exit if not a binary operator or lower precendence
            if (prec === 0 || prec < minPrec)
                break;
            
            this.read();
            
            op = next;
            max = prec;
            rhs = this.UnaryExpression();
            
            while (next = this.peek("div")) {
            
                prec = getPrecedence(next);
                
                // Exit if not a binary operator or equal or higher precendence
                if (prec === 0 || prec <= max)
                    break;
                
                rhs = this.PartialBinaryExpression(rhs, prec, noIn);
            }
            
            lhs = new AST.BinaryExpression(op, lhs, rhs, lhs.start, rhs.end);
        }
        
        return lhs;
    }
    
    UnaryExpression() {
    
        var start = this.startOffset,
            type = this.peek(),
            token,
            expr;
        
        if (isIncrement(type)) {
        
            this.read();
            expr = this.MemberExpression(true);
            this.checkAssignTarget(expr, true);
            
            return new AST.UpdateExpression(type, expr, true, start, this.endOffset);
        }
        
        if (isUnary(type)) {
        
            this.read();
            expr = this.UnaryExpression();
            
            if (type === "delete" && expr.type === "Identifier")
                this.addStrictError("Cannot delete unqualified property in strict mode", expr);
            
            return new AST.UnaryExpression(type, expr, start, this.endOffset);
        }
        
        expr = this.MemberExpression(true);
        token = this.peekToken("div");
        type = token.type;
        
        // Check for postfix operator
        if (isIncrement(type) && !token.newlineBefore) {
        
            this.read();
            this.checkAssignTarget(expr, true);
            
            return new AST.UpdateExpression(type, expr, false, start, this.endOffset);
        }
        
        return expr;
    }
    
    MemberExpression(allowCall) {
    
        var start = this.startOffset,
            type = this.peek(),
            exit = false,
            prop,
            expr;
        
        expr = 
            type === "new" ? this.NewExpression() :
            type === "super" ? this.SuperExpression() :
            this.PrimaryExpression();
        
        while (!exit && (type = this.peek("div"))) {
        
            switch (type) {
            
                case ".":
                
                    this.read();
                    
                    expr = new AST.MemberExpression(
                        expr, 
                        this.IdentifierName(), 
                        false, 
                        start, 
                        this.endOffset);
                    
                    break;
                
                case "[":
                
                    this.read();
                    prop = this.Expression();
                    this.read("]");
                    
                    expr = new AST.MemberExpression(
                        expr, 
                        prop, 
                        true, 
                        start, 
                        this.endOffset);
        
                    break;
                
                case "(":
                    
                    if (!allowCall) {
                    
                        exit = true;
                        break;
                    }
                    
                    expr = new AST.CallExpression(
                        expr, 
                        this.ArgumentList(), 
                        start, 
                        this.endOffset);
                    
                    break;
                
                case "TEMPLATE":
                
                    expr = new AST.TaggedTemplateExpression(
                        expr,
                        this.TemplateExpression(),
                        start,
                        this.endOffset);
                    
                    break;
                
                default:
                
                    if (expr.type === "SuperExpression")
                        this.fail("Invalid super expression", expr);
                    
                    exit = true;
                    break;
            }
        }
        
        return expr;
    }
    
    NewExpression() {
    
        var start = this.startOffset;
        
        this.read("new");
        
        var expr = this.peek() === "super" ?
            this.SuperExpression() :
            this.MemberExpression(false);
        
        var args = this.peek("div") === "(" ? this.ArgumentList() : null;
        
        return new AST.NewExpression(expr, args, start, this.endOffset);
    }
    
    SuperExpression() {
    
        var start = this.startOffset;
        this.read("super");
        
        return new AST.SuperExpression(start, this.endOffset);
    }
    
    ArgumentList() {
    
        var list = [];
        
        this.read("(");
        
        while (this.peekUntil(")")) {
        
            if (list.length > 0)
                this.read(",");
            
            list.push(this.SpreadAssignment());
        }
        
        this.read(")");
        
        return list;
    }
    
    PrimaryExpression() {
    
        var tok = this.peekToken(),
            type = tok.type,
            start = this.startOffset;
        
        switch (type) {
            
            case "function": return this.FunctionExpression();
            case "class": return this.ClassExpression();
            case "TEMPLATE": return this.TemplateExpression();
            case "NUMBER": return this.Number();
            case "STRING": return this.String();
            case "{": return this.ObjectLiteral();
            
            case "(": return this.peek(null, 1) === "for" ? 
                this.GeneratorComprehension() :
                this.ParenExpression();
            
            case "[": return this.peek(null, 1) === "for" ?
                this.ArrayComprehension() :
                this.ArrayLiteral();
            
            case "IDENTIFIER":
            
                if (this.peek("div", 1) === "=>") {
                
                    this.pushContext(true);
                    return this.ArrowFunctionHead(this.BindingIdentifier(), null, start);
                }
                    
                return this.Identifier(true);
            
            case "REGEX":
                this.read();
                return new AST.RegularExpression(tok.value, tok.regExpFlags, tok.start, tok.end);
            
            case "null":
                this.read();
                return new AST.Null(tok.start, tok.end);
            
            case "true":
            case "false":
                this.read();
                return new AST.Boolean(type === "true", tok.start, tok.end);
            
            case "this":
                this.read();
                return new AST.ThisExpression(tok.start, tok.end);
        }
        
        this.fail("Unexpected token " + type);
    }
    
    Identifier(isVar) {
    
        var token = this.readToken("IDENTIFIER"),
            context = isVar ? "variable" : "",
            node;
            
        node = new AST.Identifier(token.value, context, token.start, token.end);
        
        this.checkIdentifier(node);
        
        return node;
    }
    
    IdentifierName() {
    
        var token = this.readToken("IDENTIFIER", "name");
        return new AST.Identifier(token.value, "", token.start, token.end);
    }
    
    String() {
    
        var token = this.readToken("STRING");
        
        // Ocatal escapes are not allowed in strict mode
        if (token.strictError)
            this.addStrictError(token.strictError, token);
            
        return new AST.String(token.value, token.start, token.end);
    }
    
    Number() {
    
        var token = this.readToken("NUMBER");
        
        // Legacy ocatals are not allowed in strict mode
        if (token.strictError)
            this.addStrictError(token.strictError, token);
            
        return new AST.Number(token.number, token.start, token.end);
    }
    
    Template() {
    
        var token = this.readToken("TEMPLATE", "template");
        
        // Ocatal escapes are not allowed in strict mode
        if (token.strictError)
            this.addStrictError(token.strictError, token);
            
        return new AST.Template(token.value, token.templateEnd, token.start, token.end);
    }
    
    BindingIdentifier() {
    
        var node = this.Identifier();
        
        this.checkBindingIdent(node);
        return node;
    }
    
    BindingPattern() {
    
        var node;
        
        switch (this.peek()) { 
        
            case "{":
                node = this.ObjectLiteral();
                break;
            
            case "[":
                node = this.ArrayLiteral();
                break;
            
            default:
                node = this.BindingIdentifier();
                break;
        }
        
        // Transform expressions to patterns
        if (node.type !== "Identifier")
            this.transformPattern(node, true);
        
        return node;
    }
    
    ParenExpression() {

        var start = this.startOffset,
            expr = null,
            rest = null;
        
        // Push a new context in case we are parsing an arrow function
        this.pushContext(false);
        
        this.read("(");
        
        switch (this.peek()) {
        
            // An empty arrow function formal list
            case ")":
                break;
            
            // An arrow function formal list with a single rest parameter
            case "...":
                rest = this.RestParameter();
                break;
            
            // Paren expression
            default:
                expr = this.Expression();
                break;
        }
        
        // Look for a trailing rest formal parameter within an arrow formal list
        if (!rest && this.peek() === "," && this.peek(null, 1) === "...") {
        
            this.read();
            rest = this.RestParameter();
        }
        
        this.read(")");
        
        if (expr === null || rest !== null || this.peek("div") === "=>")
            return this.ArrowFunctionHead(expr, rest, start);
        
        // Collapse this context into its parent
        this.popContext(true);
        
        return new AST.ParenExpression(expr, start, this.endOffset);
    }
    
    ObjectLiteral() {
    
        var start = this.startOffset,
            list = [],
            nameSet = {},
            node,
            flag,
            key;
        
        this.read("{");
        
        while (this.peekUntil("}", "name")) {
        
            if (list.length > 0)
                this.read(",");
            
            if (this.peek("name") !== "}") {
            
                list.push(node = this.PropertyDefinition());
                this.checkPropertyName(node, nameSet);
            }
        }
        
        this.read("}");
        
        return new AST.ObjectLiteral(list, start, this.endOffset);
    }
    
    PropertyDefinition() {
    
        var start = this.startOffset,
            node,
            name;
        
        if (this.peek("name") === "*")
            return this.MethodDefinition();
        
        switch (this.peek("name", 1)) {
        
            case "=":
        
                // Re-read token as an identifier
                this.unpeek();
            
                node = new AST.PatternProperty(
                    this.Identifier(),
                    null,
                    (this.read(), this.AssignmentExpression()),
                    start,
                    this.endOffset);
        
                this.addInvalidNode("Invalid property definition in object literal", node, false);
                return node;
            
            case ",":
            case "}":
            
                // Re-read token as an identifier
                this.unpeek();
        
                return new AST.PropertyDefinition(
                    this.Identifier(),
                    null,
                    start,
                    this.endOffset);
        }
            
        name = this.PropertyName();
        
        if (this.peek("name") === ":") {
        
            return new AST.PropertyDefinition(
                name,
                (this.read(), this.AssignmentExpression()),
                start,
                this.endOffset);
        }
        
        return this.MethodDefinition(name);
    }
    
    PropertyName() {
    
        var type = this.peek("name");
        
        switch (type) {
        
            case "IDENTIFIER": return this.Identifier();
            case "STRING": return this.String();
            case "NUMBER": return this.Number();
            case "[": return this.ComputedPropertyName();
        }
        
        this.fail("Unexpected token " + type);
    }
    
    ComputedPropertyName() {
    
        var start = this.startOffset;
        
        this.read("[");
        var expr = this.AssignmentExpression();
        this.read("]");
        
        return new AST.ComputedPropertyName(expr, start, this.endOffset);
    }
    
    MethodDefinition(name) {
    
        var start = name ? name.start : this.startOffset,
            kind = "";
        
        if (!name && this.peek("name") === "*") {
        
            this.read();
            
            kind = "generator";
            name = this.PropertyName();
        
        } else {
        
            if (!name)
                name = this.PropertyName();
            
            if (name.type === "Identifier" && 
                this.peek("name") !== "(" &&
                (name.value === "get" || name.value === "set")) {
            
                kind = name.value;
                name = this.PropertyName();
            }
        }
        
        this.pushContext(true);
        
        if (kind === "generator")
            this.context.functionType = kind;
        
        var params = this.FormalParameters(),
            body = this.FunctionBody();
        
        this.checkParameters(params);
        this.popContext();
        
        return new AST.MethodDefinition(
            kind,
            name,
            params,
            body,
            start,
            this.endOffset);
    }
    
    ArrayLiteral() {
    
        var start = this.startOffset,
            list = [],
            comma = false,
            next,
            type;
        
        this.read("[");
        
        while (type = this.peekUntil("]")) {
            
            if (type === ",") {
            
                this.read();
                
                if (comma)
                    list.push(null);
                
                comma = true;
            
            } else {
            
                list.push(next = this.SpreadAssignment());
                comma = false;
            }
        }
        
        this.read("]");
        
        return new AST.ArrayLiteral(list, start, this.endOffset);
    }
    
    ArrayComprehension() {
    
        var start = this.startOffset;
        
        this.read("[");
        
        var list = this.ComprehensionQualifierList(),
            expr = this.AssignmentExpression();
        
        this.read("]");
        
        return new AST.ArrayComprehension(list, expr, start, this.endOffset);
    }
    
    GeneratorComprehension() {
    
        var start = this.startOffset;
        
        this.read("(");
        
        var list = this.ComprehensionQualifierList(),
            expr = this.AssignmentExpression();
        
        this.read(")");
        
        return new AST.GeneratorComprehension(list, expr, start, this.endOffset);
    }
    
    ComprehensionQualifierList() {
    
        var list = [],
            done = false;
        
        list.push(this.ComprehensionFor());
        
        while (!done) {
        
            switch (this.peek()) {
            
                case "for": list.push(this.ComprehensionFor()); break;
                case "if": list.push(this.ComprehensionIf()); break;
                default: done = true; break;
            }
        }
        
        return list;
    }
    
    ComprehensionFor() {
    
        var start = this.startOffset;
        
        this.read("for");
        
        return new AST.ComprehensionFor(
            this.BindingPattern(),
            (this.readKeyword("of"), this.AssignmentExpression()),
            start,
            this.endOffset);
    }
    
    ComprehensionIf() {
    
        var start = this.startOffset,
            test;
            
        this.read("if");
        
        this.read("(");
        test = this.AssignmentExpression();
        this.read(")");
        
        return new AST.ComprehensionIf(test, start, this.endOffset);
    }
    
    TemplateExpression() {
        
        var atom = this.Template(),
            start = atom.start,
            lit = [ atom ],
            sub = [];
        
        while (!atom.templateEnd) {
        
            sub.push(this.Expression());
            
            // Discard any tokens that have been scanned using a different context
            this.unpeek();
            
            lit.push(atom = this.Template());
        }
        
        return new AST.TemplateExpression(lit, sub, start, this.endOffset);
    }
    
    // === Statements ===
    
    Statement() {
    
        switch (this.peek()) {
            
            case "IDENTIFIER":
            
                return this.peek("div", 1) === ":" ?
                    this.LabelledStatement() :
                    this.ExpressionStatement();
            
            case "{": return this.Block();
            case ";": return this.EmptyStatement();
            case "var": return this.VariableStatement();
            case "return": return this.ReturnStatement();
            case "break":
            case "continue": return this.BreakOrContinueStatement();
            case "throw": return this.ThrowStatement();
            case "debugger": return this.DebuggerStatement();
            case "if": return this.IfStatement();
            case "do": return this.DoWhileStatement();
            case "while": return this.WhileStatement();
            case "for": return this.ForStatement();
            case "with": return this.WithStatement();
            case "switch": return this.SwitchStatement();
            case "try": return this.TryStatement();
            
            default: return this.ExpressionStatement();
        }
    }
    
    StatementWithLabel(label) {
    
        var name = mapKey(label && label.value),
            labelSet = this.context.labelSet,
            stmt;
        
        if (!labelSet[name]) labelSet[name] = 0;
        else if (label) this.fail("Invalid label", label);
        
        labelSet[name] += 1;
        stmt = this.Statement();
        labelSet[name] -= 1;
        
        return stmt;
    }
    
    Block() {
        
        var start = this.startOffset;
        
        this.read("{");
        var list = this.StatementList(false, false);
        this.read("}");
        
        return new AST.Block(list, start, this.endOffset);
    }
    
    Semicolon() {
    
        var token = this.peekToken(),
            type = token.type;
        
        if (type === ";" || !(type === "}" || type === "EOF" || token.newlineBefore))
            this.read(";");
    }
    
    LabelledStatement() {
    
        var start = this.startOffset,
            label = this.Identifier();
        
        this.read(":");
        
        return new AST.LabelledStatement(
            label, 
            this.StatementWithLabel(label),
            start,
            this.endOffset);
    }
    
    ExpressionStatement() {
    
        var start = this.startOffset,
            expr = this.Expression();
        
        this.Semicolon();
        
        return new AST.ExpressionStatement(expr, start, this.endOffset);
    }
    
    EmptyStatement() {
    
        var start = this.startOffset;
        
        this.Semicolon();
        
        return new AST.EmptyStatement(start, this.endOffset);
    }
    
    VariableStatement() {
    
        var node = this.VariableDeclaration(false);
        
        this.Semicolon();
        node.end = this.endOffset;
        
        return node;
    }
    
    VariableDeclaration(noIn) {
    
        var start = this.startOffset,
            token = this.peekToken(),
            kind = token.type,
            isConst = false,
            list = [];
        
        switch (kind) {
        
            case "var":
                break;
            
            case "const":
                isConst = true;
                break;
            
            case "IDENTIFIER":
            
                if (token.value === "let") {
                
                    kind = "let";
                    break;
                }
                
            default:
                this.fail("Expected var, const, or let");
        }
        
        this.read();
        
        while (true) {
        
            list.push(this.VariableDeclarator(noIn, isConst));
            
            if (this.peek() === ",") this.read();
            else break;
        }
        
        return new AST.VariableDeclaration(kind, list, start, this.endOffset);
    }
    
    VariableDeclarator(noIn, isConst) {
    
        var start = this.startOffset,
            pattern = this.BindingPattern(),
            init = null;
        
        if (pattern.type !== "Identifier" || this.peek() === "=") {
        
            this.read("=");
            init = this.AssignmentExpression(noIn);
            
        } else if (isConst) {
        
            this.fail("Missing const initializer", pattern);
        }
        
        return new AST.VariableDeclarator(pattern, init, start, this.endOffset);
    }
    
    ReturnStatement() {
    
        if (!this.context.isFunction)
            this.fail("Return statement outside of function");
        
        var start = this.startOffset;
        
        this.read("return");
        var value = this.maybeEnd() ? null : this.Expression();
        
        this.Semicolon();
        
        return new AST.ReturnStatement(value, start, this.endOffset);
    }
    
    BreakOrContinueStatement() {
    
        var start = this.startOffset,
            token = this.readToken(),
            keyword = token.type,
            labelSet = this.context.labelSet,
            label,
            name;
        
        label = this.maybeEnd() ? null : this.Identifier();
        name = mapKey(label && label.value);
        
        this.Semicolon();
        
        if (label) {
        
            if (!labelSet[name])
                this.fail("Invalid label", label);
        
        } else {
        
            if (!labelSet[name] && !(keyword === "break" && this.context.switchDepth > 0))
                this.fail("Invalid " + keyword + " statement", token);
        }
        
        return keyword === "break" ?
            new AST.BreakStatement(label, start, this.endOffset) :
            new AST.ContinueStatement(label, start, this.endOffset);
    }
    
    ThrowStatement() {
    
        var start = this.startOffset;
        
        this.read("throw");
        
        var expr = this.maybeEnd() ? null : this.Expression();
        
        if (expr === null)
            this.fail("Missing throw expression");
        
        this.Semicolon();
        
        return new AST.ThrowStatement(expr, start, this.endOffset);
    }
    
    DebuggerStatement() {
    
        var start = this.startOffset;
        
        this.read("debugger");
        this.Semicolon();
        
        return new AST.DebuggerStatement(start, this.endOffset);
    }
    
    IfStatement() {
    
        var start = this.startOffset;
        
        this.read("if");
        this.read("(");
        
        var test = this.Expression(),
            body = null,
            elseBody = null;
        
        this.read(")");
        body = this.Statement();
        
        if (this.peek() === "else") {
        
            this.read();
            elseBody = this.Statement();
        }
        
        return new AST.IfStatement(test, body, elseBody, start, this.endOffset);
    }
    
    DoWhileStatement() {
    
        var start = this.startOffset,
            body, 
            test;
        
        this.read("do");
        body = this.StatementWithLabel();
        
        this.read("while");
        this.read("(");
        
        test = this.Expression();
        
        this.read(")");
        
        return new AST.DoWhileStatement(body, test, start, this.endOffset);
    }
    
    WhileStatement() {
    
        var start = this.startOffset;
        
        this.read("while");
        this.read("(");
        
        return new AST.WhileStatement(
            this.Expression(), 
            (this.read(")"), this.StatementWithLabel()), 
            start, 
            this.endOffset);
    }
    
    ForStatement() {
    
        var start = this.startOffset,
            init = null,
            test,
            step;
        
        this.read("for");
        this.read("(");
        
        // Get loop initializer
        switch (this.peek()) {
        
            case ";":
                break;
                
            case "var":
            case "const":
                init = this.VariableDeclaration(true);
                break;
            
            case "IDENTIFIER":
            
                if (this.peekLet()) {
                
                    init = this.VariableDeclaration(true);
                    break;
                }
            
            default:
                init = this.Expression(true);
                break;
        }
        
        if (init) {
        
            if (this.peek() === "in")
                return this.ForInStatement(init, start);
        
            if (this.peekKeyword("of"))
                return this.ForOfStatement(init, start);
        }
        
        this.read(";");
        test = this.peek() === ";" ? null : this.Expression();
        
        this.read(";");
        step = this.peek() === ")" ? null : this.Expression();
        
        this.read(")");
        
        return new AST.ForStatement(
            init, 
            test, 
            step, 
            this.StatementWithLabel(), 
            start, 
            this.endOffset);
    }
    
    ForInStatement(init, start) {
    
        this.checkForInit(init, "in");
        
        this.read("in");
        var expr = this.Expression();
        this.read(")");
        
        return new AST.ForInStatement(
            init, 
            expr, 
            this.StatementWithLabel(), 
            start, 
            this.endOffset);
    }
    
    ForOfStatement(init, start) {
    
        this.checkForInit(init, "of");
        
        this.readKeyword("of");
        var expr = this.AssignmentExpression();
        this.read(")");
        
        return new AST.ForOfStatement(
            init, 
            expr, 
            this.StatementWithLabel(), 
            start, 
            this.endOffset);
    }
    
    WithStatement() {
    
        var token = this.readToken("with");
        
        this.addStrictError("With statement is not allowed in strict mode", token);
    
        var start = this.startOffset;
        
        this.read("with");
        this.read("(");
        
        return new AST.WithStatement(
            this.Expression(), 
            (this.read(")"), this.Statement()),
            start,
            this.endOffset);
    }
    
    SwitchStatement() {
    
        var start = this.startOffset;
        
        this.read("switch");
        this.read("(");
        
        var head = this.Expression(),
            hasDefault = false,
            cases = [],
            node;
        
        this.read(")");
        this.read("{");
        this.context.switchDepth += 1;
        
        while (this.peekUntil("}")) {
        
            node = this.SwitchCase();
            
            if (node.test === null) {
            
                if (hasDefault)
                    this.fail("Switch statement cannot have more than one default");
                
                hasDefault = true;
            }
            
            cases.push(node);
        }
        
        this.context.switchDepth -= 1;
        this.read("}");
        
        return new AST.SwitchStatement(head, cases, start, this.endOffset);
    }
    
    SwitchCase() {
    
        var start = this.startOffset,
            expr = null, 
            list = [],
            type;
        
        if (this.peek() === "default") {
        
            this.read();
        
        } else {
        
            this.read("case");
            expr = this.Expression();
        }
        
        this.read(":");
        
        while (type = this.peekUntil("}")) {
        
            if (type === "case" || type === "default")
                break;
            
            list.push(this.Statement());
        }
        
        return new AST.SwitchCase(expr, list, start, this.endOffset);
    }
    
    TryStatement() {
    
        var start = this.startOffset;
        
        this.read("try");
        
        var tryBlock = this.Block(),
            handler = null,
            fin = null;
        
        if (this.peek() === "catch")
            handler = this.CatchClause();
        
        if (this.peek() === "finally") {
        
            this.read("finally");
            fin = this.Block();
        }
        
        return new AST.TryStatement(tryBlock, handler, fin, start, this.endOffset);
    }
    
    CatchClause() {
    
        var start = this.startOffset;
        
        this.read("catch");
        this.read("(");
        var param = this.BindingPattern();
        this.read(")");
        
        return new AST.CatchClause(param, this.Block(), start, this.endOffset);
    }
    
    // === Declarations ===
    
    StatementList(prologue, isModule) {
    
        var list = [],
            element,
            node,
            dir;
        
        while (this.peekUntil("}")) {
        
            list.push(element = this.Declaration(isModule));
            
            // Check for directives
            if (prologue && 
                element.type === "ExpressionStatement" &&
                element.expression.type === "String") {
                
                // Get the non-escaped literal text of the string
                node = element.expression;
                dir = this.input.slice(node.start + 1, node.end - 1);
                
                element.directive = dir;
                
                // Check for strict mode
                if (dir === "use strict")
                    this.setStrict(true);
            
            } else {
            
                prologue = false;
            }
        }
        
        return list;
    }
    
    Declaration(isModule) {
    
        switch (this.peek()) {
            
            case "function": return this.FunctionDeclaration();
            case "class": return this.ClassDeclaration();
            case "const": return this.LexicalDeclaration();
            
            case "import": 
            
                if (isModule)
                    return this.ImportDeclaration();
            
            case "export":
                
                if (isModule)
                    return this.ExportDeclaration();
                
                break;
            
            case "IDENTIFIER":
            
                if (this.peekLet())
                    return this.LexicalDeclaration();
                
                if (this.peekModule())
                    return this.ModuleDefinition();
                
                break;
        }
        
        return this.Statement();
    }
    
    LexicalDeclaration() {
    
        var node = this.VariableDeclaration(false);
        
        this.Semicolon();
        node.end = this.endOffset;
        
        return node;
    }
    
    // === Functions ===
    
    FunctionDeclaration() {
    
        var start = this.startOffset,
            kind = "";
        
        this.read("function");
        
        if (this.peek() === "*") {
            
            this.read();
            kind = "generator";
        }
        
        this.pushContext(true);
        
        if (kind === "generator")
            this.context.functionType = kind;
        
        var ident = this.Identifier(),
            params = this.FormalParameters(),
            body = this.FunctionBody();
            
        this.checkBindingIdent(ident);
        this.checkParameters(params);
        
        this.popContext();
        
        return new AST.FunctionDeclaration(
            kind,
            ident,
            params,
            body,
            start,
            this.endOffset);
    }
    
    FunctionExpression() {
    
        var start = this.startOffset,
            kind = "",
            ident = null;
        
        this.read("function");
        
        if (this.peek() === "*") {
            
            this.read();
            kind = "generator";
        }
        
        if (this.peek() !== "(") {
        
            ident = this.Identifier();
            this.checkBindingIdent(ident);
        }
        
        this.pushContext(true);
        
        if (kind === "generator")
            this.context.functionType = kind;
        
        var params = this.FormalParameters(),
            body = this.FunctionBody();
        
        this.checkParameters(params);
        
        this.popContext();
        
        return new AST.FunctionExpression(
            kind,
            ident,
            params,
            body,
            start,
            this.endOffset);
    }
    
    FormalParameters() {
    
        var list = [];
        
        this.read("(");
        
        while (this.peekUntil(")")) {
            
            if (list.length > 0)
                this.read(",");
            
            // Parameter list may have a trailing rest parameter
            if (this.peek() === "...") {
            
                list.push(this.RestParameter());
                break;
            }
            
            list.push(this.FormalParameter());
        }
        
        this.read(")");
        
        return list;
    }
    
    FormalParameter() {
    
        var start = this.startOffset,
            pattern = this.BindingPattern(),
            init = null;
        
        if (this.peek() === "=") {
        
            this.read("=");
            init = this.AssignmentExpression();
        }
        
        return new AST.FormalParameter(pattern, init, start, this.endOffset);
    }
    
    RestParameter() {
    
        var start = this.startOffset;
        
        this.read("...");
        
        return new AST.RestParameter(this.BindingIdentifier(), start, this.endOffset);
    }
    
    FunctionBody() {
        
        this.context.functionBody = true;
        
        var start = this.startOffset;
        
        this.read("{");
        var statements = this.StatementList(true, false);
        this.read("}");
        
        return new AST.FunctionBody(statements, start, this.endOffset);
    }
    
    ArrowFunctionHead(formals, rest, start) {
    
        // Context must have been pushed by caller
        this.context.isFunction = true;
        
        var params = this.transformFormals(formals, rest);
        this.checkParameters(params);
        
        return new AST.ArrowFunctionHead(params, start, this.endOffset);
    }
    
    ArrowFunctionBody(head, noIn) {
    
        this.read("=>");
        
        var params = head.parameters,
            start = head.start;
        
        var body = this.peek() === "{" ?
            this.FunctionBody() :
            this.AssignmentExpression(noIn);
        
        this.popContext();
        
        return new AST.ArrowFunction(params, body, start, this.endOffset);
    }
    
    // === Modules ===
    
    ModuleDefinition() {
    
        var start = this.startOffset,
            ident,
            target;
        
        this.readKeyword("module");
        
        ident = this.BindingIdentifier();
        
        if (this.peek() === "=") {
    
            this.read();
            target = this.ModulePath();
            this.Semicolon();
        
            return new AST.ModuleAlias(
                ident,
                target,
                start,
                this.endOffset);
            
        } else if (this.peekKeyword("from")) {
    
            this.read();
            target = this.ModuleSpecifier();
            this.Semicolon();
        
            return new AST.ModuleImport(
                ident,
                target,
                start,
                this.endOffset);
        }
        
        return new AST.ModuleDeclaration(
            ident,
            this.ModuleBody(),
            start,
            this.endOffset);
    }
    
    ModuleDeclaration() {
        
        var start = this.startOffset;
        
        this.readKeyword("module");
        
        return new AST.ModuleDeclaration(
            this.BindingIdentifier(),
            this.ModuleBody(),
            start,
            this.endOffset);
    }
    
    ModuleBody() {
    
        this.pushContext(false, true);
        
        var start = this.startOffset;
        
        this.read("{");
        var list = this.StatementList(true, true);
        this.read("}");
        
        this.popContext();
        
        return new AST.ModuleBody(list, start, this.endOffset);
    }
    
    ModuleSpecifier() {
    
        return this.peek() === "STRING" ? this.String() : this.ModulePath();
    }
    
    ImportDeclaration() {
    
        var start = this.startOffset,
            ident,
            from;
        
        this.read("import");
        
        switch (this.peek()) {
        
            case "IDENTIFIER":
            
                ident = this.BindingIdentifier();
                this.readKeyword("from");
                from = this.ModuleSpecifier();
                this.Semicolon();
                
                return new AST.ImportDefaultDeclaration(ident, from, start, this.endOffset);
            
            case "STRING":
            
                from = this.ModuleSpecifier();
                this.Semicolon();
                
                return new AST.ImportDeclaration(null, from, start, this.endOffset);
        }
        
        var list = [];
        
        this.read("{");
    
        while (this.peekUntil("}")) {
    
            list.push(this.ImportSpecifier());
        
            if (this.peek() === ",") 
                this.read();
        }
    
        this.read("}");
        this.readKeyword("from");
        from = this.ModuleSpecifier();
        this.Semicolon();
        
        return new AST.ImportDeclaration(list, from, start, this.endOffset);
    }
    
    ImportSpecifier() {
    
        var start = this.startOffset,
            hasLocal = false,
            local = null,
            remote;
        
        if (this.peek() !== "IDENTIFIER") {
        
            // Re-scan token as an identifier name
            this.unpeek();
            remote = this.IdentifierName();
            hasLocal = true;
            
        } else {
        
            remote = this.Identifier();
            hasLocal = this.peekKeyword("as");
        }
        
        if (hasLocal) {
        
            this.readKeyword("as");
            local = this.BindingIdentifier();
            
        } else {
        
            this.checkBindingIdent(remote);
        }
        
        return new AST.ImportSpecifier(remote, local, start, this.endOffset);
    }
    
    ExportDeclaration() {
    
        var start = this.startOffset,
            binding;
        
        this.read("export");
        
        switch (this.peek()) {
                
            case "var":
            case "const":
            
                binding = this.VariableDeclaration(false);
                this.Semicolon();
                break;
            
            case "function":
            
                binding = this.FunctionDeclaration();
                break;
            
            case "class":
            
                binding = this.ClassDeclaration();
                break;
            
            case "IDENTIFIER":
            
                if (this.peekLet()) {
                
                    binding = this.VariableDeclaration(false);
                    this.Semicolon();
                    break;
                }
            
                if (this.peekModule()) {
                
                    binding = this.ModuleDeclaration();
                    break;
                }
                
            default:
                
                binding = this.ExportsList();
                this.Semicolon();
                break;
        }
        
        return new AST.ExportDeclaration(binding, start, this.endOffset);
    }
    
    ExportsList() {
    
        var start = this.startOffset,
            list = null,
            from = null;
        
        if (this.peek() === "*") {
        
            this.read();
            this.readKeyword("from");
            from = this.ModuleSpecifier();
            
        } else {
        
            list = [];
            
            this.read("{");
            
            while (this.peekUntil("}")) {
        
                list.push(this.ExportSpecifier());
            
                if (this.peek() === ",") 
                    this.read();
            }
            
            this.read("}");
            
            if (this.peekKeyword("from")) {
            
                this.read();
                from = this.ModuleSpecifier();
            
            } else {
            
                // TODO: Make sure that export specifiers do
                // not reference reserved words!
            }
        }
        
        return new AST.ExportsList(list, from, start, this.endOffset);
    }
    
    ExportSpecifier() {
    
        var start = this.startOffset,
            local = this.IdentifierName(),
            remote = null;
        
        if (this.peekKeyword("as")) {
        
            this.read();
            remote = this.IdentifierName();
        }
        
        return new AST.ExportSpecifier(local, remote, start, this.endOffset);
    }
    
    ModulePath() {
    
        var start = this.startOffset,
            path = [];
        
        while (true) {
        
            path.push(this.Identifier());
            
            if (this.peek() === ".") this.read();
            else break;
        }
        
        return new AST.ModulePath(path, start, this.endOffset);
    }
    
    // === Classes ===
    
    ClassDeclaration() {
    
        var start = this.startOffset,
            ident = null,
            base = null;
        
        this.read("class");
        
        ident = this.BindingIdentifier();
        
        if (this.peek() === "extends") {
        
            this.read();
            base = this.MemberExpression(true);
        }
        
        return new AST.ClassDeclaration(
            ident,
            base,
            this.ClassBody(),
            start,
            this.endOffset);
    }
    
    ClassExpression() {
    
        var start = this.startOffset, 
            ident = null,
            base = null;
        
        this.read("class");
        
        if (this.peek() === "IDENTIFIER")
            ident = this.BindingIdentifier();
        
        if (this.peek() === "extends") {
        
            this.read();
            base = this.AssignmentExpression();
        }
        
        return new AST.ClassExpression(
            ident, 
            base, 
            this.ClassBody(), 
            start, 
            this.endOffset);
    }
    
    ClassBody() {
    
        this.pushContext(false, true);
        
        var start = this.startOffset,
            nameSet = {}, 
            staticSet = {},
            list = [];
        
        this.read("{");
        
        while (this.peekUntil("}", "name"))
            list.push(this.ClassElement(nameSet, staticSet));
        
        this.read("}");
        
        this.popContext();
        
        return new AST.ClassBody(list, start, this.endOffset);
    }
    
    ClassElement(nameSet, staticSet) {
    
        var start = this.startOffset,
            isStatic = false,
            flag = PROP_NORMAL,
            method,
            name;
        
        // Check for static modifier
        if (this.peekToken("name").value === "static" &&
            this.peek("name", 1) !== "(") {
        
            isStatic = true;
            nameSet = staticSet;
            this.read();
        }
        
        method = this.MethodDefinition();
        this.checkClassElementName(method, nameSet);
        
        return new AST.ClassElement(isStatic, method, start, this.endOffset);
    }
    
}


function mixin(source) {

    source = source.prototype;
    Object.keys(source).forEach(key => Parser.prototype[key] = source[key]);
}

// Add externally defined methods
mixin(Transform);
mixin(Validate);

