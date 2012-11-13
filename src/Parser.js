"use strict";

var AbstractParser = require("./AbstractParser.js").AbstractParser,
	Scanner = require("./Scanner.js").Scanner,
	Class = require("./Class.js").Class,
	Transform = require("./Transform.js"),
	Keys = require("./Keys.js"),
	KeySet = Keys.KeySet;

var assignmentOp = new KeySet("=", "*=", "/=", "%=", "+=", "-=", ">>=", "<<=", ">>>=", "&=", "^=", "|="),
	unaryOp = new KeySet("delete", "void", "typeof", "!", "~", "+", "-"),
	incrementOp = new KeySet("++", "--"),
	equalityOp = new KeySet("==", "===", "!=", "!=="),
	relationalOp = new KeySet("<=", ">=", ">", "<", "instanceof", "in"),
	relationalOpNoIn = new KeySet("<=", ">=", ">", "<", "instanceof"),
	shiftOp = new KeySet(">>>", ">>", "<<"),
	additiveOp = new KeySet("+", "-"),
	multiplicativeOp = new KeySet("*", "/", "%");

var nameFlags = { name: true, div: false, quasi: false },
	divFlags = { name: false, div: true, quasi: false },
	quasiFlags = { name: true, div: false, quasi: true };

// Returns true if the specified name is a restricted identifier in strict mode
function isPoisonIdent(name) {

    return name === "eval" || name === "arguments";
}

// Function template for left-associative operator expressions
function BinaryOperator(op, higher) {

	var isMap = (typeof op !== "string");
	
	return function(noIn) {
	
		var endNode = this.begin(),
		    expr = this[higher](noIn), 
		    next;
		    
		while (next = this.peekDiv().type) {
		
			if (isMap && !op.has(next) || !isMap && next !== op)
				break;
			
			this.readDiv();
			
			expr = endNode({ 
			
			    type: "BinaryExpression", 
			    operator: next, 
			    left: expr, 
			    right: this[higher](noIn)
			});
		}
		
		return expr;
	};
}

var Parser = new Class(AbstractParser, {

    constructor: function() {
        
        AbstractParser.call(this, Scanner);
    },

	// Contextual Scanning Shortcuts
	readName: function(type) { return this.read(type, nameFlags); },
	peekName: function(index) { return this.peek(index, nameFlags); },
	peekNameUntil: function(type, index) { return this.peekUntil(type, index, nameFlags); },
	
	readDiv: function(type) { return this.read(type, divFlags); },
	peekDiv: function(index) { return this.peek(index, divFlags); },
	peekDivUntil: function(type, index) { return this.peekUntil(type, index, divFlags); },
	
	readQuasi: function() { return this.read("Quasi", quasiFlags); },
	peekQuasi: function(index) { return this.peek(index, quasiFlags); },
	peekQuasiUntil: function(type, index) { return this.peekUntil("Quasi", index, quasiFlags); },
	
	// Contextual Keywords
    readKeyword: function(word) {
    
        var token = this.read();
        
        if (token.type === word || (token.type === "Identifier" && token.value === word))
            return token;
        
        this.fail("Expected keyword '" + word + "'");
    },
    
    peekKeyword: function(word, noNewlineBefore) {
    
        var token = this.peek();
        
        if (token.type === "word")
            return true;
        
        return token.type === word ||
            token.type === "Identifier" && 
            token.value === word && 
            !(noNewlineBefore && token.newlineBefore);
    },
	
	// Checks an assignment target for strict mode restrictions
	checkAssignTarget: function(node) {
	
		if (!this.context.strict)
		    return;
		
		if (node.type === "Identifier" && isPoisonIdent(node.value))
			this.fail("Cannot modify " + node.value + " in strict mode", node);
	},
	
	// Checks a binding identifier for strict mode restrictions
	checkBindingIdent: function(node) {
	
	    var name = node.value;
	    
	    if (this.context.strict && isPoisonIdent(name))
		    this.fail("Binding cannot be created for '" + name + "' in strict mode", node);
		
		// Add to bindings map
		// TODO: fail if already present?
		this.bindings[name] = 1;
	},
	
	// Checks function formal parameters for strict mode restrictions
	checkParameters: function(params) {
	
	    if (!this.context.strict)
	        return;
	    
	    var names = new KeySet(), name, i;
	    
	    for (i = 0; i < params.length; ++i) {
	    
	        if (params[i].type !== "Identifier")
	            continue;
	        
	        name = params[i].value;
	        
	        if (isPoisonIdent(name))
	            this.fail("Parameter name " + name + " is not allowed in strict mode");
	        
	        if (names.has(name))
	            this.fail("Strict mode function may not have duplicate parameter names");
	        
	        names.add(name);
	    }
	},
	
	// Performs validation on the init portion of a for, for-in, or for-of statement
	checkForInit: function(init, type) {
	
	    if (type === "for") {
	    
	        // TODO: Fail if const declaration is not initialized?
	        
	    } else {
	    
	        if (init.type === "VariableDeclaration") {
	        
	            // For-in/of may only have one variable declaration
	            if (init.declarations.length !== 1)
	                this.fail("for-" + type + " statement may not have more than one variable declaration", init);
	            
	            var decl = init.declarations[0];
	            
	            // A variable initializer is only allowed in for-in where 
	            // variable type is "var" and it is not a pattern
	            
	            if (decl.init && (
	                type === "of" ||
	                init.kind !== "var" ||
	                decl.pattern.type !== "Identifier")) {
	                
	                this.fail("Invalid initializer in for-" + type + " statement", init);
	            }
	            
	        } else {
	        
	            // Transform to LHS
	            this.transformPattern(init, false);
	        }
	    }
	},
	
	// Context management
	pushContext: function(isFunction) {
	
		this.context = { 
			
			strict: (this.context ? this.context.strict : false),
			isFunction: isFunction,
			labelSet: {},
			switchDepth: 0,
			varNames: {}
		};
		
		this._contextStack.push(this.context);
		this.scanner.strict = this.context.strict;
		
		this.pushScope();
	},
	
	popContext: function() {
	
		this._contextStack.pop();
		this.context = this._contextStack[this._contextStack.length - 1];
		this.scanner.strict = this.context ? this.context.strict : false;
		
		this.popScope();
	},
	
	// Lexical scope management
	pushScope: function() {
	
	    this.bindings = {};
	    this._scopeStack.push(this.bindings);
	    
	    return this.bindings;
	},
	
	popScope: function() {
	
	    return this._scopeStack.pop();
	},
	
	setStrictMode: function() {
	
		this.context.strict = true;
		this.scanner.strict = true;
	},
	
	Start: function() {
	
		this._contextStack = [];
		this._scopeStack = [];
		
		this.pushContext(false);
		var statements = this.StatementList(true, true);
		this.popContext();
		
		return { type: "Script", statements: statements };
	},
	
	// === Expressions ===
	
	Expression: function(noIn) {
	
	    var expr = this.AssignmentExpression(noIn),
	        list = null,
	        next;
		    
		while (this.peekDiv().type === ",") {
		
		    // If the next token after "," is "...", we might be
		    // trying to parse an arrow function formal parameter
		    // list with a trailing rest parameter.  Return the 
		    // expression up to, but not including ",".
		    
		    if (this.peek(1).type === "...")
		        break;
		    
			this.readDiv();
			
			if (list === null) {
			
			    list = [expr];
			    expr = { type: "SequenceExpression", expressions: list };
			}
			
			list.push(this.AssignmentExpression(noIn));
		}
		
		return expr;
	},
	
	AssignmentExpression: function(noIn) {
	
		var left = this.ConditionalExpression(noIn);
		
		// Check for assignment operator
		if (!assignmentOp.has(this.peekDiv().type))
			return left;
		
		// Make sure that left hand side is assignable
		switch (left.type) {
		
			case "MemberExpression":
			case "CallExpression":
				break;
				
			case "Identifier":
				this.checkAssignTarget(left);
				break;
		
			default:
			
			    left = this.transformPattern(left, false);
    			break;
		}
		
		return {
		
		    type: "AssignmentExpression",
		    operator: this.readDiv().type,
		    left: left,
		    right: this.AssignmentExpression(noIn)
		};
	},
	
	SpreadAssignment: function(noIn) {
	
	    if (this.peek().type === "...") {
	    
	        return {
	            type: "SpreadExpression",
	            expression: this.AssignmentExpression(noIn)
	        };
	    }
	    
	    return this.AssignmentExpression(noIn);
	},
	
	/*
	YieldExpression: function() {
	
	    // TODO:  readKeyword?
	    this.read("yield");
	    
	    var delegate = false;
	    
	    if (this.peek().type === "*") {
	    
	        this.read();
	        delegate = true;
	    }
	    
	    return {
	        type: "YieldExpression",
	        delegate: delegate,
	        expression: this.AssignmentExpression()
	    };
	},
	*/
	
	ConditionalExpression: function(noIn) {
	
		var left = this.OrExpression(noIn),
			middle,
			right;
		
		if (this.peekDiv().type !== "?")
			return left;
		
		this.read("?");
		middle = this.AssignmentExpression();
		this.read(":");
		right = this.AssignmentExpression(noIn);
		
		return {
		
		    type: "ConditionalExpression",
		    test: left,
		    alternate: middle,
		    consequent: right
		};
	},
	
	OrExpression: BinaryOperator("||", "AndExpression"),
	AndExpression: BinaryOperator("&&", "BitwiseOrExpression"),
	BitwiseOrExpression: BinaryOperator("|", "BitwiseXorExpression"),
	BitwiseXorExpression: BinaryOperator("^", "BitwiseAndExpression"),
	BitwiseAndExpression: BinaryOperator("&", "EqualityExpression"),
	EqualityExpression: BinaryOperator(equalityOp, "RelationalExpression"),
	
	RelationalExpression: function(noIn) {
	
		return noIn ? this.RelationalExpressionNoIn() : this.RelationalExpressionIn();
	},
	
	RelationalExpressionIn: BinaryOperator(relationalOp, "ShiftExpression"),
	RelationalExpressionNoIn: BinaryOperator(relationalOpNoIn, "ShiftExpression"),
	
	ShiftExpression: BinaryOperator(shiftOp, "AdditiveExpression"),
	AdditiveExpression: BinaryOperator(additiveOp, "MultiplicativeExpression"),
	MultiplicativeExpression: BinaryOperator(multiplicativeOp, "UnaryExpression"),
	
	UnaryExpression: function() {
	
		var token = this.peek(),
			type = token.type,
			expr;
		
		if (incrementOp.has(type)) {
		
			this.read();
			expr = this.MemberExpression(true);
			this.checkAssignTarget(expr);
			
			return {
			
			    type: "UpdateExpression", 
			    operator: type, 
			    expression: expr,
			    prefix: true
			};
		}
		
		if (unaryOp.has(type)) {
		
			this.read();
			expr = this.UnaryExpression();
			
			if (type === "delete" && this.context.strict && expr.type === "Identifier")
			    this.fail("Cannot delete unqualified property in strict mode", expr);
			
			return {
			
			    type: "UnaryExpression",
			    operator: type,
			    expression: expr
			};
		}
		
		expr = this.MemberExpression(true);
		token = this.peekDiv();
		type = token.type;
		
		// Check for postfix operator
		if (incrementOp.has(type) && !token.newlineBefore) {
		
			this.read();
			this.checkAssignTarget(expr);
			
			return {
			
			    type: "UpdateExpression",
			    operator: type,
			    expression: expr,
			    prefix: false
			};
		}
		
		return expr;
	},
	
	MemberExpression: function(allowCall) {
	
		var endNode = this.begin(),
		    token = this.peek(),
			exit = false,
			prop,
			expr;
		
		expr = 
		    (token.type === "new") ? this.NewExpression() :
		    (token.type === "super") ? this.SuperExpression() :
		    this.PrimaryExpression();
		
		while (!exit && (token = this.peekDiv())) {
		
			switch (token.type) {
			
				case ".":
				
				    this.read();
				    
				    expr = endNode({ 
				    
                        type: "MemberExpression", 
                        object: expr, 
                        property: this.readName("IdentifierName"),
                        computed: false
                    });
                    
					break;
				
				case "[":
				
				    this.read();
                    prop = this.Expression();
                    this.read("]");
                    
                    expr = endNode({ 
                    
                        type: "MemberExpression", 
                        object: expr, 
                        property: prop,
                        computed: true
                    });
		
					break;
				
				case "(":
					
					if (!allowCall) {
					
					    exit = true;
					    break;
					}
					
                    expr = endNode({
                    
                        type: "CallExpression",
                        callee: expr,
                        arguments: this.ArgumentList()
                    });
                    
                    break;
                
                case "Quasi":
                
                    expr = endNode({
                    
                        type: "TaggedQuasiExpression",
                        tag: expr,
                        quasi: this.QuasiExpresion()
                    });
                    
                    break;
				
				default:
				
				    if (expr.type === "SuperExpression")
				        this.fail("Invalid super expression");
				    
					exit = true;
					break;
			}
		}
		
		return expr;
	},
	
	NewExpression: function() {
	
		this.read("new");
		
		var expr = this.MemberExpression(false),
			args = (this.peekDiv().type === "(") ? this.ArgumentList() : null;
		
		return {
	        type: "NewExpression",
	        callee: expr,
	        arguments: args
	    };
	},
	
	SuperExpression: function() {
	
	    this.read("super");
	    return { type: "SuperExpression" };
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
	
		var type = this.peek().type;
		
		switch (type) {
		    
			case "function": return this.FunctionExpression();
			case "class": return this.ClassExpression();
			case "[": return this.ArrayExpression();
			case "{": return this.ObjectExpression();
			case "(": return this.ParenExpression();
			case "Quasi": return this.QuasiExpression();
			
			case "Identifier":
			
			    return (this.peekDiv(1).type === "=>") ?
			        this.ArrowFunction(this.BindingIdentifier()) :
			        this.read();
			
			case "null": 
		        this.read();
		        return { type: "Null", value: null };
		    
		    case "true": 
		        this.read();
		        return { type: "Boolean", value: true };
		        
		    case "false": 
		        this.read();
		        return { type: "Boolean", value: false };
		        
		    case "this": 
		        this.read();
		        return { type: "ThisExpression" };
		    
			case "Number":
			case "RegularExpression":
			case "String":
			
			    return this.read();
		}
		
		this.fail("Unexpected token " + type);
	},
	
	BindingIdentifier: function() {
	
		var node = this.read("Identifier");
		
		this.checkBindingIdent(node);
		return node;
	},
	
	BindingPattern: function() {
	
	    var node;
	    
	    switch (this.peek().type) {
	    
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
            node = this.transformPattern(node, true);
        
        return node;
	},
	
	ParenExpression: function() {

	    var expr = null,
	        rest = null;
	    
	    this.read("(");
	    
	    switch (this.peek().type) {
	    
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
	    
	    // Look for a trailing rest formal parameter within an
	    // arrow formal list
	    if (!rest && 
	        this.peek().type === "," && 
	        this.peek(1).type === "...") {
	    
	        this.read();
	        rest = this.RestParameter();
	    }
		
		this.read(")");
		
		// Determine whether this is a paren expression or an arrow function
		if (!expr || rest || this.peekDiv().type === "=>")
		    return this.ArrowFunction(expr, rest);
			
		return expr;
	},
	
	ObjectExpression: function() {
	
		var list = [], 
		    comma = 0,
			nameSet = {};
		
		this.read("{");
		
		while (this.peekNameUntil("}")) {
		
			if (list.length > 0) {
			
				this.read(",");
				++comma;
			}
			
			if (this.peekName().type !== "}")
				list.push(this.PropertyDefinition(nameSet));
		}
		
		this.read("}");
		
		return { 
		    type: "ObjectExpression", 
		    properties: list,
		    trailingComma: comma >= list.length
		};
	},
	
	PropertyDefinition: function(nameSet) {
		
		var flags = 1, node;
		
		this.peekName();
		
		switch (this.peekName(1).type) {
		
		    case "(":
		    case "IdentifierName":
		    case "String":
		    case "Number":
		        
		        node = this.MethodDefinition();
		        
		        switch (node.kind) {
                
                    case "get": flags = 2; break;
                    case "set": flags = 4; break;
                    default: flags = 8; break;
                }
                
                break;
            
            case ":":
                
                node = {
                    type: "PropertyDefinition",
                    name: this.PropertyName(),
                    expression: (this.read(":"), this.AssignmentExpression())
                };
                
                break;
                
            default:
            
                node = {
                    type: "PropertyDefinition",
                    name: this.read("IdentifierName"),
                    expression: null
                };
                
                // TODO: Syntax error if name is a reserved word!
                
                break;
		}
        
        var name = node.name.value;
        
        if (nameSet[name]) {
        
            /*
            
            TODO:
            
            It is a Syntax Error if PropertyNameList of PropertyDefinitionList 
            contains any duplicate enties, unless one of the following conditions 
            are true for each duplicate entry:
            
            1. The source code corresponding to PropertyDefinitionList is not strict 
               code and all occurances in the list of the duplicated entry were 
               obtained from productions of the form 
               PropertyDefinition : PropertyName : AssignmentExpression.
            2. The duplicated entry occurs exactly twice in the list and one 
               occurrence was obtained from a get accessor MethodDefinition and the 
               other occurrence was obtained from a set accessor MethodDefinition.
            
            */
        }
        
        // Set name flags
        nameSet[name] |= flags;
        
        return node;
	},
	
	PropertyName: function() {
	
	    var token = this.readName();
	    
		switch (token.type) {
		
			case "IdentifierName":
			case "String":
			case "Number":
				break;
			
			default:
				this.fail("Unexpected token " + token.type, token);
		}
		
		return token;
	},
	
	MethodDefinition: function() {
	
	    var name = this.PropertyName(),
	        kind = "method";
	    
	    if (name.type === "IdentifierName" && this.peekName().type !== "(") {
	    
	        if (name.value === "get" || name.value === "set") {
	        
	            kind = name.value;
	            name = this.PropertyName();
	        }
	    }
	    
	    return {
	        type: "MethodDefinition",
	        name: name,
	        kind: kind,
	        params: this.FormalParameters(),
	        body: this.FunctionBody()
	    };
	},
	
	ArrayExpression: function() {
	
		var list = [],
			comma = false,
			token;
		
		this.read("[");
		
		while (token = this.peekUntil("]")) {
			
			if (token.type === ",") {
			
				this.read();
				
				if (comma)
					list.push(null);
				
				comma = true;
			
			} else {
			
				list.push(this.SpreadAssignment());
				comma = false;
			}
		}
		
		this.read("]");
		
		return { 
		    type: "ArrayExpression", 
		    elements: list, 
		    trailingComma: comma
		};
	},
	
	QuasiExpression: function() {
	
	    var token = this.read("Quasi"),
	        lit = [ token ],
	        sub = [];
	    
	    while (!token.quasiEnd) {
	    
	        sub.push(this.Expression());
	        
	        // Discard any tokens that have been scanned so that we can 
	        // rescan contextually.
	        this.unpeek();
	        
	        lit.push(token = this.readQuasi());
	    }
	    
	    return { type: "QuasiExpression", literals: lit, substitutions: sub };
	},
	
	// === Statements ===
	
	Statement: function() {
	
		switch (this.peek().type) {
			
			case "Identifier":
			
				return (this.peekDiv(1).type === ":") ?
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
			case "do": return this.DoStatement();
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
		
		this.read("{");
		var node = { type: "Block", statements: this.StatementList(false) };
		this.read("}");
		
		return node;
	},
	
	Semicolon: function() {
	
		var token = this.peek(),
			type = token.type;
		
		if (type === ";" || !(type === "}" || type === "eof" || token.newlineBefore))
			this.read(";");
	},
	
	LabelledStatement: function() {
	
	    var label = this.read("Identifier");
		
		this.read(":");
		
		return { 
		    type: "LabelledStatement", 
		    label: label, 
		    statement: this.StatementWithLabel(label)
		};
	},
	
	ExpressionStatement: function() {
	
		var expr = this.Expression();
		
		this.Semicolon();
		return { type: "ExpressionStatement", expression: expr };
	},
	
	EmptyStatement: function() {
	
		this.Semicolon();	
		return { type: "EmptyStatement" };
	},
	
	VariableStatement: function() {
	
		var node = this.VariableDeclaration(false);
		
		this.Semicolon();
		return node;
	},
	
	VariableDeclaration: function(noIn) {
	
		var kind = this.read().type,
		    list = [];
		
		switch (kind) {
		
		    case "var":
		    case "let":
		    case "const":
		        break;
		        
		    default:
		        this.fail("Expected var, const, or let");
		}
		
		while (true) {
		
			list.push(this.VariableDeclarator(noIn));
			
			if (this.peek().type === ",") this.read();
			else break;
		}
		
		return { type: "VariableDeclaration", declarations: list, kind: kind };
	},
	
	VariableDeclarator: function(noIn) {
	
		var pattern = this.BindingPattern(),
			init = null;
		
		if (pattern.type !== "Identifier" || 
		    this.peek().type === "=") {
		
			this.read("=");
			init = this.AssignmentExpression(noIn);
		}
		
		return { type: "VariableDeclarator", pattern: pattern, init: init };
	},
	
	MaybeEnd: function() {
	
		var token = this.peek();
		
		if (!token.newlineBefore) {
			
			switch (token.type) {
			
				case "eof":
				case "}":
				case ";":
					break;
				
				default:
					return true;
			}
		}
		
		return false;
	},
	
	ReturnStatement: function() {
	
		if (!this.context.isFunction)
			this.fail("Return statement outside of function");
		
		this.read("return");
		var init = this.MaybeEnd() ? this.Expression() : null;
		this.Semicolon();
		
		return { type: "ReturnStatement", argument: init };
	},
	
	BreakOrContinueStatement: function() {
	
		var token = this.read(),
			keyword = token.value,
			labelSet = this.context.labelSet,
			label;
		
		label = this.MaybeEnd() ? this.read("Identifier") : null;
		this.Semicolon();
		
		if (label) {
		
			if (!labelSet[label.value])
				this.fail("Invalid label", label);
		
		} else {
		
			if (!labelSet[""] && !(keyword === "break" && this.context.switchDepth > 0))
				this.fail("Invalid " + keyword + " statement", token);
		}
		
		return { type: keyword === "break" ? "Break" : "Continue", label: label };
	},
	
	ThrowStatement: function() {
	
		this.read("throw");
		
		var expr = this.MaybeEnd() ? this.Expression() : null;
		
		if (expr === null)
			this.fail("Missing throw expression");
		
		this.Semicolon();
		
		return { type: "ThrowStatement", expression: expr };
	},
	
	DebuggerStatement: function() {
	
		this.read("debugger");
		this.Semicolon();
		
		return { type: "DebuggerStatement" };
	},
	
	IfStatement: function() {
	
		this.read("if");
		
		var cond = this.ParenExpression(),
			body = this.Statement(),
			elseBody = null;
		
		if (this.peek().type === "else") {
		
			this.read("else");
			elseBody = this.Statement();
		}
		
		return { 
		    type: "IfStatement", 
		    test: cond, 
		    consequent: body, 
		    alternate: elseBody
		};
	},
	
	DoStatement: function() {
	
		var body, cond;
		
		this.read("do");
		body = this.StatementWithLabel();
		
		this.read("while");
		cond = this.ParenExpression();
		
		// No semicolon required for ES6
		
		return { type: "DoStatement", body: body, test: cond };
	},
	
	WhileStatement: function() {
	
		this.read("while");
		
		return {
		    type: "WhileStatement",
		    test: this.ParenExpression(),
		    body: this.StatementWithLabel()
		};
	},
	
	ForStatement: function() {
	
		this.read("for");
		this.read("(");
		
		var init = null, cond, step;
		
        // Get loop initializer
        switch (this.peek().type) {
        
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
		
		if (this.peekKeyword("in"))
		    return this.ForInStatement(init);
		
		if (this.peekKeyword("of"))
		    return this.ForOfStatement(init);
		
		if (init)
    		this.checkForInit(init, "for");
		
        this.read(";");
        cond = (this.peek().type === ";") ? null : this.Expression();
        
        this.read(";");
        step = (this.peek().type === ")") ? null : this.Expression();
        
        this.read(")");
        
        return {
            type: "ForStatement",
            init: init,
            test: cond,
            update: step,
            body: this.StatementWithLabel()
        };
	},
	
	ForInStatement: function(init) {
	
	    this.checkForInit(init, "in");
	    
	    this.read("in");
	    var expr = this.Expression();
	    this.read(")");
        
        return {
            type: "ForInStatement",
            left: init,
            right: expr,
            body: this.StatementWithLabel()
        };
	},
	
	ForOfStatement: function(init) {
	
	    this.checkForInit(init, "of");
	    
	    this.readKeyword("of");
	    var expr = this.Expression();
	    this.read(")");
        
        return {
            type: "ForOfStatement",
            left: init,
            right: expr,
            body: this.StatementWithLabel()
        };
	},
	
	WithStatement: function() {
	
		if (this.context.strict)
			this.fail("With statement is not allowed in strict mode");
		
		this.read("with");
		
		return {
		    type: "WithStatement",
		    object: this.ParenExpression(),
		    body: this.Statement()
		};
	},
	
	SwitchStatement: function() {
	
		this.read("switch");
		
		var head = this.ParenExpression(),
			hasDefault = false,
			cases = [],
			node;
		
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
		    cases: cases
		};
	},
	
	Case: function() {
	
		var expr = null, 
			list = [],
			token;
		
		if (this.peek().type === "default") {
		
			this.read("default");
		
		} else {
		
			this.read("case");
			expr = this.Expression();
		}
		
		this.read(":");
		
		while (token = this.peekUntil("}")) {
		
			if (token.type === "case" || token.type === "default")
				break;
			
			list.push(this.Statement());
		}
		
		return {
		    type: "SwitchCase",
		    test: expr,
		    consequent: list
		};
	},
	
	TryStatement: function() {
	
		this.read("try");
		
		var tryBlock = this.Block(),
			handler = null,
			fin = null;
		
		if (this.peek().type === "catch")
			handler = this.Catch();
		
		if (this.peek().type === "finally") {
		
			this.read("finally");
			fin = this.Block();
		}
		
		return {
		    type: "TryStatement",
		    block: tryBlock,
		    handler: handler,
		    finalizer: fin
		};
	},
	
	Catch: function() {
	
		this.read("catch");
		this.read("(");
	
		var param = this.BindingPattern();
		
		this.read(")");
		
		return {
		    type: "CatchClause",
		    param: param,
		    body: this.Block()
		};
	},
	
	// === Declarations ===
	
	StatementList: function(prologue, moduleBody) {
	
		var list = [],
			element,
			tok,
			str,
			dir;
		
		while (tok = this.peekUntil("}")) {
		
			list.push(element = this.Declaration(moduleBody));
			
			// Check for directives
            if (prologue && 
                element.type === "ExpressionStatement" &&
                element.expression.type === "String") {
                
                // Get the non-escaped literal text of the string
                tok = element.expression;
                dir = this.input.slice(tok.start + 1, tok.end - 1);
                
                // Check for strict mode
                if (dir === "use strict")
                    this.setStrictMode();
            }
            
            prologue = false;
		}
		
		return list;
	},
	
	Declaration: function(moduleBody) {
	
	    var tok = this.peek(),
	        next;
	    
	    switch (tok.type) {
		    
            case "function": return this.FunctionDeclaration();
            case "class": return this.ClassDeclaration();
            case "let": 
            case "const": return this.LexicalDeclaration();
            
            case "import":
                
                if (moduleBody) 
                    return this.ImportDeclaration();
                
                break;
            
            case "export":
                
                if (moduleBody)
                    return this.ExportDeclaration();
                
                break;
            
            case "Identifier":
                
                if (moduleBody && this.peekModule())
                    return this.ModuleDeclaration();
                
                break;
        }
        
        return this.Statement();
	},
	
	LexicalDeclaration: function() {
	
	    var node = this.VariableDeclaration(false);
		
		this.Semicolon();
		return node;
	},
	
	// === Functions ===
	
	FunctionDeclaration: function() {
	
		this.read("function");
		
		return { 
		    type: "FunctionDeclaration", 
		    id: this.BindingIdentifier(),
		    params: this.FormalParameters(),
		    body: this.FunctionBody()
		};
	},
	
	FunctionExpression: function() {
	
		this.read("function");
	    
		return { 
		    type: "FunctionExpression", 
		    id: (this.peek().type !== "(" ? this.BindingIdentifier() : null),
		    params: this.FormalParameters(),
		    body: this.FunctionBody()
		};
	},
	
	FormalParameters: function() {
	
		var list = [];
		
		this.read("(");
		
		while (this.peekUntil(")")) {
			
			if (list.length > 0)
				this.read(",");
			
			// Parameter list may have a trailing rest parameter
			if (this.peek().type === "...") {
			
			    list.push(this.RestParameter());
			    break;
			}
			
			list.push(this.FormalParameter());
		}
		
		this.read(")");
		
		return list;
	},
	
	FormalParameter: function() {
	
	    var pattern = this.BindingPattern(),
			init = null;
		
		if (this.peek().type === "=") {
		
			this.read("=");
			init = this.AssignmentExpression();
		}
		
		return { type: "FormalParameter", pattern: pattern, init: init };
	},
	
	RestParameter: function() {
	
	    this.read("...");
	    
	    return { 
	        type: "RestParameter", 
	        id: this.BindingIdentifier()
	    };
	},
	
	FunctionBody: function() {
    
		this.pushContext(true);
		
		this.read("{");
		var statements = this.StatementList(true);
		this.read("}");
		
		this.popContext();
		
		return {
		    type: "FunctionBody",
		    statements: statements
		};
	},
	
	ArrowFunction: function(formals, rest) {
	
	    this.read("=>");
	    
	    var params = this.transformFormals(formals), 
	        body;
	    
	    if (rest)
	        params.push(rest);
	    
        body = this.peek().type === "{" ?
            this.FunctionBody() :
            this.AssignmentExpression();
		
		return {
		    type: "ArrowFunction",
		    params: params,
		    body: body
		};
	},
	
	// === Modules ===
	
	peekModule: function() {
	
	    if (this.peek().value === "module") {
        
            var p = this.peekDiv(1);
            return (p.type === "Identifier" && !p.newlineBefore);
        }
        
        return false;
	},
	
	ModuleBody: function() {
	
	    this.pushContext(false);
	    
	    this.read("{");
		var node = { type: "ModuleBody", statements: this.StatementList(true, true) };
		this.read("}");
		
		this.popContext();
		
		return node;
	},
	
	ModuleDeclaration: function() {
	    
	    this.readKeyword("module");
	    
	    var id = this.BindingIdentifier(),
	        path = null,
	        body = null;
	    
	    if (this.peek().type === "=") {
	    
	        this.read();
	        path = this.ModulePath();
	        this.Semicolon();
	        
    	} else {
    	
    	    body = this.ModuleBody();
    	}
	    
	    return { 
	        type: "ModuleDeclaration", 
	        id: id, 
	        path: path,
	        body: body
	    };
	},
	
	ImportDeclaration: function() {
	
	    this.read("import");
	    
	    var binding, from;
	    
	    switch (this.peek().type) {
	    
	        case "*":
	            binding = this.read();
	            break;
	        
	        case "{":
	            binding = this.ImportSpecifierSet();
	            break;
	        
	        default:
	            binding = this.BindingIdentifier();
	            
	            if (this.peek().type === "=") {
	            
	                this.read();
	                from = this.read("String");
	                this.Semicolon();
	                
	                return {
	                
	                    type: "ModuleImport",
	                    id: binding,
	                    from: from
	                };
	            }
	                
	            break;
	    }

	    this.readKeyword("from");
	    
	    from = this.ModuleSpecifier();
	    this.Semicolon();
	    
	    return { 
	        type: "ImportDeclaration", 
	        binding: binding, 
	        from: from 
	    };
	},
	
	ImportSpecifierSet: function() {
	    
	    var list = [];
	    
	    this.read("{");
	    
	    while (true) {
	    
	        list.push(this.ImportSpecifier());
	        
	        if (this.peekDiv().type === ",") this.read();
	        else break;
	    }
	    
	    this.read("}");
	    
	    return { type: "ImportSpecifierSet", specifiers: list };
	},
	
	ImportSpecifier: function() {
	
	    var name = this.read("Identifier"),
            id = null;
        
        if (this.peek().type === ":") {
        
            this.read();
            id = this.BindingIdentifier();
        }
        
        return { type: "ImportSpecifier", name: name, id: id };
	},
	
	ExportDeclaration: function() {
	
	    this.read("export");
	    
	    var tok = this.peek(),
	        from = null,
	        binding;
	    
	    switch (tok.type) {
	    
	        case "*":
	        
	            binding = this.read();
	            
                this.readKeyword("from");
                from = this.ModuleSpecifier();
	            this.Semicolon();
	            break;
	            
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
	        
	        case "Identifier":
	        
	            if (this.peekModule()) {
	            
	                binding = this.ModuleDeclaration();
	            
	            } else {
	            
	                binding = this.read();
	                this.Semicolon();
	            }
	            
	            break;
	        
	        default:
	        
	            binding = this.ExportSpecifierSet();
	            this.Semicolon();
	            break;
	    }
	    
	    return { 
	        type: "ExportDeclaration", 
	        binding: binding,
	        from: from
	    };
	},
	
	ExportSpecifierSet: function() {
	
        var list = [];
	    
	    this.read("{");
	    
	    while (true) {
	    
	        list.push(this.ExportSpecifier());
	        
	        if (this.peekDiv().type === ",") this.read();
	        else break;
	    }
	    
	    this.read("}");
	    
	    return { type: "ExportSpecifierSet", specifiers: list };
	},
	
	ExportSpecifier: function() {
	
	    var id = this.read("Identifier"),
	        from = null;
	        
        if (this.peek().type === ":") {
        
            this.read();
            from = this.ModulePath();
        }
	    
	    return { type: "ExportSpecifier", id: id, from: from };
	},
	
	ModuleSpecifier: function() {
	
	    return this.peek().type !== "Identifier" ?
	        this.read("String") :
	        this.ModulePath();
	},
	
	ModulePath: function() {
	
	    var path = [];
	    
	    while (true) {
	    
	        path.push(this.read("Identifier"));
	        
	        if (this.peekDiv().type === ".") this.read();
	        else break;
	    }
	    
	    return { type: "Path", elements: path };
	},
	
	// === Classes ===
	
	ClassDeclaration: function() {
	
	    this.read("class");
	    
	    return this.ClassLiteral("ClassDeclaration", this.BindingIdentifier());
	},
	
	ClassExpression: function() {
	
	    this.read("class");
	    
	    var id = null;
	    
	    if (this.peek().type === "Identifier")
	        id = this.BindingIdentifier();
	    
	    return this.ClassLiteral("ClassExpression", id);
	},
	
	ClassLiteral: function(type, id) {
	
	    var base = null;
	    
	    if (this.peek().type === "extends") {
	    
	        this.read();
	        base = this.AssignmentExpression();
	    }
	    
	    return {
	        type: type,
	        id: id,
	        base: base,
	        body: this.ClassBody()
	    };
	},
	
	ClassBody: function() {
	
	    var nameSet = {}, list = [];
	    
	    this.read("{");
		
		while (this.peekNameUntil("}"))
            list.push(this.ClassElement(nameSet));
		
		this.read("}");
		
		return {
		    type: "ClassBody",
		    elements: list
		};
	},
	
	ClassElement: function(nameSet) {
	
	    var node = this.MethodDefinition();
	    
	    /*
	    
	    TODO: It is a Syntax Error if MethodNameList of ClassStatementList contains 
	    any duplicate enties, unless the following condition is true for each 
	    duplicate entry: The duplicated entry occurs exactly twice in the list 
	    and one occurrence was obtained from a get accessor MethodDefinition and 
	    the other occurrence was obtained from a set accessor MethodDefinition.
	    
	    */
	    
	    return node;
	}
	
	
});

// Add transformation methods
Keys.set(Parser.prototype, Transform.methods);

exports.Parser = Parser;