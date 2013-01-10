"use strict";

var Scanner = require("./Scanner.js").Scanner,
    Transform = require("./Transform.js").Transform,
    Validate = require("./Validate.js").Validate;

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

// Returns a copy of the specified token
function copyToken(token) {

    return {
        type: token.type,
        value: token.value,
        newlineBefore: token.newlineBefore,
        start: token.start,
        end: token.end,
        regexFlags: token.regexFlags,
        templateEnd: token.templateEnd
    };
}

// Adds methods to the Parser prototype
function mixin(source) {

    Object.keys(source.prototype).forEach(function(k) { 
    
        Parser.prototype[k] = source.prototype[k];
    });
}

function Parser(input, offset) {

    var scanner = new Scanner(input, offset);
        
    this.scanner = scanner;
    this.input = input;
    
    this.peek0 = null;
    this.peek1 = null;
    this.endOffset = scanner.offset;
    
    this.contextStack = [];
    this.pushContext(false);
}

Parser.prototype = {

    get startOffset() {
    
        return this.peekToken().start;
    },
    
    parseScript: function() { 
    
        return this.Script();
    },
    
    parseModule: function() {
    
        return this.Module();
    },
    
    nextToken: function(context) {
    
        var scanner = this.scanner,
            type = null;
        
        while (!type || type === "COMMENT")
            type = scanner.next(context);
        
        return scanner;
    },
    
    readToken: function(type, context) {
    
        var token = this.peek0 || this.nextToken(context);
        
        this.peek0 = this.peek1;
        this.peek1 = null;
        this.endOffset = token.end;
        
        if (type && token.type !== type)
            this.fail("Unexpected token " + token.type, token);
        
        return token;
    },
    
    read: function(type, context) {
    
        return this.readToken(type, context).type;
    },
    
    peekToken: function(context, index) {
    
        if (index === 0 || index === void 0) {
        
            return this.peek0 || (this.peek0 = this.nextToken(context));
        
        } else if (index === 1) {
        
            if (this.peek1) {
            
                return this.peek1;
            
            } else if (this.peek0) {
            
                this.peek0 = copyToken(this.peek0);
                return this.peek1 = this.nextToken(context);
            }
        }
        
        throw new Error("Invalid lookahead");
    },
    
    peek: function(context, index) {
    
        return this.peekToken(context, index).type;
    },
    
    unpeek: function() {
    
        if (this.peek0) {
        
            this.scanner.offset = this.peek0.start;
            this.peek0 = null;
            this.peek1 = null;
        }
    },
    
    peekUntil: function(type, context) {
    
        var tok = this.peek(context);
        return tok !== "EOF" && tok !== type ? tok : null;
    },
    
    fail: function(msg, loc) {
    
        var pos = this.scanner.position(loc || this.peek0);
        throw new SyntaxError(msg + " (line " + pos.line + ", col " + pos.col + ")");
    },
    
    readKeyword: function(word) {
    
        var token = this.readToken();
        
        if (token.type === word || (token.type === "IDENTIFIER" && token.value === word))
            return token;
        
        this.fail("Unexpected token " + token.type, token);
    },
    
    peekKeyword: function(word, noNewlineBefore) {
    
        var token = this.peekToken();
        
        if (token.type === word)
            return true;
        
        return  token.type === word ||
                token.type === "IDENTIFIER" && 
                token.value === word && 
                !(noNewlineBefore && token.newlineBefore);
    },
    
    // Context management
    pushContext: function(isFunction, isStrict) {
    
        this.context = { 
            
            strict: isStrict || (this.context ? this.context.strict : false),
            isFunction: isFunction,
            labelSet: {},
            switchDepth: 0,
            invalidNodes: null
        };
        
        this.contextStack.push(this.context);
        this.scanner.strict = this.context.strict;
    },
    
    popContext: function() {
    
        this.contextStack.pop();
        this.context = this.contextStack[this.contextStack.length - 1];
        this.scanner.strict = this.context ? this.context.strict : false;
    },
    
    setStrict: function() {
    
        this.context.strict = true;
        this.scanner.strict = true;
    },
    
    maybeEnd: function() {
    
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
    },
    
    peekModule: function(allowURL) {
    
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
    },
    
    addInvalidNode: function(node, error) {
    
        var context = this.context,
            list = context.invalidNodes;
        
        node.error = error;
        
        if (!list) context.invalidNodes = [node];
        else list.push(node);
    },
    
    // === Top Level ===
    
    Script: function() {
    
        var start = this.startOffset,
            statements = this.StatementList(true, false);
        
        return { 
            type: "Script", 
            statements: statements,
            start: start,
            end: this.endOffset
        };
    },
    
    Module: function() {
    
        // Modules are always strict
        this.setStrict();
        
        var start = this.startOffset,
            statements = this.StatementList(true, true);
        
        return { 
            type: "Module", 
            statements: statements,
            start: start,
            end: this.endOffset
        };
    },
    
    // === Expressions ===
    
    Expression: function(noIn) {
    
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
            
            if (list === null) {
            
                list = [expr];
                
                expr = { 
                    type: "SequenceExpression", 
                    expressions: list, 
                    start: start,
                    end: -1
                };
            }
            
            list.push(this.AssignmentExpression(noIn));
        }
        
        if (list)
            expr.end = this.endOffset;
        
        return expr;
    },
    
    AssignmentExpression: function(noIn) {
    
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
        
        return {
        
            type: "AssignmentExpression",
            operator: this.read(),
            left: left,
            right: this.AssignmentExpression(noIn),
            start: start,
            end: this.endOffset
        };
    },
    
    SpreadAssignment: function(noIn) {
    
        if (this.peek() === "...") {
        
            var start = this.startOffset;
            
            this.read();
            
            return {
                type: "SpreadExpression",
                expression: this.AssignmentExpression(noIn),
                start: start,
                end: this.endOffset
            };
        }
        
        return this.AssignmentExpression(noIn);
    },
    
    YieldExpression: function() {
    
        this.read("yield");
        
        var delegate = false;
        
        if (this.peek() === "*") {
        
            this.read();
            delegate = true;
        }
        
        return {
            type: "YieldExpression",
            delegate: delegate,
            expression: this.AssignmentExpression()
        };  
    },
    
    ConditionalExpression: function(noIn) {
    
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
        
        return {
        
            type: "ConditionalExpression",
            test: left,
            consequent: middle,
            alternate: right,
            start: start,
            end: this.endOffset
        };
    },
    
    BinaryExpression: function(noIn) {
    
        return this.PartialBinaryExpression(this.UnaryExpression(), 0, noIn);
    },
    
    PartialBinaryExpression: function(lhs, minPrec, noIn) {
    
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
            
            lhs = {
            
                type: "BinaryExpression",
                operator: op,
                left: lhs,
                right: rhs,
                start: lhs.start,
                end: rhs.end
            };
        }
        
        return lhs;
    },
    
    UnaryExpression: function() {
    
        var start = this.startOffset,
            type = this.peek(),
            token,
            expr;
        
        if (isIncrement(type)) {
        
            this.read();
            expr = this.MemberExpression(true);
            this.checkAssignTarget(expr);
            
            return {
            
                type: "UpdateExpression", 
                operator: type, 
                expression: expr,
                prefix: true,
                start: start,
                end: this.endOffset
            };
        }
        
        if (isUnary(type)) {
        
            this.read();
            expr = this.UnaryExpression();
            
            if (type === "delete" && this.context.strict && expr.type === "Identifier")
                this.fail("Cannot delete unqualified property in strict mode", expr);
            
            return {
            
                type: "UnaryExpression",
                operator: type,
                expression: expr,
                start: start,
                end: this.endOffset
            };
        }
        
        expr = this.MemberExpression(true);
        token = this.peekToken("div");
        type = token.type;
        
        // Check for postfix operator
        if (isIncrement(type) && !token.newlineBefore) {
        
            this.read();
            this.checkAssignTarget(expr);
            
            return {
            
                type: "UpdateExpression",
                operator: type,
                expression: expr,
                prefix: false,
                start: start,
                end: this.endOffset
            };
        }
        
        return expr;
    },
    
    MemberExpression: function(allowCall) {
    
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
                    
                    expr = { 
                    
                        type: "MemberExpression", 
                        object: expr, 
                        property: this.Identifier(true),
                        computed: false,
                        start: start,
                        end: this.endOffset
                    };
                    
                    break;
                
                case "[":
                
                    this.read();
                    prop = this.Expression();
                    this.read("]");
                    
                    expr = { 
                    
                        type: "MemberExpression", 
                        object: expr, 
                        property: prop,
                        computed: true,
                        start: start,
                        end: this.endOffset
                    };
        
                    break;
                
                case "(":
                    
                    if (!allowCall) {
                    
                        exit = true;
                        break;
                    }
                    
                    expr = {
                    
                        type: "CallExpression",
                        callee: expr,
                        arguments: this.ArgumentList(),
                        start: start,
                        end: this.endOffset
                    };
                    
                    break;
                
                case "TEMPLATE":
                
                    expr = {
                    
                        type: "TaggedTemplateExpression",
                        tag: expr,
                        template: this.TemplateExpression(),
                        start: start,
                        end: this.endOffset
                    };
                    
                    break;
                
                default:
                
                    if (expr.type === "SuperExpression")
                        this.fail("Invalid super expression", expr);
                    
                    exit = true;
                    break;
            }
        }
        
        return expr;
    },
    
    NewExpression: function() {
    
        var start = this.startOffset;
        
        this.read("new");
        
        var expr = this.MemberExpression(false),
            args = this.peek("div") === "(" ? this.ArgumentList() : null;
        
        return {
            type: "NewExpression",
            callee: expr,
            arguments: args,
            start: start,
            end: this.endOffset
        };
    },
    
    SuperExpression: function() {
    
        var start = this.startOffset;
        
        this.read("super");
        
        return { 
            type: "SuperExpression", 
            start: start,
            end: this.endOffset
        };
    },
    
    ArgumentList: function() {
    
        var list = [];
        
        this.read("(");
        
        while (this.peekUntil(")")) {
        
            if (list.length > 0)
                this.read(",");
            
            list.push(this.SpreadAssignment());
        }
        
        this.read(")");
        
        return list;
    },
    
    PrimaryExpression: function() {
    
        var tok = this.peekToken(),
            type = tok.type,
            start = tok.start;
        
        switch (type) {
            
            case "function": return this.FunctionExpression();
            case "class": return this.ClassExpression();
            case "[": return this.ArrayExpression();
            case "{": return this.ObjectExpression();
            case "(": return this.ParenExpression();
            case "TEMPLATE": return this.TemplateExpression();
            case "NUMBER": return this.Number();
            case "STRING": return this.String();
            
            case "IDENTIFIER":
            
                return this.peek("div", 1) === "=>" ?
                    this.ArrowFunction(this.BindingIdentifier(), null, start) :
                    this.Identifier();
            
            case "REGEX":
            
                this.read();
                
                return {
                    type: "RegularExpression",
                    value: tok.value,
                    start: tok.start,
                    end: tok.end,
                    flags: tok.regexFlags
                };
            
            case "null":
            
                this.read();
                
                return { 
                    type: "Null", 
                    value: null, 
                    start: tok.start, 
                    end: tok.end 
                };
            
            case "true":
            case "false":
            
                this.read();
                
                return { 
                    type: "Boolean", 
                    value: (type === "true"), 
                    start: tok.start, 
                    end: tok.end
                };
            
            case "this":
            
                this.read();
                
                return {
                    type: "ThisExpression",
                    start: tok.start,
                    end: tok.end
                };
        }
        
        this.fail("Unexpected token " + type);
    },
    
    Identifier: function(name) {
    
        var token = this.readToken("IDENTIFIER", name ? "name" : null);
        
        return {
            type: "Identifier",
            value: token.value,
            start: token.start,
            end: token.end
        };
    },
    
    String: function() {
    
        var token = this.readToken("STRING");
        
        return {
            type: "String",
            value: token.value,
            start: token.start,
            end: token.end
        };
    },
    
    Number: function() {
    
        var token = this.readToken("NUMBER");
        
        return {
            type: "Number",
            value: token.value,
            start: token.start,
            end: token.end
        };
    },
    
    Template: function() {
    
        var token = this.readToken("TEMPLATE", "template");
        
        return {
            type: "Template",
            value: token.value,
            templateEnd: token.templateEnd,
            start: token.start,
            end: token.end
        };
    },
    
    BindingIdentifier: function() {
    
        var node = this.Identifier();
        
        this.checkBindingIdent(node);
        return node;
    },
    
    BindingPattern: function() {
    
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
    },
    
    ParenExpression: function() {

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
        
        // Look for generator comprehensions
        if (expr && this.peek() === "for")
            return this.GeneratorComprehension(expr, start);
        
        // Look for a trailing rest formal parameter within an arrow formal list
        if (!rest && this.peek() === "," && this.peek(null, 1) === "...") {
        
            this.read();
            rest = this.RestParameter();
        }
        
        this.read(")");
        
        // Determine whether this is a paren expression or an arrow function
        if (expr === null || rest !== null || this.peek("div") === "=>")
            return this.ArrowFunction(expr, rest, start);
        
        return {
            type: "ParenExpression",
            expression: expr,
            start: start,
            end: this.endOffset
        };
    },
    
    ObjectExpression: function() {
    
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
        
        return { 
            type: "ObjectExpression", 
            properties: list,
            start: start,
            end: this.endOffset
        };
    },
    
    PropertyDefinition: function(nameSet) {
        
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
                
                node = {
                    type: "PropertyDefinition",
                    name: this.PropertyName(),
                    expression: (this.read(), this.AssignmentExpression()),
                    start: start,
                    end: this.endOffset
                };
                
                break;
            
            case "=":
            
                this.unpeek();
                
                node = {
                    type: "CoveredPatternProperty",
                    name: this.Identifier(),
                    pattern: null,
                    init: (this.read(), this.AssignmentExpression()),
                    start: start,
                    end: this.endOffset
                };
                
                this.addInvalidNode(node, "Invalid property definition in object literal");
                
                break;
                
            default:
            
                // Re-read token as an identifier
                this.unpeek();
            
                node = {
                    type: "PropertyDefinition",
                    name: this.Identifier(),
                    expression: null,
                    start: start,
                    end: this.endOffset
                };
                
                break;
        }
        
        // Check for duplicate names
        if (this.isDuplicateName(flag, nameSet[name = "." + node.name.value]))
            this.addInvalidNode(node, "Duplicate property names in object literal");
        
        // Set name flag
        nameSet[name] |= flag;
        
        return node;
    },
    
    PropertyName: function() {
    
        var type = this.peek("name");
        
        switch (type) {
        
            case "IDENTIFIER": return this.Identifier();
            case "STRING": return this.String();
            case "NUMBER": return this.Number();
        }
        
        this.fail("Unexpected token " + type);
    },
    
    MethodDefinition: function() {
    
        var start = this.startOffset,
            modifier = "",
            isStrict = true,
            gen = false,
            params,
            name;
        
        if (this.peek("name") === "*") {
        
            this.read();
            
            modifier = "*";
            gen = true;
            name = this.PropertyName();
        
        } else {
        
            name = this.PropertyName();
            
            if (name.type === "Identifier" && 
                this.peek("name") !== "(" &&
                (name.value === "get" || name.value === "set")) {
            
                modifier = name.value;
                name = this.PropertyName();
                isStrict = false;
            }
        }
        
        return {
            type: "MethodDefinition",
            modifier: modifier,
            name: name,
            generator: gen,
            params: (params = this.FormalParameters()),
            body: this.FunctionBody(params, isStrict),
            start: start,
            end: this.endOffset
        };
    },
    
    ArrayExpression: function() {
    
        var start = this.startOffset,
            list = [],
            comma = false,
            next,
            type;
        
        this.read("[");
        
        while (type = this.peekUntil("]")) {
            
            if (type === "for" && 
                list.length === 1 && 
                next.type !== "SpreadExpression") {
            
                return this.ArrayComprehension(list[0], start);
                
            } else if (type === ",") {
            
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
        
        return { 
            type: "ArrayExpression", 
            elements: list,
            trailingComma: comma,
            start: start,
            end: this.endOffset
        };
    },
    
    ArrayComprehension: function(expr, start) {
    
        var list = [], 
            test = null;
        
        while (this.peek() === "for")
            list.push(this.ComprehensionFor());
        
        if (this.peek() === "if") {
        
            this.read();
            test = this.Expression();
        }
        
        this.read("]");
        
        return {
            type: "ArrayComprehension",
            expression: expr,
            list: list,
            test: test,
            start: start,
            end: this.endOffset
        };
    },
    
    GeneratorComprehension: function(expr, start) {
    
        var list = [], 
            test = null;
        
        while (this.peek() === "for")
            list.push(this.ComprehensionFor());
        
        if (this.peek() === "if") {
        
            this.read();
            test = this.Expression();
        }
        
        this.read(")");
        
        return {
            type: "GeneratorComprehension",
            expression: expr,
            list: list,
            test: test,
            start: start,
            end: this.endOffset
        };
    },
    
    ComprehensionFor: function() {
    
        this.read("for");
        
        return {
            type: "ComprehensionFor",
            binding: this.BindingPattern(),
            of: (this.readKeyword("of"), this.Expression())
        };
    },
    
    TemplateExpression: function() {
        
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
        
        return { 
            type: "TemplateExpression", 
            literals: lit, 
            substitutions: sub,
            start: start,
            end: this.endOffset
        };
    },
    
    // === Statements ===
    
    Statement: function() {
    
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
    },
    
    StatementWithLabel: function(label) {
    
        var name = label && label.value || "",
            labelSet = this.context.labelSet,
            stmt;
        
        if (!labelSet[name]) labelSet[name] = 1;
        else if (label) this.fail("Invalid label", label);
        
        labelSet[name] += 1;
        stmt = this.Statement();
        labelSet[name] -= 1;
        
        return stmt;
    },
    
    Block: function() {
        
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
    },
    
    Semicolon: function() {
    
        var token = this.peekToken(),
            type = token.type;
        
        if (type === ";" || !(type === "}" || type === "EOF" || token.newlineBefore))
            this.read(";");
    },
    
    LabelledStatement: function() {
    
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
    },
    
    ExpressionStatement: function() {
    
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
    },
    
    EmptyStatement: function() {
    
        var start = this.startOffset;
        
        this.Semicolon();
        
        return { 
            type: "EmptyStatement", 
            start: start,
            end: this.endOffset
        };
    },
    
    VariableStatement: function() {
    
        var node = this.VariableDeclaration(false);
        
        this.Semicolon();
        node.end = this.endOffset;
        
        return node;
    },
    
    VariableDeclaration: function(noIn) {
    
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
    },
    
    VariableDeclarator: function(noIn, isConst) {
    
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
    },
    
    ReturnStatement: function() {
    
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
    },
    
    BreakOrContinueStatement: function() {
    
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
    },
    
    ThrowStatement: function() {
    
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
    },
    
    DebuggerStatement: function() {
    
        var start = this.startOffset;
        
        this.read("debugger");
        this.Semicolon();
        
        return { 
            type: "DebuggerStatement",
            start: start,
            end: this.endOffset
        };
    },
    
    IfStatement: function() {
    
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
    },
    
    DoWhileStatement: function() {
    
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
    },
    
    WhileStatement: function() {
    
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
    },
    
    ForStatement: function() {
    
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
    },
    
    ForInStatement: function(init, start) {
    
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
    },
    
    ForOfStatement: function(init, start) {
    
        this.checkForInit(init, "of");
        
        this.readKeyword("of");
        var expr = this.Expression();
        this.read(")");
        
        return {
            type: "ForOfStatement",
            left: init,
            right: expr,
            body: this.StatementWithLabel(),
            start: start,
            end: this.endOffset
        };
    },
    
    WithStatement: function() {
    
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
    },
    
    SwitchStatement: function() {
    
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
    },
    
    Case: function() {
    
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
    },
    
    TryStatement: function() {
    
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
    },
    
    Catch: function() {
    
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
    },
    
    // === Declarations ===
    
    StatementList: function(prologue, isModule) {
    
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
    },
    
    Declaration: function(isModule) {
    
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
    },
    
    LexicalDeclaration: function() {
    
        var node = this.VariableDeclaration(false);
        
        this.Semicolon();
        node.end = this.endOffset;
        
        return node;
    },
    
    // === Functions ===
    
    FunctionDeclaration: function() {
    
        var start = this.startOffset,
            gen = false,
            params;
        
        this.read("function");
        
        if (this.peek() === "*") {
            
            this.read();
            gen = true;
        }
        
        return { 
            type: "FunctionDeclaration", 
            generator: gen,
            ident: this.BindingIdentifier(),
            params: (params = this.FormalParameters()),
            body: this.FunctionBody(params, gen),
            start: start,
            end: this.endOffset
        };
    },
    
    FunctionExpression: function() {
    
        var start = this.startOffset,
            gen = false,
            params;
        
        this.read("function");
        
        if (this.peek() === "*") {
            
            this.read();
            gen = true;
        }
        
        return { 
            type: "FunctionExpression", 
            generator: gen,
            ident: this.peek() !== "(" ? this.BindingIdentifier() : null,
            params: (params = this.FormalParameters()),
            body: this.FunctionBody(params, gen),
            start: start,
            end: this.endOffset
        };
    },
    
    FormalParameters: function() {
    
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
    },
    
    FormalParameter: function() {
    
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
    },
    
    RestParameter: function() {
    
        var start = this.startOffset;
        
        this.read("...");
        
        return { 
            type: "RestParameter", 
            ident: this.BindingIdentifier(),
            start: start,
            end: this.endOffset
        };
    },
    
    FunctionBody: function(params, isStrict) {
    
        this.pushContext(true, isStrict);
        
        var start = this.startOffset;
        
        this.read("{");
        var statements = this.StatementList(true);
        this.read("}");
        
        this.checkParameters(params);
        
        this.popContext();
        
        return {
            type: "FunctionBody",
            statements: statements,
            start: start,
            end: this.endOffset
        };
    },
    
    ArrowFunction: function(formals, rest, start) {
    
        this.read("=>");
        
        var params = this.transformFormals(formals), 
            body;
        
        if (rest)
            params.push(rest);
        
        if (this.peek() === "{") {
        
            body = this.FunctionBody(params, true);
            
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
    },
    
    // === Modules ===
    
    ModuleDeclaration: function() {
        
        var start = this.startOffset;
        
        this.readKeyword("module");
        
        if (this.peek() === "STRING") {
        
            return {
                type: "ModuleRegistration",
                url: this.String(),
                body: this.ModuleBody(),
                start: start,
                end: this.endOffset
            };
        }
        
        var ident = this.BindingIdentifier(),
            spec;
        
        if (this.peek() === "=") {
        
            this.read();
            spec = this.peek() === "STRING" ? this.String() : this.BindingPath();
            this.Semicolon();
            
            return {
                type: "ModuleAlias",
                ident: ident,
                specifier: spec,
                start: start,
                end: this.endOffset
            };
        }
        
        return { 
            type: "ModuleDeclaration", 
            ident: ident, 
            body: this.ModuleBody(),
            start: start,
            end: this.endOffset
        };
    },
    
    ModuleBody: function() {
    
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
    },
    
    ImportDeclaration: function() {
    
        var start = this.startOffset,
            binding,
            from;
        
        this.read("import");
        
        binding = this.peek() === "{" ?
            this.ImportSpecifierSet() :
            this.Identifier();
        
        this.readKeyword("from");
        from = this.peek() === "STRING" ? this.String() : this.BindingPath();
        this.Semicolon();
        
        return { 
            type: "ImportDeclaration",
            binding: binding,
            from: from,
            start: start,
            end: this.endOffset
        };
    },
    
    ImportSpecifierSet: function() {
        
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
    },
    
    ImportSpecifier: function() {
    
        var start = this.startOffset,
            name = this.Identifier(),
            ident = null;
        
        if (this.peek() === ":") {
        
            this.read();
            ident = this.BindingIdentifier();
        }
        
        return { 
            type: "ImportSpecifier", 
            name: name, 
            ident: ident,
            start: start,
            end: this.endOffset
        };
    },
    
    ExportDeclaration: function() {
    
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
            
                if (this.peekModule(false)) {
                
                    binding = this.ModuleDeclaration();
                
                } else {
                
                    binding = this.Identifier();
                    maybeFrom = true;
                }
                
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
                from = this.peek() === "STRING" ? this.String() : this.BindingPath();
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
    },
    
    ExportSpecifierSet: function() {
    
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
    },
    
    ExportSpecifier: function() {
    
        var start = this.startOffset,
            ident = this.Identifier(),
            path = null;
            
        if (this.peek() === ":") {
        
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
    },
    
    BindingPath: function() {
    
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
    },
    
    // === Classes ===
    
    ClassDeclaration: function() {
    
        var start = this.startOffset;
        
        this.read("class");
        
        return this.ClassLiteral("ClassDeclaration", this.BindingIdentifier(), start);
    },
    
    ClassExpression: function() {
    
        var start = this.startOffset, 
            ident = null;
        
        this.read("class");
        
        if (this.peek() === "IDENTIFIER")
            ident = this.BindingIdentifier();
        
        return this.ClassLiteral("ClassExpression", ident, start);
    },
    
    ClassLiteral: function(type, ident, start) {
    
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
    },
    
    ClassBody: function() {
    
        this.pushContext(false, true);
        
        var start = this.startOffset,
            nameSet = {}, 
            list = [];
        
        this.read("{");
        
        while (this.peekUntil("}", "name"))
            list.push(this.ClassElement(nameSet));
        
        this.read("}");
        
        this.popContext();
        
        return {
            type: "ClassBody",
            elements: list,
            start: start,
            end: this.endOffset
        };
    },
    
    ClassElement: function(nameSet) {
    
        var node = this.MethodDefinition(),
            flag = PROP_NORMAL,
            name;
        
        switch (node.modifier) {
        
            case "get": flag = PROP_GET; break;
            case "set": flag = PROP_SET; break;
        }
        
        // Check for duplicate names
        if (this.isDuplicateName(flag, nameSet[name = "." + node.name.value]))
            this.fail("Duplicate element name in class definition.", node);
        
        // Set name flag
        nameSet[name] |= flag;
        
        return node;
    }
    
    
};

// Add externally defined methods
mixin(Transform);
mixin(Validate);

exports.Parser = Parser;