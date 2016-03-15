import * as AST from "./AST.js";
import { Scanner } from "./Scanner.js";
import { Transform } from "./Transform.js";
import { Validate } from "./Validate.js";

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

// Returns true if the value is a method definition keyword
function isMethodKeyword(value) {

    switch (value) {

        case "get":
        case "set":
        case "static":
            return true;
    }

    return false;
}

// Returns true if the supplied meta property pair is valid
function isValidMeta(left, right) {

    switch (left) {

        case "new":
            return right === "target";
    }

    return false;
}

// Returns true if the value is a known directive
function isDirective(value) {

    return value === "use strict";
}

// Returns the value of the specified token, if it is an identifier and does not
// contain any unicode escapes
function keywordFromToken(token) {

    if (token.type === "IDENTIFIER" && token.end - token.start === token.value.length)
        return token.value;

    return "";
}

// Returns the value of the specified node, if it is an Identifier and does not
// contain any unicode escapes
function keywordFromNode(node) {

    if (node.type === "Identifier" && node.end - node.start === node.value.length)
        return node.value;

    return "";
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

    constructor(parent) {

        this.parent = parent;
        this.mode = "";
        this.isFunction = false;
        this.functionBody = false;
        this.isGenerator = false;
        this.isAsync = false;
        this.isMethod = false;
        this.isConstructor = false;
        this.hasYieldAwait = false;
        this.labelMap = null;
        this.switchDepth = 0;
        this.loopDepth = 0;
        this.invalidNodes = [];
    }
}

class ParseResult {

    constructor(input, lineMap, ast) {

        this.input = input;
        this.lineMap = lineMap;
        this.ast = ast;
        this.scopeTree = null;
    }

    locate(offset) {

        return this.lineMap.locate(offset);
    }

    createSyntaxError(message, node) {

        let loc = this.lineMap.locate(node.start),
            err = new SyntaxError(message);

        err.line = loc.line;
        err.column = loc.column;
        err.lineOffset = loc.lineOffset;
        err.startOffset = node.start;
        err.endOffset = node.end;
        err.sourceText = this.input;

        return err;
    }

}

class AtNameSet {

    constructor(parser) {

        this.parser = parser;
        this.names = {};
    }

    add(node, kind) {

        if (node.type !== "AtName")
            return true;

        let name = node.value,
            code = 3;

        switch (kind) {

            case "get": code = 1; break;
            case "set": code = 2; break;
        }

        let current = this.names[name];

        if (current & code)
            this.parser.fail("Duplicate private name definition", node);

        this.names[name] = current | code;
    }
}

export class Parser {

    parse(input, options) {

        options = options || {};

        this.onASI = options.onASI || null;

        let scanner = new Scanner(input);

        this.scanner = scanner;
        this.input = input;

        this.peek0 = null;
        this.peek1 = null;
        this.tokenStash = new Scanner;
        this.tokenEnd = scanner.offset;

        this.context = new Context(null, false);
        this.setStrict(false);

        let ast = options.module ? this.Module() : this.Script();

        return new ParseResult(this.input, this.scanner.lineMap, ast);
    }

    nextToken(context) {

        let scanner = this.scanner,
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

        let token = this.peek0 || this.nextToken(context);

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

        let tok = this.peek(context);
        return tok !== "EOF" && tok !== type ? tok : null;
    }

    readKeyword(word) {

        let token = this.readToken();

        if (token.type === word || keywordFromToken(token) === word)
            return token;

        this.unexpected(token);
    }

    peekKeyword(word) {

        let token = this.peekToken();
        return token.type === word || keywordFromToken(token) === word;
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

    peekYield() {

        return this.context.functionBody &&
            this.context.isGenerator &&
            this.peekKeyword("yield");
    }

    peekAwait() {

        if (this.peekKeyword("await")) {

            if (this.context.functionBody && this.context.isAsync)
                return true;

            if (this.isModule)
                this.fail("Await is reserved within modules");
        }

        return false;
    }

    peekAsync() {

        let token = this.peekToken();

        if (keywordFromToken(token) !== "async")
            return "";

        token = this.peekTokenAt("div", 1);

        if (token.newlineBefore)
            return "";

        let type = token.type;

        return type === "function" ? type : "";
    }

    peekEnd() {

        let token = this.peekToken();

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

        let type = token.type, msg;

        msg = type === "EOF" ?
            "Unexpected end of input" :
            "Unexpected token " + token.type;

        this.fail(msg, token);
    }

    fail(msg, node) {

        if (!node)
            node = this.peekToken();

        let result = new ParseResult(this.input, this.scanner.lineMap, null);
        throw result.createSyntaxError(msg, node);
    }

    unwrapParens(node) {

        // Remove any parenthesis surrounding the target
        for (; node.type === "ParenExpression"; node = node.expression);
        return node;
    }


    // == Context Management ==

    pushContext(isArrow) {

        let parent = this.context,
            c = new Context(parent);

        this.context = c;

        if (parent.mode === "strict")
            c.mode = "strict";

        if (isArrow) {

            c.isMethod = parent.isMethod;
            c.isConstructor = parent.isConstructor;
        }

        return c;
    }

    pushMaybeContext() {

        let parent = this.context,
            c = this.pushContext();

        c.isFunction = parent.isFunction;
        c.isGenerator = parent.isGenerator;
        c.isAsync = parent.isAsync;
        c.isMethod = parent.isMethod;
        c.isConstructor = parent.isConstructor;
        c.functionBody = parent.functionBody;
    }

    popContext(collapse) {

        let context = this.context,
            parent = context.parent;

        // If collapsing into parent context, copy invalid nodes into parent
        if (collapse)
            context.invalidNodes.forEach(node => parent.invalidNodes.push(node));
        else
            this.checkInvalidNodes();

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
        this.context.invalidNodes.push({ node, strict: Boolean(strict) });
    }

    setLabel(label, value) {

        let m = this.context.labelMap;

        if (!m)
            m = this.context.labelMap = Object.create(null);

        m[label] = value;
    }

    getLabel(label) {

        let m = this.context.labelMap;
        return (m && m[label]) | 0;
    }

    setFunctionType(kind) {

        let c = this.context,
            a = false,
            g = false;

        switch (kind) {

            case "async": a = true; break;
            case "generator": g = true; break;
            case "async-generator": a = g = true; break;
        }

        c.isFunction = true;
        c.isAsync = a;
        c.isGenerator = g;
    }

    // === Top Level ===

    Script() {

        this.isModule = false;
        this.pushContext();

        let start = this.nodeStart(),
            statements = this.StatementList(true);

        this.popContext();

        return new AST.Script(statements, start, this.nodeEnd());
    }

    Module() {

        this.isModule = true;
        this.pushContext();
        this.setStrict(true);

        let start = this.nodeStart(),
            list = this.ModuleItemList();

        this.popContext();

        return new AST.Module(list, start, this.nodeEnd());
    }

    // === Expressions ===

    Expression(noIn) {

        let expr = this.AssignmentExpression(noIn),
            list = null;

        while (this.peek("div") === ",") {

            this.read();

            if (list === null)
                expr = new AST.SequenceExpression(list = [expr], expr.start, -1);

            list.push(this.AssignmentExpression(noIn));
        }

        if (list)
            expr.end = this.nodeEnd();

        return expr;
    }

    AssignmentExpression(noIn, allowSpread) {

        let start = this.nodeStart(),
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

        this.checkAssignmentTarget(node, false);

        return new AST.AssignmentExpression(
            this.read(),
            node,
            this.AssignmentExpression(noIn),
            start,
            this.nodeEnd());
    }

    YieldExpression(noIn) {

        let start = this.nodeStart(),
            delegate = false,
            expr = null;

        this.readKeyword("yield");

        if (!this.peekEnd() && this.peek() !== ",") {

            if (this.peek() === "*") {

                this.read();
                delegate = true;
            }

            expr = this.AssignmentExpression(noIn);
        }

        this.context.hasYieldAwait = true;

        return new AST.YieldExpression(
            expr,
            delegate,
            start,
            this.nodeEnd());
    }

    ConditionalExpression(noIn) {

        let start = this.nodeStart(),
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

        let prec = 0,
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

        let start = this.nodeStart(),
            type = this.peek(),
            token,
            expr;

        if (isIncrement(type)) {

            this.read();
            expr = this.MemberExpression(true);
            this.checkAssignmentTarget(this.unwrapParens(expr), true);

            return new AST.UpdateExpression(type, expr, true, start, this.nodeEnd());
        }

        if (this.peekAwait()) {

            type = "await";
            this.context.hasYieldAwait = true;
        }

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

        let token = this.peekToken(),
            start = token.start,
            arrowType = "",
            isSuper = false,
            exit = false,
            expr,
            prop;

        switch (token.type) {

            case "super":

                expr = this.SuperKeyword();
                isSuper = true;
                break;

            case "new":

                expr = this.peekAt("", 1) === "." ?
                    this.MetaProperty() :
                    this.NewExpression();

                break;

            case "::":

                if (allowCall) {

                    expr = null;
                    break;
                }

            default:

                expr = this.PrimaryExpression();
                break;
        }

        while (!exit) {

            token = this.peekToken("div");

            switch (token.type) {

                case ".":

                    this.read();

                    prop = this.peek("name") === "ATNAME" && !isSuper ?
                        this.AtName() :
                        this.IdentifierName();

                    expr = new AST.MemberExpression(
                        expr,
                        prop,
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

                    if (isSuper) {

                        if (!allowCall || !this.context.isConstructor)
                            this.fail("Invalid super call");
                    }

                    if (!allowCall) {

                        exit = true;
                        break;
                    }

                    if (keywordFromNode(expr) === "async" && !token.newlineBefore) {

                        arrowType = "async";
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

                    if (isSuper)
                        this.fail();

                    expr = new AST.TaggedTemplateExpression(
                        expr,
                        this.TemplateExpression(),
                        start,
                        this.nodeEnd());

                    break;

                case "::":

                    if (isSuper)
                        this.fail();

                    if (!allowCall) {

                        exit = true;
                        break;
                    }

                    this.read();

                    if (expr && this.peek() === "new") {

                        this.read();
                        expr = new AST.BindNewExpression(expr, start, this.nodeEnd());

                    } else {

                        expr = new AST.BindExpression(
                            expr,
                            this.MemberExpression(false),
                            start,
                            this.nodeEnd());

                        if (!expr.left)
                            this.checkUnaryBind(expr.right);
                    }

                    break;

                default:

                    if (isSuper)
                        this.fail();

                    exit = true;
                    break;
            }

            isSuper = false;
        }

        return expr;
    }

    NewExpression() {

        let start = this.nodeStart();

        this.read("new");

        let expr = this.MemberExpression(false),
            args = this.peek("div") === "(" ? this.ArgumentList() : null;

        return new AST.NewExpression(expr, args, start, this.nodeEnd());
    }

    MetaProperty() {

        let token = this.readToken(),
            start = token.start,
            left = token.type === "IDENTIFIER" ? token.value : token.type,
            right;

        this.read(".");

        token = this.readToken("IDENTIFIER", "name");
        right = token.value;

        if (!isValidMeta(left, right))
            this.fail("Invalid meta property", token);

        return new AST.MetaProperty(left, right, start, this.nodeEnd());
    }

    SuperKeyword() {

        let token = this.readToken("super"),
            node = new AST.SuperKeyword(token.start, token.end);

        if (!this.context.isMethod)
            this.fail("Super keyword outside of method", node);

        return node;
    }

    ArgumentList() {

        let list = [];

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

        let token = this.peekToken(),
            type = token.type,
            start = this.nodeStart(),
            next,
            value;

        switch (type) {

            case "function": return this.FunctionExpression();
            case "class": return this.ClassExpression();
            case "TEMPLATE": return this.TemplateExpression();
            case "NUMBER": return this.NumberLiteral();
            case "STRING": return this.StringLiteral();
            case "{": return this.ObjectLiteral();
            case "(": return this.ParenExpression();
            case "[": return this.ArrayLiteral();

            case "IDENTIFIER":

                value = keywordFromToken(token);
                next = this.peekTokenAt("div", 1);

                if (!next.newlineBefore) {

                    if (next.type === "=>") {

                        this.pushContext(true);
                        return this.ArrowFunctionHead("", this.BindingIdentifier(), start);

                    } else if (next.type === "function") {

                        return this.FunctionExpression();

                    } else if (next.type === "IDENTIFIER" && value === "async") {

                        this.read();
                        this.pushContext(true);

                        let ident = this.BindingIdentifier();

                        next = this.peekToken();

                        if (next.type !== "=>" || next.newlineBefore)
                            this.fail();

                        return this.ArrowFunctionHead(value, ident, start);
                    }
                }

                return this.Identifier(true);

            case "REGEX": return this.RegularExpression();

            case "null":
                this.read();
                return new AST.NullLiteral(token.start, token.end);

            case "true":
            case "false":
                this.read();
                return new AST.BooleanLiteral(type === "true", token.start, token.end);

            case "this":
                this.read();
                return new AST.ThisExpression(token.start, token.end);
        }

        this.unexpected(token);
    }

    Identifier(isVar) {

        let token = this.readToken("IDENTIFIER"),
            node = new AST.Identifier(token.value, isVar ? "variable" : "", token.start, token.end);

        this.checkIdentifier(node);
        return node;
    }

    IdentifierName() {

        let token = this.readToken("IDENTIFIER", "name");
        return new AST.Identifier(token.value, "", token.start, token.end);
    }

    AtName() {

        // TODO:  Only allow within class?  What about nested classes?
        let token = this.readToken("ATNAME");
        return new AST.AtName(token.value, token.start, token.end);
    }

    StringLiteral() {

        let token = this.readToken("STRING"),
            node = new AST.StringLiteral(token.value, token.start, token.end);

        if (token.strictError)
            this.addStrictError(token.strictError, node);

        return node;
    }

    NumberLiteral() {

        let token = this.readToken("NUMBER"),
            node = new AST.NumberLiteral(token.number, token.start, token.end);

        if (token.strictError)
            this.addStrictError(token.strictError, node);

        return node;
    }

    TemplatePart() {

        let token = this.readToken("TEMPLATE", "template"),
            end = token.templateEnd,
            node;

        node = new AST.TemplatePart(
            token.value,
            this.scanner.rawValue(token.start + 1, token.end - (end ? 1 : 2)),
            end,
            token.start,
            token.end);

        if (token.strictError)
            this.addStrictError(token.strictError, node);

        return node;
    }

    RegularExpression() {

        // TODO:  Validate regular expression against RegExp grammar (21.2.1)?
        let token = this.readToken("REGEX");

        return new AST.RegularExpression(
            token.value,
            token.regexFlags,
            token.start,
            token.end);
    }

    BindingIdentifier() {

        let token = this.readToken("IDENTIFIER"),
            node = new AST.Identifier(token.value, "", token.start, token.end);

        this.checkBindingTarget(node);
        return node;
    }

    BindingPattern() {

        let node;

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

        let start = this.nodeStart(),
            next = null,
            rest = null;

        // Push a new context in case we are parsing an arrow function
        this.pushMaybeContext();

        this.read("(");

        if (this.peek() === ")") {

            next = this.peekTokenAt("", 1);

            if (next.newlineBefore || next.type !== "=>")
                this.fail();

            this.read(")");

            return this.ArrowFunctionHead("", null, start);
        }

        let expr = this.Expression();

        this.read(")");
        next = this.peekToken("div");

        if (!next.newlineBefore && next.type === "=>")
            return this.ArrowFunctionHead("", expr, start);

        // Collapse this context into its parent
        this.popContext(true);

        return new AST.ParenExpression(expr, start, this.nodeEnd());
    }

    ObjectLiteral() {

        let start = this.nodeStart(),
            comma = false,
            list = [],
            node;

        this.read("{");

        while (this.peekUntil("}", "name")) {

            if (!comma && node) {

                this.read(",");
                comma = true;

            } else {

                comma = false;
                list.push(node = this.PropertyDefinition());
            }
        }

        this.read("}");

        return new AST.ObjectLiteral(list, comma, start, this.nodeEnd());
    }

    PropertyDefinition() {

        if (this.peek("name") === "*")
            return this.MethodDefinition(null, "");

        let start = this.nodeStart(),
            node,
            name;

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

        return this.MethodDefinition(name, "");
    }

    PropertyName(allowAtNames) {

        let token = this.peekToken("name");

        switch (token.type) {

            case "IDENTIFIER": return this.IdentifierName();
            case "STRING": return this.StringLiteral();
            case "NUMBER": return this.NumberLiteral();
            case "[": return this.ComputedPropertyName();
            case "ATNAME":
                if (allowAtNames) return this.AtName();
                else break;
        }

        this.unexpected(token);
    }

    ComputedPropertyName() {

        let start = this.nodeStart();

        this.read("[");
        let expr = this.AssignmentExpression();
        this.read("]");

        return new AST.ComputedPropertyName(expr, start, this.nodeEnd());
    }

    ArrayLiteral() {

        let start = this.nodeStart(),
            comma = false,
            list = [],
            type;

        this.read("[");

        while (type = this.peekUntil("]")) {

            if (type === ",") {

                this.read();
                comma = true;
                list.push(null);

            } else {

                list.push(this.AssignmentExpression(false, true));
                comma = false;

                if (this.peek() !== "]") {

                    this.read(",");
                    comma = true;
                }
            }
        }

        this.read("]");

        return new AST.ArrayLiteral(list, comma, start, this.nodeEnd());
    }

    TemplateExpression() {

        let atom = this.TemplatePart(),
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

        let next;

        switch (this.peek()) {

            case "IDENTIFIER":

                if (this.peekAt("div", 1) === ":")
                    return this.LabelledStatement();

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

        let start = this.nodeStart();

        this.read("{");
        let list = this.StatementList(false);
        this.read("}");

        return new AST.Block(list, start, this.nodeEnd());
    }

    Semicolon() {

        let token = this.peekToken(),
            type = token.type;

        if (type === ";") {

            this.read();

        } else if (type === "}" || type === "EOF" || token.newlineBefore) {

            if (this.onASI && !this.onASI(token))
                this.unexpected(token);

        } else {

            this.unexpected(token);
        }
    }

    LabelledStatement() {

        let start = this.nodeStart(),
            label = this.Identifier(),
            name = label.value;

        if (this.getLabel(name) > 0)
            this.fail("Invalid label", label);

        this.read(":");

        this.setLabel(name, 1);
        // TODO: Annex B allows a function declaration here in sloppy mode
        let statement = this.Statement(name);
        this.setLabel(name, 0);

        return new AST.LabelledStatement(
            label,
            statement,
            start,
            this.nodeEnd());
    }

    ExpressionStatement() {

        let start = this.nodeStart(),
            expr = this.Expression();

        this.Semicolon();

        return new AST.ExpressionStatement(expr, start, this.nodeEnd());
    }

    EmptyStatement() {

        let start = this.nodeStart();

        this.Semicolon();

        return new AST.EmptyStatement(start, this.nodeEnd());
    }

    VariableStatement() {

        let node = this.VariableDeclaration(false);

        this.Semicolon();
        node.end = this.nodeEnd();

        return node;
    }

    VariableDeclaration(noIn) {

        let start = this.nodeStart(),
            token = this.peekToken(),
            kind = token.type,
            list = [];

        switch (kind) {

            case "var":
            case "const":
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

            list.push(this.VariableDeclarator(noIn, kind));

            if (this.peek() === ",") this.read();
            else break;
        }

        return new AST.VariableDeclaration(kind, list, start, this.nodeEnd());
    }

    VariableDeclarator(noIn, kind) {

        let start = this.nodeStart(),
            pattern = this.BindingPattern(),
            init = null;

        if ((!noIn && pattern.type !== "Identifier") || this.peek() === "=") {

            // NOTE: Patterns must have initializers when not in declaration
            // section of a for statement

            this.read();
            init = this.AssignmentExpression(noIn);

        } else if (kind === "const") {

            this.fail("Missing const initializer", pattern);
        }

        return new AST.VariableDeclarator(pattern, init, start, this.nodeEnd());
    }

    ReturnStatement() {

        if (!this.context.isFunction)
            this.fail("Return statement outside of function");

        let start = this.nodeStart();

        this.read("return");
        let value = this.peekEnd() ? null : this.Expression();

        this.Semicolon();

        return new AST.ReturnStatement(value, start, this.nodeEnd());
    }

    BreakStatement() {

        let start = this.nodeStart(),
            context = this.context;

        this.read("break");
        let label = this.peekEnd() ? null : this.Identifier();
        this.Semicolon();

        let node = new AST.BreakStatement(label, start, this.nodeEnd());

        if (label) {

            if (this.getLabel(label.value) === 0)
                this.fail("Invalid label", label);

        } else if (context.loopDepth === 0 && context.switchDepth === 0) {

            this.fail("Break not contained within a switch or loop", node);
        }

        return node;
    }

    ContinueStatement() {

        let start = this.nodeStart(),
            context = this.context;

        this.read("continue");
        let label = this.peekEnd() ? null : this.Identifier();
        this.Semicolon();

        let node = new AST.ContinueStatement(label, start, this.nodeEnd());

        if (label) {

            if (this.getLabel(label.value) !== 2)
                this.fail("Invalid label", label);

        } else if (context.loopDepth === 0) {

            this.fail("Continue not contained within a loop", node);
        }

        return node;
    }

    ThrowStatement() {

        let start = this.nodeStart();

        this.read("throw");

        let expr = this.peekEnd() ? null : this.Expression();

        if (expr === null)
            this.fail("Missing throw expression");

        this.Semicolon();

        return new AST.ThrowStatement(expr, start, this.nodeEnd());
    }

    DebuggerStatement() {

        let start = this.nodeStart();

        this.read("debugger");
        this.Semicolon();

        return new AST.DebuggerStatement(start, this.nodeEnd());
    }

    IfStatement() {

        let start = this.nodeStart();

        this.read("if");
        this.read("(");

        let test = this.Expression(),
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

        let start = this.nodeStart(),
            body,
            test;

        if (label)
            this.setLabel(label, 2);

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

        let start = this.nodeStart();

        if (label)
            this.setLabel(label, 2);

        this.read("while");
        this.read("(");
        let expr = this.Expression();
        this.read(")");

        this.context.loopDepth += 1;
        let statement = this.Statement();
        this.context.loopDepth -= 1;

        return new AST.WhileStatement(
            expr,
            statement,
            start,
            this.nodeEnd());
    }

    ForStatement(label) {

        let start = this.nodeStart(),
            init = null,
            async = false,
            test,
            step;

        if (label)
            this.setLabel(label, 2);

        this.read("for");

        if (this.peekAwait()) {

            this.read();
            async = true;
        }

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

        if (async || init && this.peekKeyword("of"))
            return this.ForOfStatement(async, init, start);

        if (init && this.peek() === "in")
            return this.ForInStatement(init, start);

        this.read(";");
        test = this.peek() === ";" ? null : this.Expression();

        this.read(";");
        step = this.peek() === ")" ? null : this.Expression();

        this.read(")");

        this.context.loopDepth += 1;
        let statement = this.Statement();
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
        let expr = this.Expression();
        this.read(")");

        this.context.loopDepth += 1;
        let statement = this.Statement();
        this.context.loopDepth -= 1;

        return new AST.ForInStatement(
            init,
            expr,
            statement,
            start,
            this.nodeEnd());
    }

    ForOfStatement(async, init, start) {

        this.checkForInit(init, "of");

        this.readKeyword("of");
        let expr = this.AssignmentExpression();
        this.read(")");

        this.context.loopDepth += 1;
        let statement = this.Statement();
        this.context.loopDepth -= 1;

        return new AST.ForOfStatement(
            async,
            init,
            expr,
            statement,
            start,
            this.nodeEnd());
    }

    WithStatement() {

        let start = this.nodeStart();

        this.read("with");
        this.read("(");

        let node = new AST.WithStatement(
            this.Expression(),
            (this.read(")"), this.Statement()),
            start,
            this.nodeEnd());

        this.addStrictError("With statement is not allowed in strict mode", node);

        return node;
    }

    SwitchStatement() {

        let start = this.nodeStart();

        this.read("switch");
        this.read("(");

        let head = this.Expression(),
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

        let start = this.nodeStart(),
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

            list.push(this.StatementListItem());
        }

        return new AST.SwitchCase(expr, list, start, this.nodeEnd());
    }

    TryStatement() {

        let start = this.nodeStart();

        this.read("try");

        let tryBlock = this.Block(),
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

        let start = this.nodeStart();

        this.read("catch");
        this.read("(");
        let param = this.BindingPattern();
        this.read(")");

        return new AST.CatchClause(param, this.Block(), start, this.nodeEnd());
    }

    // === Declarations ===

    StatementList(prologue) {

        let list = [],
            node,
            expr,
            dir;

        // TODO: is this wrong for braceless statement lists?
        while (this.peekUntil("}")) {

            node = this.StatementListItem();

            // Check for directives
            if (prologue) {

                if (node.type === "ExpressionStatement" &&
                    node.expression.type === "StringLiteral") {

                    // Get the non-escaped literal text of the string
                    expr = node.expression;
                    dir = this.input.slice(expr.start + 1, expr.end - 1);

                    if (isDirective(dir)) {

                        node = new AST.Directive(dir, expr, node.start, node.end);

                        // Check for strict mode
                        if (dir === "use strict")
                            this.setStrict(true);
                    }

                } else {

                    prologue = false;
                }
            }

            list.push(node);
        }

        return list;
    }

    StatementListItem() {

        switch (this.peek()) {

            case "function": return this.FunctionDeclaration();
            case "class": return this.ClassDeclaration();
            case "const": return this.LexicalDeclaration();

            case "IDENTIFIER":

                if (this.peekLet())
                    return this.LexicalDeclaration();

                if (this.peekAsync() === "function")
                    return this.FunctionDeclaration();

                break;
        }

        return this.Statement();
    }

    LexicalDeclaration() {

        let node = this.VariableDeclaration(false);

        this.Semicolon();
        node.end = this.nodeEnd();

        return node;
    }

    // === Functions ===

    FunctionDeclaration() {

        let start = this.nodeStart(),
            kind = "",
            token;

        token = this.peekToken();

        if (keywordFromToken(token) === "async") {

            this.read();
            kind = "async";
        }

        this.read("function");

        if (this.peek() === "*") {

            this.read();
            kind = kind ? kind + "-generator" : "generator";
        }

        this.pushContext();
        this.setFunctionType(kind);

        let ident = this.BindingIdentifier(),
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

        let start = this.nodeStart(),
            ident = null,
            kind = "",
            token;

        token = this.peekToken();

        if (keywordFromToken(token) === "async") {

            this.read();
            kind = "async";
        }

        this.read("function");

        if (this.peek() === "*") {

            this.read();
            kind = kind ? kind + "-generator" : "generator";
        }

        this.pushContext();
        this.setFunctionType(kind);

        if (this.peek() !== "(")
            ident = this.BindingIdentifier();

        let params = this.FormalParameters(),
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

    MethodDefinition(name, kind, isClass) {

        let start = name ? name.start : this.nodeStart();

        if (!name && this.peek("name") === "*") {

            this.read();

            kind = "generator";
            name = this.PropertyName(isClass);

        } else {

            if (!name)
                name = this.PropertyName(isClass);

            let val = keywordFromNode(name);

            if (this.peek("name") !== "(") {

                if (val === "get" || val === "set" || val === "async") {

                    kind = name.value;

                    if (kind === "async" && this.peek("name") === "*") {

                        this.read();
                        kind += "-generator";
                    }

                    name = this.PropertyName();
                }
            }
        }

        this.pushContext();
        this.setFunctionType(kind);
        this.context.isMethod = true;
        this.context.isConstructor = kind === "constructor";

        let params = kind === "get" || kind === "set" ?
            this.AccessorParameters(kind) :
            this.FormalParameters();

        let body = this.FunctionBody();

        this.checkParameters(params);
        this.popContext();

        return new AST.MethodDefinition(
            false,
            kind,
            name,
            params,
            body,
            start,
            this.nodeEnd());
    }

    AccessorParameters(kind) {

        let list = [];

        this.read("(");

        if (kind === "set")
            list.push(this.FormalParameter(false));

        this.read(")");

        return list;
    }

    FormalParameters() {

        let list = [];

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

        let start = this.nodeStart(),
            pattern = this.BindingPattern(),
            init = null;

        if (allowDefault && this.peek() === "=") {

            this.read();
            init = this.AssignmentExpression();
        }

        return new AST.FormalParameter(pattern, init, start, this.nodeEnd());
    }

    RestParameter() {

        let start = this.nodeStart();

        this.read("...");

        return new AST.RestParameter(this.BindingIdentifier(), start, this.nodeEnd());
    }

    FunctionBody() {

        this.context.functionBody = true;

        let start = this.nodeStart();

        this.read("{");
        let statements = this.StatementList(true);
        this.read("}");

        return new AST.FunctionBody(statements, start, this.nodeEnd());
    }

    ArrowFunctionHead(kind, formals, start) {

        // Context must have been pushed by caller
        this.setFunctionType(kind);

        if (this.context.hasYieldAwait)
            this.fail("Invalid yield or await within arrow function head");

        // Transform and validate formal parameters
        let params = this.checkArrowParameters(formals);

        return new AST.ArrowFunctionHead(params, start, this.nodeEnd());
    }

    ArrowFunctionBody(head, noIn) {

        this.read("=>");

        let params = head.parameters,
            start = head.start,
            kind = this.context.isAsync ? "async" : "";

        // Use function body context even if parsing expression body form
        this.context.functionBody = true;

        let body = this.peek() === "{" ?
            this.FunctionBody() :
            this.AssignmentExpression(noIn);

        this.popContext();

        return new AST.ArrowFunction(kind, params, body, start, this.nodeEnd());
    }

    // === Classes ===

    ClassDeclaration() {

        let start = this.nodeStart(),
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

        let start = this.nodeStart(),
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

        let start = this.nodeStart(),
            hasConstructor = false,
            hasBlock = false,
            atNames = new AtNameSet(this),
            list = [];

        this.pushContext();
        this.setStrict(true);
        this.read("{");

        while (this.peekUntil("}", "name")) {

            let elem = this.ClassElement();

            switch (elem.type) {

                case "MethodDefinition":

                    if (elem.kind === "constructor") {

                        if (hasConstructor)
                            this.fail("Duplicate constructor definitions", elem.name);

                        hasConstructor = true;
                    }

                    atNames.add(elem.name, elem.kind);
                    break;

                case "PrivateDeclaration":
                    atNames.add(elem.name, "");
                    break;
            }

            list.push(elem);
        }

        this.read("}");
        this.popContext();

        return new AST.ClassBody(list, start, this.nodeEnd());
    }

    PrivateDeclaration(start, isStatic) {

        let name = this.AtName(),
            init = null;

        if (this.peek() === "=") {

            this.read();
            init = this.AssignmentExpression();
        }

        this.Semicolon();

        return new AST.PrivateDeclaration(isStatic, name, init, start, this.nodeEnd());
    }

    EmptyClassElement() {

        let start = this.nodeStart();

        this.read(";");

        return new AST.EmptyClassElement(start, this.nodeEnd());
    }

    ClassElement() {

        let token = this.peekToken("name"),
            start = token.start,
            isStatic = false;

        if (token.type === ";")
            return this.EmptyClassElement();

        if (token.type === "IDENTIFIER" &&
            token.value === "static") {

            switch (this.peekAt("name", 1)) {

                case "(":
                    break;

                default:
                    this.read();
                    isStatic = true;
            }
        }

        if (this.peek("name") === "ATNAME" && this.peekAt("name", 1) !== "(")
            return this.PrivateDeclaration(start, isStatic);

        token = this.peekToken("name");

        let kind = "";

        if (!isStatic && token.type === "IDENTIFIER" && token.value === "constructor")
            kind = "constructor";

        let method = this.MethodDefinition(null, kind, true),
            name = method.name;

        if (isStatic) {

            if (name.type === "Identifier" && name.value === "prototype")
                this.fail("Invalid prototype property in class definition", name);

        } else if (name.type === "Identifier" && name.value === "constructor") {

            if (method.kind !== "constructor")
                this.fail("Invalid constructor property in class definition", name);
        }

        method.start = start;
        method.static = isStatic;

        return method;
    }

    // === Modules ===

    ModuleItemList() {

        let list = [],
            type;

        while (true) {

            switch (this.peek()) {

                case "EOF": return list;
                case "import": list.push(this.ImportDeclaration()); break;
                case "export": list.push(this.ExportDeclaration()); break;
                default: list.push(this.StatementListItem()); break;
            }
        }
    }

    ImportDeclaration() {

        let start = this.nodeStart(),
            imports = null,
            from;

        this.read("import");

        switch (this.peek()) {

            case "*":
                imports = this.NamespaceImport();
                break;

            case "{":
                imports = this.NamedImports();
                break;

            case "STRING":
                from = this.StringLiteral();
                break;

            default:
                imports = this.DefaultImport();
                break;
        }

        if (!from) {

            this.readKeyword("from");
            from = this.StringLiteral();
        }

        this.Semicolon();

        return new AST.ImportDeclaration(imports, from, start, this.nodeEnd());
    }

    DefaultImport() {

        let start = this.nodeStart(),
            ident = this.BindingIdentifier(),
            extra = null;

        if (this.peek() === ",") {

            this.read();

            switch (this.peek()) {

                case "*":
                    extra = this.NamespaceImport();
                    break;

                case "{":
                    extra = this.NamedImports();
                    break;

                default:
                    this.fail();
            }
        }

        return new AST.DefaultImport(ident, extra, start, this.nodeEnd());
    }

    NamespaceImport() {

        let start = this.nodeStart(),
            ident;

        this.read("*");
        this.readKeyword("as");
        ident = this.BindingIdentifier();

        return new AST.NamespaceImport(ident, start, this.nodeEnd());
    }

    NamedImports() {

        let start = this.nodeStart(),
            list = [];

        this.read("{");

        while (this.peekUntil("}")) {

            list.push(this.ImportSpecifier());

            if (this.peek() === ",")
                this.read();
        }

        this.read("}");

        return new AST.NamedImports(list, start, this.nodeEnd());
    }

    ImportSpecifier() {

        let start = this.nodeStart(),
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

        let start = this.nodeStart(),
            decl;

        this.read("export");

        switch (this.peek()) {

            case "default":
                return this.ExportDefault(start);

            case "*":
                return this.ExportNamespace(start);

            case "{":
                return this.ExportNameList(start);

            case "var":
            case "const":
                decl = this.LexicalDeclaration();
                break;

            case "function":
                decl = this.FunctionDeclaration();
                break;

            case "class":
                decl = this.ClassDeclaration();
                break;

            case "IDENTIFIER":

                if (this.peekLet())
                    decl = this.LexicalDeclaration();
                else if (this.peekAsync() === "function")
                    decl = this.FunctionDeclaration();
                else
                    return this.ExportDefaultFrom(start);

                break;

            default:
                this.fail();
        }

        return new AST.ExportDeclaration(decl, start, this.nodeEnd());
    }

    ExportDefault(start) {

        let binding;

        this.read("default");

        switch (this.peek()) {

            case "class":
                binding = this.ClassExpression();
                break;

            case "function":
                binding = this.FunctionExpression();
                break;

            case "IDENTIFIER":

                if (this.peekAsync() === "function") {

                    binding = this.FunctionExpression();
                    break;
                }

            default:
                binding = this.AssignmentExpression();
                break;
        }

        let isDecl = this.transformDefaultExport(binding);

        if (!isDecl)
            this.Semicolon();

        return new AST.ExportDefault(binding, start, this.nodeEnd());
    }

    ExportNameList(start) {

        let list = [],
            from = null;

        this.read("{");

        while (this.peekUntil("}", "name")) {

            list.push(this.ExportSpecifier());

            if (this.peek() === ",")
                this.read();
        }

        this.read("}");

        if (this.peekKeyword("from")) {

            this.read();
            from = this.StringLiteral();

        } else {

            // Transform identifier names to identifiers
            list.forEach(node => this.transformIdentifier(node.local));
        }

        this.Semicolon();

        return new AST.ExportNameList(list, from, start, this.nodeEnd());
    }

    ExportDefaultFrom(start) {

        let name = this.Identifier();

        this.readKeyword("from");
        let from = this.StringLiteral();
        this.Semicolon();

        return new AST.ExportDefaultFrom(name, from, start, this.nodeEnd());
    }

    ExportNamespace(start) {

        let ident = null;

        this.read("*");

        if (this.peekKeyword("as")) {

            this.read();
            ident = this.BindingIdentifier();
        }

        this.readKeyword("from");
        let from = this.StringLiteral();
        this.Semicolon();

        return new AST.ExportNamespace(ident, from, start, this.nodeEnd());
    }

    ExportSpecifier() {

        let start = this.nodeStart(),
            local = this.IdentifierName(),
            remote = null;

        if (this.peekKeyword("as")) {

            this.read();
            remote = this.IdentifierName();
        }

        return new AST.ExportSpecifier(local, remote, start, this.nodeEnd());
    }

}

function mixin(target, ...sources) {

    target = target.prototype;

    let {
        getOwnPropertyNames: ownNames,
        getOwnPropertySymbols: ownSymbols,
        getOwnPropertyDescriptor: ownDesc,
        prototype: { hasOwnProperty: hasOwn } } = Object;

    sources
    .map(source => source.prototype)
    .forEach(source =>
        ownNames(source)
        .concat(ownSymbols(source))
        .filter(key => !hasOwn.call(target, key))
        .forEach(key => Object.defineProperty(target, key, ownDesc(source, key))));
}

// Add externally defined methods
mixin(Parser, Transform, Validate);
