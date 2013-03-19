import "TreeNode.js" as Node;

import Scanner from "Scanner.js";
import Transform from "Transform.js";
import Validate from "Validate.js";

// Binary operator precedence levels
var operatorPrecedence = {

    "||": 1,
    "&&": 2,
    "|": 3,
    "^": 4,
    "&": 5,
    "==": 6, "!=": 6, "===": 6, "!==": 6,
    "<=": 7, ">=": 7, ">": 7, "<": 7, "instanceof": 7, "in": 7,
    ">>>": 8, ">>": 8, "<<": 8,
    "+": 9, "-": 9,
    "*": 10, "/": 10, "%": 10
};

// Object literal property name flags
var PROP_NORMAL = 1,
    PROP_ASSIGN = 2,
    PROP_GET = 4,
    PROP_SET = 8;

// Returns true if the specified operator is an increment operator
function isIncrement(op) {

    return op === "++" || op === "--";
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

class TokenData {

    constructor(token) {
    
        this.type = token.type;
        this.value = token.value;
        this.newlineBefore = token.newlineBefore;
        this.start = token.start;
        this.end = token.end;
        this.regexFlags = token.regexFlags;
        this.templateEnd = token.templateEnd;
    }
}

export class Parser {

    constructor(input, offset) {

        var scanner = new Scanner(input, offset);
            
        this.scanner = scanner;
        this.input = input;
        
        this.peek0 = null;
        this.peek1 = null;
        this.endOffset = scanner.offset;
        
        this.contextStack = [];
        this.pushContext(false);
    }

    get startOffset() {
    
        return this.peekToken().start;
    }
    
    parseScript() { 
    
        return this.Script();
    }
    
    parseModule() {
    
        return this.Module();
    }
    
    nextToken(context) {
    
        var scanner = this.scanner,
            type = null;
        
        while (!type || type === "COMMENT")
            type = scanner.next(context);
        
        return scanner;
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
            
                this.peek0 = new TokenData(this.peek0);
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
    
    formatErrorMessage(msg, pos) {
    
        return `${ msg } (line ${ pos.line }:${ pos.column })`;
    }
    
    fail(msg, loc) {
    
        var pos = this.scanner.position(loc || this.peek0),
            err = new SyntaxError(this.formatErrorMessage(msg, pos));
        
        throw err;
    }
    
    readKeyword(word) {
    
        var token = this.readToken();
        
        if (token.type === word || (token.type === "IDENTIFIER" && token.value === word))
            return token;
        
        this.fail("Unexpected token " + token.type, token);
    }
    
    peekKeyword(word, noNewlineBefore) {
    
        var token = this.peekToken();
        
        if (token.type === word)
            return true;
        
        return  token.type === word ||
                token.type === "IDENTIFIER" && 
                token.value === word && 
                !(noNewlineBefore && token.newlineBefore);
    }
    
    // Context management
    pushContext(isFunction, isStrict) {
    
        this.context = { 
            
            strict: isStrict || (this.context ? this.context.strict : false),
            isFunction: isFunction,
            labelSet: {},
            switchDepth: 0,
            invalidNodes: null
        };
        
        this.contextStack.push(this.context);
        this.scanner.strict = this.context.strict;
    }
    
    popContext() {
    
        this.contextStack.pop();
        this.context = this.contextStack[this.contextStack.length - 1];
        this.scanner.strict = this.context ? this.context.strict : false;
    }
    
    setStrict() {
    
        this.context.strict = true;
        this.scanner.strict = true;
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
                    return true;
            }
        }
        
        return false;
    }
    
    peekModule(allowURL) {
    
        if (this.peekToken().value === "module") {
        
            var p = this.peekToken("div", 1);
            
            if (!p.newlineBefore) {
            
                switch (p.type) {
                
                    case "IDENTIFIER": return true;
                    case "STRING": return allowURL;
                }
            }
        }
        
        return false;
    }
    
    addInvalidNode(node, error) {
    
        var context = this.context,
            list = context.invalidNodes;
        
        node.error = error;
        
        if (!list) context.invalidNodes = [node];
        else list.push(node);
    }
    
    // === Top Level ===
    
    Script() {
    
        var start = this.startOffset;
        
        return new Node.Script(this.StatementList(true, false), start, this.endOffset);
    }
    
    Module() {
    
        var start = this.startOffset;
        
        // Modules are always strict
        this.setStrict();
        
        return new Node.Module(this.StatementList(true, true), start, this.endOffset);
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
                expr = new Node.SequenceExpression(list = [expr], start, -1);
            
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
        
        if (this.peek() === "yield")
            return this.YieldExpression();
        
        left = this.ConditionalExpression(noIn);
        
        // Check for assignment operator
        if (!isAssignment(this.peek("div")))
            return left;
        
        // Binding forms can be contained within parens
        for (lhs = left; lhs.type === "ParenExpression"; lhs = lhs.expression);
        
        // Make sure that left hand side is assignable
        switch (lhs.type) {
        
            case "MemberExpression":
            case "CallExpression":
                break;
                
            case "Identifier":
                this.checkAssignTarget(lhs);
                break;
        
            default:
                this.transformPattern(lhs, false);
                break;
        }
        
        return new Node.AssignmentExpression(
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
            
            return new Node.SpreadExpression(
                this.AssignmentExpression(noIn), 
                start, 
                this.endOffset);
        }
        
        return this.AssignmentExpression(noIn);
    }
    
    YieldExpression() {
    
        var start = this.startOffset,
            delegate = false;
            
        this.read("yield");
        
        if (this.peek() === "*") {
        
            this.read();
            delegate = true;
        }
        
        return new Node.YieldExpression(
            this.AssignmentExpression(), 
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
        
        return new Node.ConditionalExpression(left, middle, right, start, this.endOffset);
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
            
            prec = operatorPrecedence[next];
            
            // Exit if not a binary operator or lower precendence
            if (prec === void 0 || prec < minPrec)
                break;
            
            this.read();
            
            op = next;
            max = prec;
            rhs = this.UnaryExpression();
            
            while (next = this.peek("div")) {
            
                prec = operatorPrecedence[next];
                
                // Exit if not a binary operator or equal or higher precendence
                if (prec === void 0 || prec <= max)
                    break;
                
                rhs = this.PartialBinaryExpression(rhs, prec, noIn);
            }
            
            lhs = new Node.BinaryExpression(op, lhs, rhs, lhs.start, rhs.end);
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
            this.checkAssignTarget(expr);
            
            return new Node.UpdateExpression(type, expr, true, start, this.endOffset);
        }
        
        if (isUnary(type)) {
        
            this.read();
            expr = this.UnaryExpression();
            
            if (type === "delete" && this.context.strict && expr.type === "Identifier")
                this.fail("Cannot delete unqualified property in strict mode", expr);
            
            return new Node.UnaryExpression(type, expr, start, this.endOffset);
        }
        
        expr = this.MemberExpression(true);
        token = this.peekToken("div");
        type = token.type;
        
        // Check for postfix operator
        if (isIncrement(type) && !token.newlineBefore) {
        
            this.read();
            this.checkAssignTarget(expr);
            
            return new Node.UpdateExpression(type, expr, false, start, this.endOffset);
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
                    
                    expr = new Node.MemberExpression(
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
                    
                    expr = new Node.MemberExpression(
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
                    
                    expr = new Node.CallExpression(
                        expr, 
                        this.ArgumentList(), 
                        start, 
                        this.endOffset);
                    
                    break;
                
                case "TEMPLATE":
                
                    expr = new Node.TaggedTemplateExpression(
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
        
        var expr = this.MemberExpression(false),
            args = this.peek("div") === "(" ? this.ArgumentList() : null;
        
        return new Node.NewExpression(expr, args, start, this.endOffset);
    }
    
    SuperExpression() {
    
        var start = this.startOffset;
        this.read("super");
        
        return new Node.SuperExpression(start, this.endOffset);
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
            start = tok.start;
        
        switch (type) {
            
            case "function": return this.FunctionExpression();
            case "class": return this.ClassExpression();
            case "TEMPLATE": return this.TemplateExpression();
            case "NUMBER": return this.Number();
            case "STRING": return this.String();
            case "{": return this.ObjectExpression();
            
            case "(": return this.peek(null, 1) === "for" ? 
                this.GeneratorComprehension() :
                this.ParenExpression();
            
            case "[": return this.peek(null, 1) === "for" ?
                this.ArrayComprehension() :
                this.ArrayExpression();
            
            case "IDENTIFIER":
            
                return this.peek("div", 1) === "=>" ?
                    this.ArrowFunction(this.BindingIdentifier(), null, start) :
                    this.Identifier(true);
            
            case "REGEX":
                this.read();
                return new Node.RegularExpression(tok.value, tok.regexFlags, tok.start, tok.end);
            
            case "null":
                this.read();
                return new Node.Null(tok.start, tok.end);
            
            case "true":
            case "false":
                this.read();
                return new Node.Boolean(type === "true", tok.start, tok.end);
            
            case "this":
                this.read();
                return new Node.ThisExpression(tok.start, tok.end);
        }
        
        this.fail("Unexpected token " + type);
    }
    
    Identifier(isVar) {
    
        var token = this.readToken("IDENTIFIER"),
            context = isVar ? "variable" : "";
        
        return new Node.Identifier(token.value, context, token.start, token.end);
    }
    
    IdentifierName() {
    
        var token = this.readToken("IDENTIFIER", "name");
        return new Node.Identifier(token.value, "", token.start, token.end);
    }
    
    String() {
    
        var token = this.readToken("STRING");
        return new Node.String(token.value, token.start, token.end);
    }
    
    Number() {
    
        var token = this.readToken("NUMBER");
        return new Node.Number(token.value, token.start, token.end);
    }
    
    Template() {
    
        var token = this.readToken("TEMPLATE", "template");
        return new Node.Template(token.value, token.templateEnd, token.start, token.end);
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
                node = this.ObjectExpression();
                break;
            
            case "[":
                node = this.ArrayExpression();
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
        
        // Determine whether this is a paren expression or an arrow function
        if (expr === null || rest !== null || this.peek("div") === "=>")
            return this.ArrowFunction(expr, rest, start);
        
        return new Node.ParenExpression(expr, start, this.endOffset);
    }
    
    ObjectExpression() {
    
        var start = this.startOffset,
            list = [],
            nameSet = {};
        
        this.read("{");
        
        while (this.peekUntil("}", "name")) {
        
            if (list.length > 0)
                this.read(",");
            
            if (this.peek("name") !== "}")
                list.push(this.PropertyDefinition(nameSet));
        }
        
        this.read("}");
        
        return new Node.ObjectExpression(list, start, this.endOffset);
    }
    
    PropertyDefinition(nameSet) {
        
        var start = this.startOffset,
            flag = PROP_NORMAL, 
            node,
            name;
        
        switch (this.peek("name", 1)) {
        
            case "IDENTIFIER":
            case "STRING":
            case "NUMBER":
                
                node = this.MethodDefinition();
                
                switch (node.modifier) {
                
                    case "get": flag = PROP_GET; break;
                    case "set": flag = PROP_SET; break;
                }
                
                break;
            
            case "(":
            
                node = this.MethodDefinition();
                break;
            
            case ":":
                
                flag = PROP_ASSIGN;
                
                node = new Node.PropertyDefinition(
                    this.PropertyName(),
                    (this.read(), this.AssignmentExpression()),
                    start,
                    this.endOffset);
                
                break;
            
            case "=":
            
                this.unpeek();
                
                node = new Node.CoveredPatternProperty(
                    this.Identifier(),
                    null,
                    (this.read(), this.AssignmentExpression()),
                    start,
                    this.endOffset);
                
                this.addInvalidNode(node, "Invalid property definition in object literal");
                
                break;
                
            default:
            
                // Re-read token as an identifier
                this.unpeek();
            
                node = new Node.PropertyDefinition(
                    this.Identifier(),
                    null,
                    start,
                    this.endOffset);
                
                break;
        }
        
        // Check for duplicate names
        if (this.isDuplicateName(flag, nameSet[name = "." + node.name.value]))
            this.addInvalidNode(node, "Duplicate property names in object literal");
        
        // Set name flag
        nameSet[name] |= flag;
        
        return node;
    }
    
    PropertyName() {
    
        var type = this.peek("name");
        
        switch (type) {
        
            case "IDENTIFIER": return this.Identifier();
            case "STRING": return this.String();
            case "NUMBER": return this.Number();
        }
        
        this.fail("Unexpected token " + type);
    }
    
    MethodDefinition() {
    
        var start = this.startOffset,
            modifier = null,
            params,
            name;
        
        if (this.peek("name") === "*") {
        
            this.read();
            
            modifier = "*";
            name = this.PropertyName();
        
        } else {
        
            name = this.PropertyName();
            
            if (name.type === "Identifier" && 
                this.peek("name") !== "(" &&
                (name.value === "get" || name.value === "set")) {
            
                modifier = name.value;
                name = this.PropertyName();
            }
        }
        
        return new Node.MethodDefinition(
            modifier,
            name,
            params = this.FormalParameters(),
            this.FunctionBody(null, params, false),
            start,
            this.endOffset);
    }
    
    ArrayExpression() {
    
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
        
        return new Node.ArrayExpression(list, start, this.endOffset);
    }
    
    ArrayComprehension() {
    
        var start = this.startOffset;
        
        this.read("[");
        
        var list = this.ComprehensionQualifierList(),
            expr = this.AssignmentExpression();
        
        this.read("]");
        
        return new Node.ArrayComprehension(list, expr, start, this.endOffset);
    }
    
    GeneratorComprehension() {
    
        var start = this.startOffset;
        
        this.read("(");
        
        var list = this.ComprehensionQualifierList(),
            expr = this.AssignmentExpression();
        
        this.read(")");
        
        return new Node.GeneratorComprehension(list, expr, start, this.endOffset);
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
        
        return new Node.ComprehensionFor(
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
        
        return new Node.ComprehensionIf(test, start, this.endOffset);
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
        
        return new Node.TemplateExpression(lit, sub, start, this.endOffset);
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
    
        var name = label && label.value || "",
            labelSet = this.context.labelSet,
            stmt;
        
        if (!labelSet[name]) labelSet[name] = 1;
        else if (label) this.fail("Invalid label", label);
        
        labelSet[name] += 1;
        stmt = this.Statement();
        labelSet[name] -= 1;
        
        return stmt;
    }
    
    Block() {
        
        var start = this.startOffset;
        
        this.read("{");
        var list = this.StatementList(false);
        this.read("}");
        
        return { 
            type: "Block", 
            statements: list,
            start: start,
            end: this.endOffset
        };
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
        
        return { 
            type: "LabelledStatement", 
            label: label, 
            statement: this.StatementWithLabel(label),
            start: start,
            end: this.endOffset
        };
    }
    
    ExpressionStatement() {
    
        var start = this.startOffset,
            expr = this.Expression();
        
        this.Semicolon();
        
        return { 
            type: "ExpressionStatement", 
            expression: expr,
            directive: null,
            start: start,
            end: this.endOffset
        };
    }
    
    EmptyStatement() {
    
        var start = this.startOffset;
        
        this.Semicolon();
        
        return { 
            type: "EmptyStatement", 
            start: start,
            end: this.endOffset
        };
    }
    
    VariableStatement() {
    
        var node = this.VariableDeclaration(false);
        
        this.Semicolon();
        node.end = this.endOffset;
        
        return node;
    }
    
    VariableDeclaration(noIn) {
    
        var start = this.startOffset,
            keyword = this.peek(),
            isConst = false,
            list = [];
        
        switch (keyword) {
        
            case "var":
                break;
            
            case "const":
                isConst = true;
            
            case "let":
                break;
                
            default:
                this.fail("Expected var, const, or let");
        }
        
        this.read();
        
        while (true) {
        
            list.push(this.VariableDeclarator(noIn, isConst));
            
            if (this.peek() === ",") this.read();
            else break;
        }
        
        return { 
            type: "VariableDeclaration", 
            keyword: keyword,
            declarations: list, 
            start: start,
            end: this.endOffset
        };
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
        
        return { 
            type: "VariableDeclarator", 
            pattern: pattern, 
            init: init,
            start: start,
            end: this.endOffset
        };
    }
    
    ReturnStatement() {
    
        if (!this.context.isFunction)
            this.fail("Return statement outside of function");
        
        var start = this.startOffset;
        
        this.read("return");
        var init = this.maybeEnd() ? this.Expression() : null;
        
        this.Semicolon();
        
        return { 
            type: "ReturnStatement", 
            argument: init,
            start: start,
            end: this.endOffset
        };
    }
    
    BreakOrContinueStatement() {
    
        var start = this.startOffset,
            token = this.readToken(),
            keyword = token.type,
            labelSet = this.context.labelSet,
            label;
        
        label = this.maybeEnd() ? this.Identifier() : null;
        
        this.Semicolon();
        
        if (label) {
        
            if (!labelSet[label.value])
                this.fail("Invalid label", label);
        
        } else {
        
            // TODO: token may be mutated!
            if (!labelSet[""] && !(keyword === "break" && this.context.switchDepth > 0))
                this.fail("Invalid " + keyword + " statement", token);
        }
        
        return { 
            type: keyword === "break" ? "Break" : "Continue", 
            label: label,
            start: start,
            end: this.endOffset
        };
    }
    
    ThrowStatement() {
    
        var start = this.startOffset;
        
        this.read("throw");
        
        var expr = this.maybeEnd() ? this.Expression() : null;
        
        if (expr === null)
            this.fail("Missing throw expression");
        
        this.Semicolon();
        
        return { 
            type: "ThrowStatement", 
            expression: expr,
            start: start,
            end: this.endOffset
        };
    }
    
    DebuggerStatement() {
    
        var start = this.startOffset;
        
        this.read("debugger");
        this.Semicolon();
        
        return { 
            type: "DebuggerStatement",
            start: start,
            end: this.endOffset
        };
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
        
        return { 
            type: "IfStatement", 
            test: test, 
            consequent: body, 
            alternate: elseBody,
            start: start,
            end: this.endOffset
        };
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
        
        return { 
            type: "DoWhileStatement", 
            body: body, 
            test: test,
            start: start,
            end: this.endOffset
        };
    }
    
    WhileStatement() {
    
        var start = this.startOffset;
        
        this.read("while");
        this.read("(");
        
        return {
            type: "WhileStatement",
            test: this.Expression(),
            body: (this.read(")"), this.StatementWithLabel()),
            start: start,
            end: this.endOffset
        };
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
            case "let":
            case "const":
                init = this.VariableDeclaration(true);
                break;
            
            default:
                init = this.Expression(true);
                break;
        }
        
        if (init) {
        
            if (this.peekKeyword("in"))
                return this.ForInStatement(init, start);
        
            if (this.peekKeyword("of"))
                return this.ForOfStatement(init, start);
        }
        
        this.read(";");
        test = this.peek() === ";" ? null : this.Expression();
        
        this.read(";");
        step = this.peek() === ")" ? null : this.Expression();
        
        this.read(")");
        
        return {
            type: "ForStatement",
            init: init,
            test: test,
            update: step,
            body: this.StatementWithLabel(),
            start: start,
            end: this.endOffset
        };
    }
    
    ForInStatement(init, start) {
    
        this.checkForInit(init, "in");
        
        this.read("in");
        var expr = this.Expression();
        this.read(")");
        
        return {
            type: "ForInStatement",
            left: init,
            right: expr,
            body: this.StatementWithLabel(),
            start: start,
            end: this.endOffset
        };
    }
    
    ForOfStatement(init, start) {
    
        this.checkForInit(init, "of");
        
        this.readKeyword("of");
        var expr = this.AssignmentExpression();
        this.read(")");
        
        return {
            type: "ForOfStatement",
            left: init,
            right: expr,
            body: this.StatementWithLabel(),
            start: start,
            end: this.endOffset
        };
    }
    
    WithStatement() {
    
        if (this.context.strict)
            this.fail("With statement is not allowed in strict mode");
    
        var start = this.startOffset;
        
        this.read("with");
        this.read("(");
        
        return {
            type: "WithStatement",
            object: this.Expression(),
            body: (this.read(")"), this.Statement()),
            start: start,
            end: this.endOffset
        };
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
        
            node = this.Case();
            
            if (node.test === null) {
            
                if (hasDefault)
                    this.fail("Switch statement cannot have more than one default");
                
                hasDefault = true;
            }
            
            cases.push(node);
        }
        
        this.context.switchDepth -= 1;
        this.read("}");
        
        return {
            type: "SwitchStatement",
            descriminant: head,
            cases: cases,
            start: start,
            end: this.endOffset
        };
    }
    
    Case() {
    
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
        
        return {
            type: "SwitchCase",
            test: expr,
            consequent: list,
            start: start,
            end: this.endOffset
        };
    }
    
    TryStatement() {
    
        var start = this.startOffset;
        
        this.read("try");
        
        var tryBlock = this.Block(),
            handler = null,
            fin = null;
        
        if (this.peek() === "catch")
            handler = this.Catch();
        
        if (this.peek() === "finally") {
        
            this.read("finally");
            fin = this.Block();
        }
        
        return {
            type: "TryStatement",
            block: tryBlock,
            handler: handler,
            finalizer: fin,
            start: start,
            end: this.endOffset
        };
    }
    
    Catch() {
    
        var start = this.startOffset;
        
        this.read("catch");
        this.read("(");
    
        var param = this.BindingPattern();
        
        this.read(")");
        
        return {
            type: "CatchClause",
            param: param,
            body: this.Block(),
            start: start,
            end: this.endOffset
        };
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
                    this.setStrict();
                    
            } else {
            
                prologue = false;
            }
        }
        
        // Check for invalid nodes
        this.checkInvalidNodes();
        
        return list;
    }
    
    Declaration(isModule) {
    
        switch (this.peek()) {
            
            case "function": return this.FunctionDeclaration();
            case "class": return this.ClassDeclaration();
            case "let": 
            case "const": return this.LexicalDeclaration();
            
            case "import": return this.ImportDeclaration();
            
            case "export":
                
                if (isModule)
                    return this.ExportDeclaration();
                
                break;
            
            case "IDENTIFIER":
                
                if (this.peekModule(true))
                    return this.ModuleDeclaration();
                
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
            gen = false,
            ident,
            params;
        
        this.read("function");
        
        if (this.peek() === "*") {
            
            this.read();
            gen = true;
        }
        
        return { 
            type: "FunctionDeclaration", 
            generator: gen,
            ident: (ident = this.Identifier()),
            params: (params = this.FormalParameters()),
            body: this.FunctionBody(ident, params, false),
            start: start,
            end: this.endOffset
        };
    }
    
    FunctionExpression() {
    
        var start = this.startOffset,
            gen = false,
            ident = null,
            params;
        
        this.read("function");
        
        if (this.peek() === "*") {
            
            this.read();
            gen = true;
        }
        
        if (this.peek() !== "(")
            ident = this.Identifier();
        
        return { 
            type: "FunctionExpression", 
            generator: gen,
            ident: ident,
            params: (params = this.FormalParameters()),
            body: this.FunctionBody(ident, params, false),
            start: start,
            end: this.endOffset
        };
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
        
        return { 
            type: "FormalParameter", 
            pattern: pattern, 
            init: init,
            start: start,
            end: this.endOffset
        };
    }
    
    RestParameter() {
    
        var start = this.startOffset;
        
        this.read("...");
        
        return { 
            type: "RestParameter", 
            ident: this.BindingIdentifier(),
            start: start,
            end: this.endOffset
        };
    }
    
    FunctionBody(ident, params, isStrict) {
    
        this.pushContext(true, isStrict);
        
        var start = this.startOffset;
        
        this.read("{");
        var statements = this.StatementList(true);
        this.read("}");
        
        if (ident) this.checkBindingIdent(ident);
        this.checkParameters(params);
        
        this.popContext();
        
        return {
            type: "FunctionBody",
            statements: statements,
            start: start,
            end: this.endOffset
        };
    }
    
    ArrowFunction(formals, rest, start) {
    
        this.read("=>");
        
        var params = this.transformFormals(formals), 
            body;
        
        if (rest)
            params.push(rest);
        
        if (this.peek() === "{") {
        
            body = this.FunctionBody(null, params, true);
            
        } else {
        
            // Check parameters in the current context
            this.checkParameters(params);
            body = this.AssignmentExpression();
        }
        
        return {
            type: "ArrowFunction",
            params: params,
            body: body,
            start: start,
            end: this.endOffset
        };
    }
    
    // === Modules ===
    
    ModuleDeclaration() {
        
        var start = this.startOffset;
        
        this.readKeyword("module");
        
        return {
            type: "ModuleDeclaration",
            url: this.String(),
            body: this.ModuleBody(),
            start: start,
            end: this.endOffset
        };
    }
    
    ModuleBody() {
    
        this.pushContext(false, true);
        
        var start = this.startOffset;
        
        this.read("{");
        var list = this.StatementList(true, true);
        this.read("}");
        
        this.popContext();
        
        return {
            type: "ModuleBody", 
            statements: list,
            start: start,
            end: this.endOffset
        };
    }
    
    ImportDeclaration() {
    
        var start = this.startOffset,
            binding,
            from;
        
        this.read("import");
        
        if (this.peek() === "STRING") {
        
            from = this.String();
            this.readKeyword("as");
            binding = this.BindingIdentifier();
            this.Semicolon();
            
            return {
            
                type: "ImportAsDeclaration",
                url: from,
                ident: binding,
                start: start,
                end: this.endOffset
            };
        }
        
        binding = this.peek() === "{" ?
            this.ImportSpecifierSet() :
            this.BindingIdentifier();
        
        this.readKeyword("from");
        from = this.peek() === "STRING" ? this.String() : this.Identifier();
        this.Semicolon();
        
        return { 
            type: "ImportDeclaration",
            binding: binding,
            from: from,
            start: start,
            end: this.endOffset
        };
    }
    
    ImportSpecifierSet() {
        
        var start = this.startOffset,
            list = [];
        
        this.read("{");
        
        while (true) {
        
            list.push(this.ImportSpecifier());
            
            if (this.peek("div") === ",") this.read();
            else break;
        }
        
        this.read("}");
        
        return { 
            type: "ImportSpecifierSet", 
            specifiers: list,
            start: start,
            end: this.endOffset
        };
    }
    
    ImportSpecifier() {
    
        var start = this.startOffset,
            name = this.Identifier(),
            ident = null;
        
        if (this.peek() === ":") {
        
            this.read();
            ident = this.BindingIdentifier();
            
        } else {
        
            this.checkBindingIdent(name);
        }
        
        return { 
            type: "ImportSpecifier", 
            name: name, 
            ident: ident,
            start: start,
            end: this.endOffset
        };
    }
    
    ExportDeclaration() {
    
        var start = this.startOffset,
            binding = null,
            from = null,
            maybeFrom = false;
        
        this.read("export");
        
        switch (this.peek()) {
                
            case "var":
            case "let":
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
            
                binding = this.Identifier();
                maybeFrom = true;
                break;
            
            case "*":
            
                this.read();
                maybeFrom = true;
                break;
            
            default:
            
                binding = this.ExportSpecifierSet();
                maybeFrom = true;
                break;
        }
        
        if (maybeFrom) {
        
            if (this.peekKeyword("from")) {
            
                this.read();
                from = this.peek() === "STRING" ? this.String() : this.Identifier();
            }
            
            this.Semicolon();
        }
        
        return { 
            type: "ExportDeclaration", 
            binding: binding,
            from: from,
            start: start,
            end: this.endOffset
        };
    }
    
    ExportSpecifierSet() {
    
        var start = this.startOffset,
            list = [];
        
        this.read("{");
        
        while (true) {
        
            list.push(this.ExportSpecifier());
            
            if (this.peek("div") === ",") this.read();
            else break;
        }
        
        this.read("}");
        
        return { 
            type: "ExportSpecifierSet", 
            specifiers: list,
            start: start,
            end: this.endOffset
        };
    }
    
    ExportSpecifier() {
    
        var start = this.startOffset,
            ident = this.Identifier(),
            path = null;
            
        if (this.peek() === ":") {
        
            this.checkBindingIdent(ident);
            
            this.read();
            path = this.BindingPath();
        }
        
        return { 
            type: "ExportSpecifier", 
            ident: ident, 
            path: path,
            start: start,
            end: this.endOffset
        };
    }
    
    BindingPath() {
    
        var start = this.startOffset,
            path = [];
        
        while (true) {
        
            path.push(this.readToken("IDENTIFIER").value);
            
            if (this.peek("div") === ".") this.read();
            else break;
        }
        
        return { 
            type: "BindingPath", 
            elements: path,
            start: start,
            end: this.endOffset
        };
    }
    
    // === Classes ===
    
    ClassDeclaration() {
    
        var start = this.startOffset;
        
        this.read("class");
        
        return this.ClassLiteral("ClassDeclaration", this.BindingIdentifier(), start);
    }
    
    ClassExpression() {
    
        var start = this.startOffset, 
            ident = null;
        
        this.read("class");
        
        if (this.peek() === "IDENTIFIER")
            ident = this.BindingIdentifier();
        
        return this.ClassLiteral("ClassExpression", ident, start);
    }
    
    ClassLiteral(type, ident, start) {
    
        var base = null;
        
        if (this.peek() === "extends") {
        
            this.read();
            base = this.AssignmentExpression();
        }
        
        return {
            type: type,
            ident: ident,
            base: base,
            body: this.ClassBody(),
            start: start,
            end: this.endOffset
        };
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
        
        return {
            type: "ClassBody",
            elements: list,
            start: start,
            end: this.endOffset
        };
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
        
        switch (method.modifier) {
        
            case "get": flag = PROP_GET; break;
            case "set": flag = PROP_SET; break;
        }
        
        // Check for duplicate names
        if (this.isDuplicateName(flag, nameSet[name = "." + method.name.value]))
            this.fail("Duplicate element name in class definition.", method);
        
        // Set name flag
        nameSet[name] |= flag;
        
        return new Node.ClassElement(isStatic, method, start, this.endOffset);
    }
    
    
}


// Add externally defined methods
Object.mixin(Parser.prototype, Transform.prototype);
Object.mixin(Parser.prototype, Validate.prototype);
