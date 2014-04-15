import { AST } from "AST.js";
import { Scanner } from "Scanner.js";
import { Transform } from "Transform.js";
import { Validate } from "Validate.js";
import { IntMap } from "IntMap.js";

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
    
        case "await":
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

// Returns true if the value is a function modifier keyword
function isFunctionModifier(value) {

    // TODO:  Here we just test a string value, but what if the identifier contains
    // unicode escapes?
    
    switch (value) {
    
        case "async": return true;
    }
    
    return false;
}

// Copies token data
function copyToken(from, to) {

    to.type = from.type;
    to.value = from.value;
    to.number = from.number;
    to.regexFlags = from.regexFlags;
    to.templateEnd = from.templateEnd;
    to.newlineBefore = from.newlineBefore;
    to.strictError = from.strictError;
    to.start = from.start;
    to.end = from.end;
    
    return to;
}

class Context {

    constructor(parent, isFunction) {
    
        this.parent = parent;
        this.mode = "";
        this.isFunction = isFunction;
        this.functionBody = false;
        this.functionType = "";
        this.labelSet = new IntMap;
        this.switchDepth = 0;
        this.loopDepth = 0;
        this.invalidNodes = [];
    }
}

export class Parser {

    constructor(input, offset) {

        var scanner = new Scanner(input, offset);
        
        this.scanner = scanner;
        this.input = input;
        
        this.peek0 = null;
        this.peek1 = null;
        this.tokenStash = new Scanner;
        this.tokenEnd = scanner.offset;
        
        this.context = new Context(null, false);
        this.setStrict(false);
    }
    
    nextToken(context) {
    
        var scanner = this.scanner,
            type = "";
        
        context = context || "";
        
        do { type = scanner.next(context); }
        while (type === "COMMENT")
        
        return scanner;
    }
    
    nodeStart() {
    
        if (this.peek0)
            return this.peek0.start;
        
        // Skip over whitespace and comments
        this.scanner.skip();
        
        return this.scanner.offset;
    }
    
    nodeEnd() {
    
        return this.tokenEnd;
    }
    
    readToken(type, context) {
    
        var token = this.peek0 || this.nextToken(context);
        
        this.peek0 = this.peek1;
        this.peek1 = null;
        this.tokenEnd = token.end;
        
        if (type && token.type !== type)
            this.unexpected(token);
            
        return token;
    }
    
    read(type, context) {
    
        return this.readToken(type, context).type;
    }
    
    peekToken(context) {
    
        if (!this.peek0)
            this.peek0 = this.nextToken(context);
        
        return this.peek0;
    }
    
    peek(context) {
    
        return this.peekToken(context).type;
    }
    
    peekTokenAt(context, index) {
    
        if (index !== 1 || this.peek0 === null)
            throw new Error("Invalid lookahead")
        
        if (this.peek1 === null) {
        
            this.peek0 = copyToken(this.peek0, this.tokenStash);
            this.peek1 = this.nextToken(context);
        }
        
        return this.peek1;
    }
    
    peekAt(context, index) {
    
        return this.peekTokenAt(context, index).type;
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
    
    readKeyword(word) {
    
        // TODO:  What if token has a unicode escape?  Does it still count as the keyword?
        // Do we fail if the keyword has a unicode escape (this would mirror what happens
        // with reserved words).
        
        var token = this.readToken();
        
        if (token.type === word || token.type === "IDENTIFIER" && token.value === word)
            return token;
        
        this.unexpected(token);
    }
    
    peekKeyword(word) {
    
        var token = this.peekToken();
        return token.type === "IDENTIFIER" && token.value === word;
    }
    
    peekLet() {
    
        if (this.peekKeyword("let")) {
        
            switch (this.peekAt("div", 1)) {
            
                case "{":
                case "[":
                case "IDENTIFIER": return true;
            }
        }
        
        return false;
    }
    
    peekModule() {
    
        if (this.peekKeyword("module")) {
        
            var token = this.peekTokenAt("div", 1);
            return (!token.newlineBefore && token.type === "IDENTIFIER");
        }
        
        return false;
    }
    
    peekYield() {
    
        return this.context.functionBody &&
            this.context.functionType === "generator" && 
            this.peekKeyword("yield");
    }
    
    peekAwait() {
    
        return this.context.functionBody && 
            this.context.functionType === "async" &&
            this.peekKeyword("await");
    }
    
    peekFunctionModifier() {
    
        var token = this.peekToken();
        
        if (!(token.type === "IDENTIFIER" && isFunctionModifier(token.value)))
            return false;
        
        token = this.peekTokenAt("div", 1);
        return token.type === "function" && !token.newlineBefore;
    }
    
    peekEnd() {
    
        var token = this.peekToken();
        
        if (!token.newlineBefore) {
            
            switch (token.type) {
            
                case "EOF":
                case "}":
                case ";":
                case ")":
                    break;
                
                default:
                    return false;
            }
        }
        
        return true;
    }
    
    unexpected(token) {
    
        var type = token.type, msg;
        
        msg = type === "EOF" ?
            "Unexpected end of input" :
            "Unexpected token " + token.type;
        
        this.fail(msg, token);
    }
    
    fail(msg, node) {
    
        if (!node)
            node = this.peekToken();
        
        var pos = this.scanner.position(node.start),
            err = new SyntaxError(msg);
        
        err.line = pos.line;
        err.column = pos.column;
        err.lineOffset = pos.lineOffset;
        err.startOffset = node.start;
        err.endOffset = node.end;
        err.sourceText = this.input;
        
        throw err;
    }
    
    unwrapParens(node) {

        // Remove any parenthesis surrounding the target
        for (; node.type === "ParenExpression"; node = node.expression);
        return node;
    }

    
    // == Context Management ==
    
    pushContext(isFunction) {
    
        var parent = this.context;
        
        this.context = new Context(parent, isFunction);
        
        if (parent.mode === "strict")
            this.context.mode = "strict";
    }
    
    pushMaybeContext() {
    
        var parent = this.context;
        this.pushContext(parent.isFunction);
        this.context.functionBody = parent.functionBody;
        this.context.functionType = parent.functionType;
    }
    
    popContext(collapse) {
    
        var context = this.context,
            parent = context.parent;
        
        // If collapsing into parent context, copy invalid nodes into parent
        if (collapse) {

            for (var i = 0; i < context.invalidNodes.length; ++i)
                parent.invalidNodes.push(context.invalidNodes[i]);
            
        } else {
        
            this.checkInvalidNodes();
        }
        
        this.context = this.context.parent;
    }
    
    setStrict(strict) {
    
        this.context.mode = strict ? "strict" : "sloppy";
    }
    
    addStrictError(error, node) {
    
        this.addInvalidNode(error, node, true);
    }
    
    addInvalidNode(error, node, strict) {
    
        node.error = error;
        this.context.invalidNodes.push({ node, strict: !!strict });
    }
    
    setLoopLabel(label) {
    
        this.context.labelSet.set(label, 2);
    }
    
    // === Top Level ===
    
    Script() {
    
        this.pushContext(false);
        
        var start = this.nodeStart(),
            statements = this.StatementList(true, false);
        
        this.popContext();
        
        return new AST.Script(statements, start, this.nodeEnd());
    }
    
    Module() {
    
        this.pushContext(false);
        this.setStrict(true);
        
        var start = this.nodeStart(),
            statements = this.StatementList(true, true);
        
        this.popContext();
        
        return new AST.Module(statements, start, this.nodeEnd());
    }
    
    // === Expressions ===
    
    Expression(noIn) {
    
        var start = this.nodeStart(),
            expr = this.AssignmentExpression(noIn),
            list = null;
            
        while (this.peek("div") === ",") {

            this.read();
            
            if (list === null)
                expr = new AST.SequenceExpression(list = [expr], start, -1);
            
            list.push(this.AssignmentExpression(noIn));
        }
        
        if (list)
            expr.end = this.nodeEnd();
        
        return expr;
    }
    
    AssignmentExpression(noIn, allowSpread) {
    
        var start = this.nodeStart(),
            node;
        
        if (this.peek() === "...") {
        
            this.read();
            
            node = new AST.SpreadExpression(
                this.AssignmentExpression(noIn),
                start,
                this.nodeEnd());
            
            if (!allowSpread)
                this.addInvalidNode("Invalid spread expression", node);
            
            return node;
        }
        
        if (this.peekYield())
            return this.YieldExpression(noIn);
        
        node = this.ConditionalExpression(noIn);
        
        if (node.type === "ArrowFunctionHead")
            return this.ArrowFunctionBody(node, noIn);
        
        // Check for assignment operator
        if (!isAssignment(this.peek("div")))
            return node;
        
        this.checkAssignmentTarget(this.unwrapParens(node), false);
        
        return new AST.AssignmentExpression(
            this.read(),
            node,
            this.AssignmentExpression(noIn),
            start,
            this.nodeEnd());
    }
    
    YieldExpression(noIn) {
    
        var start = this.nodeStart(),
            delegate = false,
            expr = null;
            
        this.readKeyword("yield");
        
        if (!this.peekEnd()) {
        
            if (this.peek() === "*") {
        
                this.read();
                delegate = true;
            }
        
            expr = this.AssignmentExpression(noIn);
        }
        
        return new AST.YieldExpression(
            expr, 
            delegate, 
            start, 
            this.nodeEnd());
    }
    
    ConditionalExpression(noIn) {
    
        var start = this.nodeStart(),
            left = this.BinaryExpression(noIn),
            middle,
            right;
        
        if (this.peek("div") !== "?")
            return left;
        
        this.read("?");
        middle = this.AssignmentExpression();
        this.read(":");
        right = this.AssignmentExpression(noIn);
        
        return new AST.ConditionalExpression(left, middle, right, start, this.nodeEnd());
    }
    
    BinaryExpression(noIn) {
    
        return this.PartialBinaryExpression(this.UnaryExpression(), 0, noIn);
    }
    
    PartialBinaryExpression(lhs, minPrec, noIn) {
    
        var prec = 0,
            next = "", 
            max = 0, 
            op = "",
            rhs;
        
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
    
        var start = this.nodeStart(),
            type = this.peek(),
            token,
            expr;
        
        if (isIncrement(type)) {
        
            this.read();
            expr = this.MemberExpression(true);
            this.checkAssignmentTarget(this.unwrapParens(expr), true);
            
            return new AST.UpdateExpression(type, expr, true, start, this.nodeEnd());
        }
        
        if (this.peekAwait())
            type = "await";
        
        if (isUnary(type)) {
        
            this.read();
            expr = this.UnaryExpression();
            
            if (type === "delete")
                this.checkDelete(expr);
            
            return new AST.UnaryExpression(type, expr, start, this.nodeEnd());
        }
        
        expr = this.MemberExpression(true);
        token = this.peekToken("div");
        type = token.type;
        
        // Check for postfix operator
        if (isIncrement(type) && !token.newlineBefore) {
        
            this.read();
            this.checkAssignmentTarget(this.unwrapParens(expr), true);
            
            return new AST.UpdateExpression(type, expr, false, start, this.nodeEnd());
        }
        
        return expr;
    }
    
    MemberExpression(allowCall) {
    
        var start = this.nodeStart(),
            token = this.peekToken(),
            arrowType = "",
            exit = false,
            prop,
            expr;
        
        expr = 
            token.type === "new" ? this.NewExpression() :
            token.type === "super" ? this.SuperExpression() :
            this.PrimaryExpression();
        
        while (!exit) { 
        
            token = this.peekToken("div");
            
            switch (token.type) {
            
                case ".":
                
                    this.read();
                    
                    expr = new AST.MemberExpression(
                        expr, 
                        this.IdentifierName(), 
                        false, 
                        start, 
                        this.nodeEnd());
                    
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
                        this.nodeEnd());
        
                    break;
                
                case "(":
                    
                    if (!allowCall) {
                    
                        exit = true;
                        break;
                    }
                    
                    if (expr.type === "Identifier" && 
                        isFunctionModifier(expr.value)) {
                
                        arrowType = expr.value;
                        this.pushMaybeContext();
                    }
                    
                    expr = new AST.CallExpression(
                        expr, 
                        this.ArgumentList(), 
                        start, 
                        this.nodeEnd());
                    
                    if (arrowType) {
                    
                        token = this.peekToken("div");

                        if (token.type === "=>" && !token.newlineBefore) {
                        
                            expr = this.ArrowFunctionHead(arrowType, expr, start);
                            exit = true;
                        
                        } else {
                            
                            arrowType = "";
                            this.popContext(true);
                        }
                    }
                    
                    break;
                
                case "TEMPLATE":
                
                    expr = new AST.TaggedTemplateExpression(
                        expr,
                        this.TemplateExpression(),
                        start,
                        this.nodeEnd());
                    
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
    
        var start = this.nodeStart();
        
        this.read("new");
        
        var expr = this.peek() === "super" ?
            this.SuperExpression() :
            this.MemberExpression(false);
        
        var args = this.peek("div") === "(" ? this.ArgumentList() : null;
        
        return new AST.NewExpression(expr, args, start, this.nodeEnd());
    }
    
    SuperExpression() {
    
        var start = this.nodeStart();
        this.read("super");
        
        var node = new AST.SuperExpression(start, this.nodeEnd());
        
        if (!this.context.isFunction)
            this.fail("Super keyword outside of function", node);
        
        return node;
    }
    
    ArgumentList() {
    
        var list = [];
        
        this.read("(");
        
        while (this.peekUntil(")")) {
        
            if (list.length > 0)
                this.read(",");
            
            list.push(this.AssignmentExpression(false, true));
        }
        
        this.read(")");
        
        return list;
    }
    
    PrimaryExpression() {
    
        var token = this.peekToken(),
            type = token.type,
            start = this.nodeStart(),
            next;
        
        switch (type) {
            
            case "function": return this.FunctionExpression();
            case "class": return this.ClassExpression();
            case "TEMPLATE": return this.TemplateExpression();
            case "NUMBER": return this.Number();
            case "STRING": return this.String();
            case "{": return this.ObjectLiteral();
            
            case "(": return this.peekAt(null, 1) === "for" ? 
                this.GeneratorComprehension() :
                this.ParenExpression();
            
            case "[": return this.peekAt(null, 1) === "for" ?
                this.ArrayComprehension() :
                this.ArrayLiteral();
            
            case "IDENTIFIER":
                
                next = this.peekTokenAt("div", 1);
                
                if (next.type === "=>") {
                
                    this.pushContext(true);
                    return this.ArrowFunctionHead("", this.BindingIdentifier(), start);
                
                } else if (!next.newlineBefore) {
                
                    if (next.type === "function")
                        return this.FunctionExpression();
                    
                    if (next.type === "IDENTIFIER" && isFunctionModifier(token.value)) {
                    
                        this.read();
                        this.pushContext(true);
                        return this.ArrowFunctionHead(token.value, this.BindingIdentifier(), start);
                    }
                }
                
                return this.Identifier(true);
            
            case "REGEX": return this.RegularExpression();
            
            case "null":
                this.read();
                return new AST.Null(token.start, token.end);
            
            case "true":
            case "false":
                this.read();
                return new AST.Boolean(type === "true", token.start, token.end);
            
            case "this":
                this.read();
                return new AST.ThisExpression(token.start, token.end);
        }
        
        this.unexpected(token);
    }
    
    Identifier(isVar) {
    
        var token = this.readToken("IDENTIFIER"),
            node = new AST.Identifier(token.value, isVar ? "variable" : "", token.start, token.end);
        
        this.checkIdentifier(node);
        return node;
    }
    
    IdentifierName() {
    
        var token = this.readToken("IDENTIFIER", "name");
        return new AST.Identifier(token.value, "", token.start, token.end);
    }
    
    String() {
    
        var token = this.readToken("STRING"),
            node = new AST.String(token.value, token.start, token.end);
        
        if (token.strictError)
            this.addStrictError(token.strictError, node);
        
        return node;
    }
    
    Number() {
    
        var token = this.readToken("NUMBER"),
            node = new AST.Number(token.number, token.start, token.end);
        
        if (token.strictError)
            this.addStrictError(token.strictError, node);
        
        return node;
    }
    
    TemplatePart() {
    
        var token = this.readToken("TEMPLATE", "template"),
            node = new AST.TemplatePart(token.value, token.templateEnd, token.start, token.end);
        
        if (token.strictError)
            this.addStrictError(token.strictError, node);
        
        return node;
    }
    
    RegularExpression() {
    
        // TODO:  Validate regular expression against RegExp grammar (21.2.1)
        var token = this.readToken("REGEX");
        return new AST.RegularExpression(token.value, token.regexFlags, token.start, token.end);
    }
    
    BindingIdentifier() {
    
        var token = this.readToken("IDENTIFIER"),
            node = new AST.Identifier(token.value, "", token.start, token.end);
        
        this.checkBindingTarget(node);
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
                return this.BindingIdentifier();
        }
        
        this.checkBindingTarget(node);
        return node;
    }
    
    ParenExpression() {

        var start = this.nodeStart(),
            expr = null,
            rest = null;
        
        // Push a new context in case we are parsing an arrow function
        this.pushMaybeContext();
        
        this.read("(");
        
        switch (this.peek()) {
        
            // An empty arrow function formal list
            case ")":
                break;
            
            // Paren expression
            default:
                expr = this.Expression();
                break;
        }
        
        this.read(")");
        
        if (expr === null || this.peek("div") === "=>")
            return this.ArrowFunctionHead("", expr, start);
        
        // Collapse this context into its parent
        this.popContext(true);
        
        return new AST.ParenExpression(expr, start, this.nodeEnd());
    }
    
    ObjectLiteral() {
    
        var start = this.nodeStart(),
            nameSet = new IntMap,
            comma = false,
            list = [],
            node;
        
        this.read("{");
        
        while (this.peekUntil("}", "name")) {
        
            if (list.length > 0) {
            
                this.read(",");
                comma = true;
            }
            
            if (this.peek("name") !== "}") {
            
                comma = false;
                list.push(node = this.PropertyDefinition());
                this.checkPropertyName(node, nameSet);
            }
        }
        
        this.read("}");
        
        return new AST.ObjectLiteral(list, start, this.nodeEnd());
    }
    
    PropertyDefinition() {
    
        var start = this.nodeStart(),
            node,
            name;
        
        if (this.peek("name") === "*")
            return this.MethodDefinition();
        
        switch (this.peekAt("name", 1)) {
        
            case "=":
        
                // Re-read token as an identifier
                this.unpeek();
            
                node = new AST.PatternProperty(
                    this.Identifier(true),
                    null,
                    (this.read(), this.AssignmentExpression()),
                    start,
                    this.nodeEnd());
        
                this.addInvalidNode("Invalid property definition in object literal", node);
                return node;
            
            case ",":
            case "}":
            
                // Re-read token as an identifier
                this.unpeek();
        
                return new AST.PropertyDefinition(
                    this.Identifier(true),
                    null,
                    start,
                    this.nodeEnd());
        }
            
        name = this.PropertyName();
        
        if (this.peek("name") === ":") {
        
            return new AST.PropertyDefinition(
                name,
                (this.read(), this.AssignmentExpression()),
                start,
                this.nodeEnd());
        }
        
        return this.MethodDefinition(name);
    }
    
    PropertyName() {
    
        var token = this.peekToken("name");
        
        switch (token.type) {
        
            case "IDENTIFIER": return this.IdentifierName();
            case "STRING": return this.String();
            case "NUMBER": return this.Number();
            case "[": return this.ComputedPropertyName();
        }
        
        this.unexpected(token);
    }
    
    ComputedPropertyName() {
    
        var start = this.nodeStart();
        
        this.read("[");
        var expr = this.AssignmentExpression();
        this.read("]");
        
        return new AST.ComputedPropertyName(expr, start, this.nodeEnd());
    }
    
    ArrayLiteral() {
    
        var start = this.nodeStart(),
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
            
                list.push(next = this.AssignmentExpression(false, true));
                comma = false;
            }
        }
        
        this.read("]");
        
        return new AST.ArrayLiteral(list, start, this.nodeEnd());
    }
    
    ArrayComprehension() {
    
        var start = this.nodeStart();
        
        this.read("[");
        
        var list = this.ComprehensionQualifierList(),
            expr = this.AssignmentExpression();
        
        this.read("]");
        
        return new AST.ArrayComprehension(list, expr, start, this.nodeEnd());
    }
    
    GeneratorComprehension() {
    
        var start = this.nodeStart(),
            fType = this.context.functionType;
        
        // Generator comprehensions cannot contain contextual expresions like yield
        this.context.functionType = "";
        this.read("(");
        
        var list = this.ComprehensionQualifierList(),
            expr = this.AssignmentExpression();
        
        this.read(")");
        this.context.functionType = fType;
        
        return new AST.GeneratorComprehension(list, expr, start, this.nodeEnd());
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
    
        var start = this.nodeStart();
        
        this.read("for");
        
        return new AST.ComprehensionFor(
            this.BindingPattern(),
            (this.readKeyword("of"), this.AssignmentExpression()),
            start,
            this.nodeEnd());
    }
    
    ComprehensionIf() {
    
        var start = this.nodeStart(),
            test;
            
        this.read("if");
        
        this.read("(");
        test = this.AssignmentExpression();
        this.read(")");
        
        return new AST.ComprehensionIf(test, start, this.nodeEnd());
    }
    
    TemplateExpression() {
        
        var atom = this.TemplatePart(),
            start = atom.start,
            lit = [atom],
            sub = [];
        
        while (!atom.templateEnd) {
        
            sub.push(this.Expression());
            
            // Discard any tokens that have been scanned using a different context
            this.unpeek();
            
            lit.push(atom = this.TemplatePart());
        }
        
        return new AST.TemplateExpression(lit, sub, start, this.nodeEnd());
    }
    
    // === Statements ===
    
    Statement(label) {
    
        var next;
        
        switch (this.peek()) {
            
            case "IDENTIFIER":
            
                next = this.peekTokenAt("div", 1);
                
                if (next.type === ":")
                    return this.LabelledStatement();
                
                if (next.type === "function" && !next.newlineBefore)
                    return this.FunctionDeclaration();
                
                return this.ExpressionStatement();
            
            case "{": return this.Block();
            case ";": return this.EmptyStatement();
            case "var": return this.VariableStatement();
            case "return": return this.ReturnStatement();
            case "break": return this.BreakStatement();
            case "continue": return this.ContinueStatement();
            case "throw": return this.ThrowStatement();
            case "debugger": return this.DebuggerStatement();
            case "if": return this.IfStatement();
            case "do": return this.DoWhileStatement(label);
            case "while": return this.WhileStatement(label);
            case "for": return this.ForStatement(label);
            case "with": return this.WithStatement();
            case "switch": return this.SwitchStatement();
            case "try": return this.TryStatement();
            
            default: return this.ExpressionStatement();
        }
    }
    
    Block() {
        
        var start = this.nodeStart();
        
        this.read("{");
        var list = this.StatementList(false, false);
        this.read("}");
        
        return new AST.Block(list, start, this.nodeEnd());
    }
    
    Semicolon() {
    
        var token = this.peekToken(),
            type = token.type;
        
        if (type === ";" || !(type === "}" || type === "EOF" || token.newlineBefore))
            this.read(";");
    }
    
    LabelledStatement() {
    
        var start = this.nodeStart(),
            label = this.Identifier(),
            name = label.value,
            labelSet = this.context.labelSet;
        
        if (labelSet.get(name) > 0)
            this.fail("Invalid label", label);
        
        this.read(":");
        
        labelSet.set(name, 1);
        var statement = this.Statement(name);
        labelSet.set(name, 0);
        
        return new AST.LabelledStatement(
            label, 
            statement,
            start,
            this.nodeEnd());
    }
    
    ExpressionStatement() {
    
        var start = this.nodeStart(),
            expr = this.Expression();
        
        this.Semicolon();
        
        return new AST.ExpressionStatement(expr, start, this.nodeEnd());
    }
    
    EmptyStatement() {
    
        var start = this.nodeStart();
        
        this.Semicolon();
        
        return new AST.EmptyStatement(start, this.nodeEnd());
    }
    
    VariableStatement() {
    
        var node = this.VariableDeclaration(false);
        
        this.Semicolon();
        node.end = this.nodeEnd();
        
        return node;
    }
    
    VariableDeclaration(noIn) {
    
        var start = this.nodeStart(),
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
        
        return new AST.VariableDeclaration(kind, list, start, this.nodeEnd());
    }
    
    VariableDeclarator(noIn, isConst) {
    
        var start = this.nodeStart(),
            pattern = this.BindingPattern(),
            init = null;
        
        if ((!noIn && pattern.type !== "Identifier") || this.peek() === "=") {
        
            // NOTE: Patterns must have initializers when not in declaration
            // section of a for statement
            
            this.read("=");
            init = this.AssignmentExpression(noIn);
            
        } else if (isConst) {
        
            this.fail("Missing const initializer", pattern);
        }
        
        return new AST.VariableDeclarator(pattern, init, start, this.nodeEnd());
    }
    
    ReturnStatement() {
    
        if (!this.context.isFunction)
            this.fail("Return statement outside of function");
        
        var start = this.nodeStart();
        
        this.read("return");
        var value = this.peekEnd() ? null : this.Expression();
        
        this.Semicolon();
        
        return new AST.ReturnStatement(value, start, this.nodeEnd());
    }
    
    BreakStatement() {
    
        var start = this.nodeStart(),
            context = this.context,
            labelSet = context.labelSet;
        
        this.read("break");
        var label = this.peekEnd() ? null : this.Identifier();
        this.Semicolon();
        
        var node = new AST.BreakStatement(label, start, this.nodeEnd());
        
        if (label) {
        
            if (labelSet.get(label.value) === 0)
                this.fail("Invalid label", label);
                
        } else if (context.loopDepth === 0 && context.switchDepth === 0) {
        
            this.fail("Break not contained within a switch or loop", node);
        }
        
        return node;
    }
    
    ContinueStatement() {
    
        var start = this.nodeStart(),
            context = this.context,
            labelSet = context.labelSet;
        
        this.read("continue");
        var label = this.peekEnd() ? null : this.Identifier();
        this.Semicolon();
        
        var node = new AST.ContinueStatement(label, start, this.nodeEnd());
        
        if (label) {
        
            if (labelSet.get(label.value) !== 2)
                this.fail("Invalid label", label);
                
        } else if (context.loopDepth === 0) {
        
            this.fail("Continue not contained within a loop", node);
        }
        
        return node;
    }

    ThrowStatement() {
    
        var start = this.nodeStart();
        
        this.read("throw");
        
        var expr = this.peekEnd() ? null : this.Expression();
        
        if (expr === null)
            this.fail("Missing throw expression");
        
        this.Semicolon();
        
        return new AST.ThrowStatement(expr, start, this.nodeEnd());
    }
    
    DebuggerStatement() {
    
        var start = this.nodeStart();
        
        this.read("debugger");
        this.Semicolon();
        
        return new AST.DebuggerStatement(start, this.nodeEnd());
    }
    
    IfStatement() {
    
        var start = this.nodeStart();
        
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
        
        return new AST.IfStatement(test, body, elseBody, start, this.nodeEnd());
    }
    
    DoWhileStatement(label) {
    
        var start = this.nodeStart(),
            body, 
            test;
        
        if (label) 
            this.setLoopLabel(label);
        
        this.read("do");
        
        this.context.loopDepth += 1;
        body = this.Statement();
        this.context.loopDepth -= 1;
        
        this.read("while");
        this.read("(");
        
        test = this.Expression();
        
        this.read(")");
        
        return new AST.DoWhileStatement(body, test, start, this.nodeEnd());
    }
    
    WhileStatement(label) {
    
        var start = this.nodeStart();
        
        if (label) 
            this.setLoopLabel(label);
        
        this.read("while");
        this.read("(");
        var expr = this.Expression();
        this.read(")");
        
        this.context.loopDepth += 1;
        var statement = this.Statement();
        this.context.loopDepth -= 1;
        
        return new AST.WhileStatement(
            expr, 
            statement, 
            start, 
            this.nodeEnd());
    }
    
    ForStatement(label) {
    
        var start = this.nodeStart(),
            init = null,
            test,
            step;
        
        if (label) 
            this.setLoopLabel(label);
        
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
        
        this.context.loopDepth += 1;
        var statement = this.Statement();
        this.context.loopDepth -= 1;
        
        return new AST.ForStatement(
            init, 
            test, 
            step, 
            statement, 
            start, 
            this.nodeEnd());
    }
    
    ForInStatement(init, start) {
    
        this.checkForInit(init, "in");
        
        this.read("in");
        var expr = this.Expression();
        this.read(")");
        
        this.context.loopDepth += 1;
        var statement = this.Statement();
        this.context.loopDepth -= 1;
        
        return new AST.ForInStatement(
            init, 
            expr, 
            statement, 
            start, 
            this.nodeEnd());
    }
    
    ForOfStatement(init, start) {
    
        this.checkForInit(init, "of");
        
        this.readKeyword("of");
        var expr = this.AssignmentExpression();
        this.read(")");
        
        this.context.loopDepth += 1;
        var statement = this.Statement();
        this.context.loopDepth -= 1;
        
        return new AST.ForOfStatement(
            init, 
            expr, 
            statement, 
            start, 
            this.nodeEnd());
    }
    
    WithStatement() {
    
        var start = this.nodeStart();
        
        this.read("with");
        this.read("(");
        
        var node = new AST.WithStatement(
            this.Expression(), 
            (this.read(")"), this.Statement()),
            start,
            this.nodeEnd());
            
        this.addStrictError("With statement is not allowed in strict mode", node);
        
        return node;
    }
    
    SwitchStatement() {
    
        var start = this.nodeStart();
        
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
                    this.fail("Switch statement cannot have more than one default", node);
                
                hasDefault = true;
            }
            
            cases.push(node);
        }
        
        this.context.switchDepth -= 1;
        this.read("}");
        
        return new AST.SwitchStatement(head, cases, start, this.nodeEnd());
    }
    
    SwitchCase() {
    
        var start = this.nodeStart(),
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
        
        return new AST.SwitchCase(expr, list, start, this.nodeEnd());
    }
    
    TryStatement() {
    
        var start = this.nodeStart();
        
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
        
        return new AST.TryStatement(tryBlock, handler, fin, start, this.nodeEnd());
    }
    
    CatchClause() {
    
        var start = this.nodeStart();
        
        this.read("catch");
        this.read("(");
        var param = this.BindingPattern();
        this.read(")");
        
        return new AST.CatchClause(param, this.Block(), start, this.nodeEnd());
    }
    
    // === Declarations ===
    
    StatementList(prologue, isModule) {
    
        var list = [],
            element,
            node,
            dir;
        
        // TODO: is this wrong for braceless statement lists?
        while (this.peekUntil("}")) {
        
            list.push(element = this.Declaration(isModule));
            
            // Check for directives
            if (prologue) {
            
                if (element.type === "ExpressionStatement" &&
                    element.expression.type === "String") {
                
                    // Get the non-escaped literal text of the string
                    node = element.expression;
                    dir = this.input.slice(node.start + 1, node.end - 1);

                    // Check for strict mode
                    if (dir === "use strict")
                        this.setStrict(true);
                        
                } else {
                
                    prologue = false;
                }
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
        node.end = this.nodeEnd();
        
        return node;
    }
    
    // === Functions ===
    
    FunctionDeclaration() {
    
        var start = this.nodeStart(),
            kind = "",
            tok;
        
        tok = this.peekToken();
        
        if (tok.type === "IDENTIFIER" && isFunctionModifier(tok.value)) {
        
            this.read();
            kind = tok.value;
        }
        
        this.read("function");
        
        if (!kind && this.peek() === "*") {
            
            this.read();
            kind = "generator";
        }
        
        this.pushContext(true);
        this.context.functionType = kind;
        
        var ident = this.BindingIdentifier(),
            params = this.FormalParameters(),
            body = this.FunctionBody();

        this.checkParameters(params);
        this.popContext();
        
        return new AST.FunctionDeclaration(
            kind,
            ident,
            params,
            body,
            start,
            this.nodeEnd());
    }
    
    FunctionExpression() {
    
        var start = this.nodeStart(),
            ident = null,
            kind = "",
            tok;
        
        tok = this.peekToken();
        
        if (tok.type === "IDENTIFIER" && isFunctionModifier(tok.value)) {
        
            this.read();
            kind = tok.value;
        }
        
        this.read("function");
        
        if (!kind && this.peek() === "*") {
            
            this.read();
            kind = "generator";
        }
        
        this.pushContext(true);
        this.context.functionType = kind;
        
        if (this.peek() !== "(")
            ident = this.BindingIdentifier();
        
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
            this.nodeEnd());
    }
    
    MethodDefinition(name) {
    
        var start = name ? name.start : this.nodeStart(),
            kind = "",
            val;
        
        if (!name && this.peek("name") === "*") {
        
            this.read();
            
            kind = "generator";
            name = this.PropertyName();
        
        } else {
        
            if (!name)
                name = this.PropertyName();
            
            if (name.type === "Identifier" && this.peek("name") !== "(") {
            
                val = name.value;
                
                if (val === "get" || val === "set" || isFunctionModifier(val)) {
                
                    kind = name.value;
                    name = this.PropertyName();
                }
            }
        }
        
        this.pushContext(true);
        
        if (kind === "generator" || isFunctionModifier(kind))
            this.context.functionType = kind;
        
        var params = kind === "get" || kind === "set" ?
            this.AccessorParameters(kind) :
            this.FormalParameters();
        
        var body = this.FunctionBody();
        
        this.checkParameters(params);
        this.popContext();
        
        return new AST.MethodDefinition(
            kind,
            name,
            params,
            body,
            start,
            this.nodeEnd());
    }
    
    AccessorParameters(kind) {
    
        var list = [];
        
        this.read("(");
        
        if (kind === "set")
            list.push(this.FormalParameter(false));
        
        this.read(")");
        
        return list;
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
            
            list.push(this.FormalParameter(true));
        }
        
        this.read(")");
        
        return list;
    }
    
    FormalParameter(allowDefault) {
    
        var start = this.nodeStart(),
            pattern = this.BindingPattern(),
            init = null;
        
        if (allowDefault && this.peek() === "=") {
        
            this.read("=");
            init = this.AssignmentExpression();
        }
        
        return new AST.FormalParameter(pattern, init, start, this.nodeEnd());
    }
    
    RestParameter() {
    
        var start = this.nodeStart();
        
        this.read("...");
        
        return new AST.RestParameter(this.BindingIdentifier(), start, this.nodeEnd());
    }
    
    FunctionBody() {
        
        this.context.functionBody = true;
        
        var start = this.nodeStart();
        
        this.read("{");
        var statements = this.StatementList(true, false);
        this.read("}");
        
        return new AST.FunctionBody(statements, start, this.nodeEnd());
    }
    
    ArrowFunctionHead(kind, formals, start) {
    
        // Context must have been pushed by caller
        this.context.isFunction = true;
        this.context.functionType = kind;
        
        // Transform and validate formal parameters
        var params = this.checkArrowParameters(formals);
        
        return new AST.ArrowFunctionHead(params, start, this.nodeEnd());
    }
    
    ArrowFunctionBody(head, noIn) {
    
        this.read("=>");
        
        var params = head.parameters,
            start = head.start,
            kind = this.context.functionType;
        
        // Use function body context even if parsing expression body form
        this.context.functionBody = true;
        
        var body = this.peek() === "{" ?
            this.FunctionBody() :
            this.AssignmentExpression(noIn);
        
        this.popContext();
        
        return new AST.ArrowFunction(kind, params, body, start, this.nodeEnd());
    }
    
    // === Classes ===
    
    ClassDeclaration() {
    
        var start = this.nodeStart(),
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
            this.nodeEnd());
    }
    
    ClassExpression() {
    
        var start = this.nodeStart(), 
            ident = null,
            base = null;
        
        this.read("class");
        
        if (this.peek() === "IDENTIFIER")
            ident = this.BindingIdentifier();
        
        if (this.peek() === "extends") {
        
            this.read();
            base = this.MemberExpression(true);
        }
        
        return new AST.ClassExpression(
            ident, 
            base, 
            this.ClassBody(), 
            start, 
            this.nodeEnd());
    }
    
    ClassBody() {
        
        var start = this.nodeStart(),
            nameSet = new IntMap, 
            staticSet = new IntMap,
            list = [],
            node;
        
        this.pushContext(false);
        this.setStrict(true);
        this.read("{");
        
        while (this.peekUntil("}", "name")) {
        
            list.push(node = this.ClassElement());
            this.checkPropertyName(node.method, node.static ? staticSet : nameSet);
        }
        
        this.read("}");
        this.popContext();
        
        return new AST.ClassBody(list, start, this.nodeEnd());
    }
    
    ClassElement() {
    
        var start = this.nodeStart(),
            isStatic = false;
        
        // Check for static modifier
        if (this.peekToken("name").value === "static" &&
            this.peekAt("name", 1) !== "(") {
        
            isStatic = true;
            this.read();
        }
        
        var method = this.MethodDefinition(),
            name = method.name;
        
        if (isStatic) {
        
            if (name.type === "Identifier" && name.value === "prototype")
                this.fail("Invalid prototype property in class definition", name);
            
        } else {
        
            if (name.type === "Identifier" && name.value === "constructor" && method.kind !== "")
                this.fail("Invalid constructor property in class definition", name);
        }
        
        return new AST.ClassElement(isStatic, method, start, this.nodeEnd());
    }
    
    // === Modules ===
    
    ModuleDefinition() {
    
        var start = this.nodeStart(),
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
                this.nodeEnd());
            
        } else if (this.peekKeyword("from")) {
    
            this.read();
            target = this.ModuleSpecifier();
            this.Semicolon();
        
            return new AST.ModuleImport(
                ident,
                target,
                start,
                this.nodeEnd());
        }
        
        return new AST.ModuleDeclaration(
            ident,
            this.ModuleBody(),
            start,
            this.nodeEnd());
    }
    
    ModuleDeclaration() {
        
        var start = this.nodeStart();
        
        this.readKeyword("module");
        
        return new AST.ModuleDeclaration(
            this.BindingIdentifier(),
            this.ModuleBody(),
            start,
            this.nodeEnd());
    }
    
    ModuleBody() {
    
        this.pushContext(false);
        this.setStrict(true);
        
        var start = this.nodeStart();
        
        this.read("{");
        var list = this.StatementList(true, true);
        this.read("}");
        
        this.popContext();
        
        return new AST.ModuleBody(list, start, this.nodeEnd());
    }
    
    ModuleSpecifier() {
    
        return this.peek() === "STRING" ? this.String() : this.ModulePath();
    }
    
    ImportDeclaration() {
    
        var start = this.nodeStart(),
            ident,
            from;
        
        this.read("import");
        
        switch (this.peek()) {
        
            case "IDENTIFIER":
            
                ident = this.BindingIdentifier();
                this.readKeyword("from");
                from = this.ModuleSpecifier();
                this.Semicolon();
                
                return new AST.ImportDefaultDeclaration(ident, from, start, this.nodeEnd());
            
            case "STRING":
            
                from = this.ModuleSpecifier();
                this.Semicolon();
                
                return new AST.ImportDeclaration(null, from, start, this.nodeEnd());
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
        
        return new AST.ImportDeclaration(list, from, start, this.nodeEnd());
    }
    
    ImportSpecifier() {
    
        var start = this.nodeStart(),
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
        
            this.checkBindingTarget(remote);
        }
        
        return new AST.ImportSpecifier(remote, local, start, this.nodeEnd());
    }
    
    ExportDeclaration() {
    
        var start = this.nodeStart(),
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
                
                if (this.peekFunctionModifier()) {
                
                    binding = this.FunctionDeclaration();
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
        
        return new AST.ExportDeclaration(binding, start, this.nodeEnd());
    }
    
    ExportsList() {
    
        var start = this.nodeStart(),
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
        
        return new AST.ExportsList(list, from, start, this.nodeEnd());
    }
    
    ExportSpecifier() {
    
        var start = this.nodeStart(),
            local = this.IdentifierName(),
            remote = null;
        
        if (this.peekKeyword("as")) {
        
            this.read();
            remote = this.IdentifierName();
        }
        
        return new AST.ExportSpecifier(local, remote, start, this.nodeEnd());
    }
    
    ModulePath() {
    
        var start = this.nodeStart(),
            path = [];
        
        while (true) {
        
            path.push(this.Identifier());
            
            if (this.peek() === ".") this.read();
            else break;
        }
        
        return new AST.ModulePath(path, start, this.nodeEnd());
    }
    
}

// Add externally defined methods
Object.assign(Parser.prototype, Transform.prototype);
Object.assign(Parser.prototype, Validate.prototype);
