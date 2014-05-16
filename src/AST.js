/*

NOTE:  For auto-documentation purposes, the following conventions must be followed:

1)  The last parameters to each constructor function must always be "start"
    and "end", in that order.

2)  With the exception of "start" and "end", the order of constructor parameters
    must be identical to the order of property assignments within the constructor.

*/

/*

NOTE: We forego using classes and class-based inheritance for the following reasons:

1)  super() is currently slow when using ES6 transpilers.
2)  Using object literal methods allows us to easily iterated over all AST nodes
    from within this module.

*/

export var AST = {
    
    Node(type, start, end) {

        this.type = type; // (string) The node type
        this.start = start;
        this.end = end;
    },
    
    Identifier(value, context, start, end) { 

        this.type = "Identifier";
        this.start = start;
        this.end = end;
        this.value = value; // (string) The string value of the identifier
        this.context = context; // (string) The context in which the identifier appears ("", "variable", "declaration")
    },

    // A number literal
    NumberLiteral(value, start, end) {
    
        this.type = "NumberLiteral";
        this.start = start;
        this.end = end;
        this.value = value; // (number) The mathmatical value of the number literal
    },

    // A string literal
    StringLiteral(value, start, end) {

        this.type = "StringLiteral";
        this.start = start;
        this.end = end;
        this.value = value; // (string) The value of the string literal
    },

    TemplatePart(value, raw, isEnd, start, end) {
    
        this.type = "TemplatePart";
        this.start = start;
        this.end = end;
        this.value = value; // (string) The string value of the template fragment
        this.raw = raw;
        this.templateEnd = isEnd; // (boolean) True if this template fragment terminates the template literal
    },

    RegularExpression(value, flags, start, end) {
    
        this.type = "RegularExpression";
        this.start = start;
        this.end = end;
        this.value = value; // (string) The raw value of the regular expression literal
        this.flags = flags; // (string) The set of flags for the regular expression literal
    },

    BooleanLiteral(value, start, end) {
    
        this.type = "BooleanLiteral";
        this.start = start;
        this.end = end;
        this.value = value; // (boolean) The value of the boolean literal
    },
    
    NullLiteral(start, end) { 

        this.type = "NullLiteral";
        this.start = start;
        this.end = end;
    },

    Script(statements, start, end) {
    
        this.type = "Script";
        this.start = start;
        this.end = end;
        this.statements = statements; // [Node] A list of statements
    },

    Module(statements, start, end) {

        this.type = "Module";
        this.start = start;
        this.end = end;
        this.statements = statements; // [Node] A list of statements
    },

    ThisExpression(start, end) { 

        this.type = "ThisExpression";
        this.start = start;
        this.end = end;
    },

    SuperExpression(start, end) { 

        this.type = "SuperExpression";
        this.start = start;
        this.end = end;
    },

    SequenceExpression(list, start, end) {

        this.type = "SequenceExpression";
        this.start = start;
        this.end = end;
        this.expressions = list; // [Node] A list of expressions
    },

    AssignmentExpression(op, left, right, start, end) {
    
        this.type = "AssignmentExpression";
        this.start = start;
        this.end = end;
        this.operator = op; // (string) An assignment operator
        this.left = left; // The left-hand-side of the assignment operator
        this.right = right; // The right-hand-side of the assignment operator
    },

    SpreadExpression(expr, start, end) {
    
        this.type = "SpreadExpression";
        this.start = start;
        this.end = end;
        this.expression = expr; // An expression
    },

    YieldExpression(expr, delegate, start, end) {
    
        this.type = "YieldExpression";
        this.start = start;
        this.end = end;
        this.delegate = delegate; // (boolean) True if the yield expression is delegating
        this.expression = expr; // An expression
    },

    ConditionalExpression(test, cons, alt, start, end) {
    
        this.type = "ConditionalExpression";
        this.start = start;
        this.end = end;
        this.test = test; // A test expression
        this.consequent = cons; // The expression evaluated if the test passes
        this.alternate = alt; // The expression evaluated if the test fails
    },

    BinaryExpression(op, left, right, start, end) {
    
        this.type = "BinaryExpression";
        this.start = start;
        this.end = end;
        this.operator = op; // (string) A binary operator
        this.left = left; // The left operand expression
        this.right = right; // The right operand expression
    },

    UpdateExpression(op, expr, prefix, start, end) {
    
        this.type = "UpdateExpression";
        this.start = start;
        this.end = end;
        this.operator = op; // (string) An update operator
        this.expression = expr; // An expression
        this.prefix = prefix; // (boolean) True if the operator is a prefix
    },

    UnaryExpression(op, expr, start, end) {
    
        this.type = "UnaryExpression";
        this.start = start;
        this.end = end;
        this.operator = op; // (string) A unary operator
        this.expression = expr; // An expression
    },

    MemberExpression(obj, prop, computed, start, end) {
    
        this.type = "MemberExpression";
        this.start = start;
        this.end = end;
        this.object = obj; // An expression evaulating to an object
        this.property = prop; // An expression evaluating to a property name
        this.computed = computed; // (boolean) True if the property name is computed
    },

    CallExpression(callee, args, start, end) {
    
        this.type = "CallExpression";
        this.start = start;
        this.end = end;
        this.callee = callee; // An expression
        this.arguments = args; // [Node] A list of call arguments
    },

    TaggedTemplateExpression(tag, template, start, end) {
    
        this.type = "TaggedTemplateExpression";
        this.start = start;
        this.end = end;
        this.tag = tag; // The template tag
        this.template = template; // (TemplateExpression) A template
    },

    NewExpression(callee, args, start, end) {
    
        this.type = "NewExpression";
        this.start = start;
        this.end = end;
        this.callee = callee; // An expression
        this.arguments = args; // [Node] A list of call arguments
    },

    ParenExpression(expr, start, end) {
    
        this.type = "ParenExpression";
        this.start = start;
        this.end = end;
        this.expression = expr; // An expression contained within parenthesis
    },

    ObjectLiteral(props, start, end) {
    
        this.type = "ObjectLiteral";
        this.start = start;
        this.end = end;
        this.properties = props; // [PropertyDefinition|MethodDefinition] A list of properties and methods defined in the object literal
    },

    ComputedPropertyName(expr, start, end) {
    
        this.type = "ComputedPropertyName";
        this.start = start;
        this.end = end;
        this.expression = expr; // An expression
    },

    PropertyDefinition(name, expr, start, end) {
    
        this.type = "PropertyDefinition";
        this.start = start;
        this.end = end;
        this.name = name; // (StringLiteral|NumberLiteral|Identifier|ComputedPropertyName) The property name
        this.expression = expr; // (Node?) An expression
    },

    ObjectPattern(props, start, end) {
        
        this.type = "ObjectPattern";
        this.start = start;
        this.end = end;
        this.properties = props; // [PatternProperty] A list of destructuring pattern properties
    },
    
    PatternProperty(name, pattern, initializer, start, end) {
    
        this.type = "PatternProperty";
        this.start = start;
        this.end = end;
        this.name = name; // The destructuring property name
        this.pattern = pattern; // (Node?) A destructuring target pattern
        this.initializer = initializer; // (Node?) A default initializer expression
    },

    ArrayPattern(elements, start, end) {
    
        this.type = "ArrayPattern";
        this.start = start;
        this.end = end;
        this.elements = elements; // [PatternElement|PatternRestElement] A list of of destructuring pattern elements
    },
    
    PatternElement(pattern, initializer, start, end) {
    
        this.type = "PatternElement";
        this.start = start;
        this.end = end;
        this.pattern = pattern; // A destructuring target pattern
        this.initializer = initializer; // (Node?) A default initializer expression
    },
    
    PatternRestElement(pattern, start, end) {
    
        this.type = "PatternRestElement";
        this.start = start;
        this.end = end;
        this.pattern = pattern; // A destructuring target
    },

    MethodDefinition(kind, name, params, body, start, end) {
    
        this.type = "MethodDefinition";
        this.start = start;
        this.end = end;
        this.kind = kind; // (string) The type of method
        this.name = name; // The method name
        this.params = params; // [FormalParameter] A list of formal parameters
        this.body = body; // (FunctionBody) The function body
    },

    ArrayLiteral(elements, start, end) {
    
        this.type = "ArrayLiteral";
        this.start = start;
        this.end = end;
        this.elements = elements; // [Node|null]
    },

    ArrayComprehension(qualifiers, expr, start, end) {
    
        this.type = "ArrayComprehension";
        this.start = start;
        this.end = end;
        this.qualifiers = qualifiers;
        this.expression = expr;
    },

    GeneratorComprehension(qualifiers, expr, start, end) {
    
        this.type = "GeneratorComprehension";
        this.start = start;
        this.end = end;
        this.qualifiers = qualifiers;
        this.expression = expr;
    },

    ComprehensionFor(left, right, start, end) {
    
        this.type = "ComprehensionFor";
        this.start = start;
        this.end = end;
        this.left = left;
        this.right = right;
    },

    ComprehensionIf(test, start, end) {
    
        this.type = "ComprehensionIf";
        this.start = start;
        this.end = end;
        this.test = test;
    },

    TemplateExpression(lits, subs, start, end) {
    
        this.type = "TemplateExpression";
        this.start = start;
        this.end = end;
        this.literals = lits;
        this.substitutions = subs;
    },

    Block(statements, start, end) {
    
        this.type = "Block";
        this.start = start;
        this.end = end;
        this.statements = statements;
    },

    LabelledStatement(label, statement, start, end) {
    
        this.type = "LabelledStatement";
        this.start = start;
        this.end = end;
        this.label = label;
        this.statement = statement;
    },

    ExpressionStatement(expr, start, end) {
    
        this.type = "ExpressionStatement";
        this.start = start;
        this.end = end;
        this.expression = expr;
    },

    EmptyStatement(start, end) { 

        this.type = "EmptyStatement";
        this.start = start;
        this.end = end;
    },

    VariableDeclaration(kind, list, start, end) {
    
        this.type = "VariableDeclaration";
        this.start = start;
        this.end = end;
        this.kind = kind;
        this.declarations = list;
    },

    VariableDeclarator(pattern, initializer, start, end) {
    
        this.type = "VariableDeclarator";
        this.start = start;
        this.end = end;
        this.pattern = pattern;
        this.initializer = initializer;
    },

    ReturnStatement(arg, start, end) {
    
        this.type = "ReturnStatement";
        this.start = start;
        this.end = end;
        this.argument = arg;
    },

    BreakStatement(label, start, end) {
    
        this.type = "BreakStatement";
        this.start = start;
        this.end = end;
        this.label = label;
    },

    ContinueStatement(label, start, end) {
    
        this.type = "ContinueStatement";
        this.start = start;
        this.end = end;
        this.label = label;
    },

    ThrowStatement(expr, start, end) {
    
        this.type = "ThrowStatement";
        this.start = start;
        this.end = end;
        this.expression = expr;
    },

    DebuggerStatement(start, end) {
    
        this.type = "DebuggerStatement";
        this.start = start;
        this.end = end;
    },

    IfStatement(test, cons, alt, start, end) {
    
        this.type = "IfStatement";
        this.start = start;
        this.end = end;
        this.test = test;
        this.consequent = cons;
        this.alternate = alt;
    },

    DoWhileStatement(body, test, start, end) {
    
        this.type = "DoWhileStatement";
        this.start = start;
        this.end = end;
        this.body = body;
        this.test = test;
    },

    WhileStatement(test, body, start, end) {
    
        this.type = "WhileStatement";
        this.start = start;
        this.end = end;
        this.test = test;
        this.body = body;
    },

    ForStatement(initializer, test, update, body, start, end) {
    
        this.type = "ForStatement";
        this.start = start;
        this.end = end;
        this.initializer = initializer;
        this.test = test;
        this.update = update;
        this.body = body;
    },

    ForInStatement(left, right, body, start, end) {
    
        this.type = "ForInStatement";
        this.start = start;
        this.end = end;
        this.left = left;
        this.right = right;
        this.body = body;
    },

    ForOfStatement(left, right, body, start, end) {
    
        this.type = "ForOfStatement";
        this.start = start;
        this.end = end;
        this.left = left;
        this.right = right;
        this.body = body;
    },

    WithStatement(object, body, start, end) {
    
        this.type = "WithStatement";
        this.start = start;
        this.end = end;
        this.object = object;
        this.body = body;
    },

    SwitchStatement(desc, cases, start, end) {
    
        this.type = "SwitchStatement";
        this.start = start;
        this.end = end;
        this.descriminant = desc;
        this.cases = cases;
    },

    SwitchCase(test, cons, start, end) {
    
        this.type = "SwitchCase";
        this.start = start;
        this.end = end;
        this.test = test;
        this.consequent = cons;
    },

    TryStatement(block, handler, fin, start, end) {
    
        this.type = "TryStatement";
        this.start = start;
        this.end = end;
        this.block = block;
        this.handler = handler;
        this.finalizer = fin;
    },

    CatchClause(param, body, start, end) {
    
        this.type = "CatchClause";
        this.start = start;
        this.end = end;
        this.param = param;
        this.body = body;
    },

    FunctionDeclaration(kind, identifier, params, body, start, end) {
    
        this.type = "FunctionDeclaration";
        this.start = start;
        this.end = end;
        this.kind = kind;
        this.identifier = identifier;
        this.params = params;
        this.body = body;
    },

    FunctionExpression(kind, identifier, params, body, start, end) {
    
        this.type = "FunctionExpression";
        this.start = start;
        this.end = end;
        this.kind = kind;
        this.identifier = identifier;
        this.params = params;
        this.body = body;
    },

    FormalParameter(pattern, initializer, start, end) {
    
        this.type = "FormalParameter";
        this.start = start;
        this.end = end;
        this.pattern = pattern;
        this.initializer = initializer;
    },

    RestParameter(identifier, start, end) {
    
        this.type = "RestParameter";
        this.start = start;
        this.end = end;
        this.identifier = identifier;
    },

    FunctionBody(statements, start, end) {
    
        this.type = "FunctionBody";
        this.start = start;
        this.end = end;
        this.statements = statements;
    },

    ArrowFunctionHead(params, start, end) {
    
        this.type = "ArrowFunctionHead";
        this.start = start;
        this.end = end;
        this.parameters = params;
    },

    ArrowFunction(kind, params, body, start, end) {
    
        this.type = "ArrowFunction";
        this.start = start;
        this.end = end;
        this.kind = kind;
        this.params = params;
        this.body = body;
    },

    ClassDeclaration(identifier, base, body, start, end) {
    
        this.type = "ClassDeclaration";
        this.start = start;
        this.end = end;
        this.identifier = identifier;
        this.base = base;
        this.body = body;
    },

    ClassExpression(identifier, base, body, start, end) {
    
        this.type = "ClassExpression";
        this.start = start;
        this.end = end;
        this.identifier = identifier;
        this.base = base;
        this.body = body;
    },

    ClassBody(elems, start, end) {
    
        this.type = "ClassBody";
        this.start = start;
        this.end = end;
        this.elements = elems;
    },

    ClassElement(isStatic, method, start, end) {
    
        this.type = "ClassElement";
        this.start = start;
        this.end = end;
        this.static = isStatic;
        this.method = method;
    },
    
    ModuleDeclaration(identifier, body, start, end) {
    
        this.type = "ModuleDeclaration";
        this.start = start;
        this.end = end;
        this.identifier = identifier;
        this.body = body;
    },

    ModuleBody(statements, start, end) {
    
        this.type = "ModuleBody";
        this.start = start;
        this.end = end;
        this.statements = statements;
    },

    ModuleImport(identifier, from, start, end) {
    
        this.type = "ModuleImport";
        this.start = start;
        this.end = end;
        this.identifier = identifier;
        this.from = from;
    },

    ModuleAlias(identifier, path, start, end) {
    
        this.type = "ModuleAlias";
        this.start = start;
        this.end = end;
        this.identifier = identifier;
        this.path = path;
    },

    ImportDefaultDeclaration(ident, from, start, end) {
    
        this.type = "ImportDefaultDeclaration";
        this.start = start;
        this.end = end;
        this.identifier = ident;
        this.from = from;
    },

    ImportDeclaration(specifiers, from, start, end) {
    
        this.type = "ImportDeclaration";
        this.start = start;
        this.end = end;
        this.specifiers = specifiers;
        this.from = from;
    },

    ImportSpecifier(imported, local, start, end) {
    
        this.type = "ImportSpecifier";
        this.start = start;
        this.end = end;
        this.imported = imported;
        this.local = local;
    },

    ExportDeclaration(declaration, start, end) {
    
        this.type = "ExportDeclaration";
        this.start = start;
        this.end = end;
        this.declaration = declaration;
    },

    ExportsList(list, from, start, end) {
    
        this.type = "ExportsList";
        this.start = start;
        this.end = end;
        this.specifiers = list;
        this.from = from;
    },

    ExportSpecifier(local, exported, start, end) {
    
        this.type = "ExportSpecifier";
        this.start = start;
        this.end = end;
        this.local = local;
        this.exported = exported;
    },

    ModulePath(list, start, end) {
    
        this.type = "ModulePath";
        this.start = start;
        this.end = end;
        this.elements = list;
    }

};

function isNode(x) {

    return x !== null && typeof x === "object" && typeof x.type === "string";
}

class NodeBase {

    children() {
    
        var list = [];
        
        Object.keys(this).forEach(k => {
        
            // Don't iterate over backlinks to parent node
            if (k === "parent")
                return;
            
            var value = this[k];
            
            if (Array.isArray(value))
                value.forEach(x => { if (isNode(x)) list.push(x) });
            else if (isNode(value))
                list.push(value);
        });
        
        return list;
    }
}

Object.keys(AST).forEach(k => AST[k].prototype = NodeBase.prototype);
