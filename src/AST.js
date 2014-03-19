export var AST = {

    Node(type, start, end) {

        this.start = start;
        this.end = end;
    },

    Script(statements, start, end) {
    
        this.start = start;
        this.end = end;
        this.statements = statements;
    },

    Module(statements, start, end) {

        this.start = start;
        this.end = end;
        this.statements = statements;
    },

    Identifier(value, context, start, end) {

        this.start = start;
        this.end = end;
        this.value = value;
        this.context = context;
    },

    Number(value, start, end) {
    
        this.start = start;
        this.end = end;
        this.value = value;
    },

    String(value, start, end) {

        this.start = start;
        this.end = end;
        this.value = value;
    },

    Template(value, isEnd, start, end) {
    
        this.start = start;
        this.end = end;
        this.value = value;
        this.templateEnd = isEnd;
    },

    RegularExpression(value, flags, start, end) {
    
        this.start = start;
        this.end = end;
        this.value = value;
        this.flags = flags;
    },

    Null(start, end) { 

        this.start = start;
        this.end = end;
    },

    Boolean(value, start, end) {
    
        this.start = start;
        this.end = end;
        this.value = value;
    },

    ThisExpression(start, end) { 

        this.start = start;
        this.end = end;
    },

    SuperExpression(start, end) { 

        this.start = start;
        this.end = end;
    },

    SequenceExpression(list, start, end) {

        this.start = start;
        this.end = end;
        this.expressions = list;
    },

    AssignmentExpression(op, left, right, start, end) {
    
        this.start = start;
        this.end = end;
        this.operator = op;
        this.left = left;
        this.right = right;
    },

    SpreadExpression(expr, start, end) {
    
        this.start = start;
        this.end = end;
        this.expression = expr;
    },

    YieldExpression(expr, delegate, start, end) {
    
        this.start = start;
        this.end = end;
        this.delegate = delegate;
        this.expression = expr;
    },

    ConditionalExpression(test, cons, alt, start, end) {
    
        this.start = start;
        this.end = end;
        this.test = test;
        this.consequent = cons;
        this.alternate = alt;
    },

    BinaryExpression(op, left, right, start, end) {
    
        this.start = start;
        this.end = end;
        this.operator = op;
        this.left = left;
        this.right = right;
    },

    UpdateExpression(op, expr, prefix, start, end) {
    
        this.start = start;
        this.end = end;
        this.operator = op;
        this.expression = expr;
        this.prefix = prefix;
    },

    UnaryExpression(op, expr, start, end) {
    
        this.start = start;
        this.end = end;
        this.operator = op;
        this.expression = expr;
    },

    MemberExpression(obj, prop, computed, start, end) {
    
        this.start = start;
        this.end = end;
        this.object = obj;
        this.property = prop;
        this.computed = computed;
    },

    CallExpression(callee, args, start, end) {
    
        this.start = start;
        this.end = end;
        this.callee = callee;
        this.arguments = args;
    },

    TaggedTemplateExpression(tag, template, start, end) {
    
        this.start = start;
        this.end = end;
        this.tag = tag;
        this.template = template;
    },

    NewExpression(callee, args, start, end) {
    
        this.start = start;
        this.end = end;
        this.callee = callee;
        this.arguments = args;
    },

    ParenExpression(expr, start, end) {
    
        this.start = start;
        this.end = end;
        this.expression = expr;
    },

    ObjectLiteral(props, start, end) {
    
        this.start = start;
        this.end = end;
        this.properties = props;
    },

    ComputedPropertyName(expr, start, end) {
    
        this.start = start;
        this.end = end;
        this.expression = expr;
    },

    PropertyDefinition(name, expr, start, end) {
    
        this.start = start;
        this.end = end;
        this.name = name;
        this.expression = expr;
    },

    PatternProperty(name, pattern, initializer, start, end) {
    
        this.start = start;
        this.end = end;
        this.name = name;
        this.pattern = pattern;
        this.initializer = initializer;
    },

    PatternElement(pattern, initializer, rest, start, end) {
    
        this.start = start;
        this.end = end;
        this.pattern = pattern;
        this.initializer = initializer;
        this.rest = rest;
    },

    MethodDefinition(kind, name, params, body, start, end) {
    
        this.start = start;
        this.end = end;
        this.kind = kind;
        this.name = name;
        this.params = params;
        this.body = body;
    },

    ArrayLiteral(elements, start, end) {
    
        this.start = start;
        this.end = end;
        this.elements = elements;
    },

    ArrayComprehension(qualifiers, expr, start, end) {
    
        this.start = start;
        this.end = end;
        this.qualifiers = qualifiers;
        this.expression = expr;
    },

    GeneratorComprehension(qualifiers, expr, start, end) {
    
        this.start = start;
        this.end = end;
        this.qualifiers = qualifiers;
        this.expression = expr;
    },

    ComprehensionFor(left, right, start, end) {
    
        this.start = start;
        this.end = end;
        this.left = left;
        this.right = right;
    },

    ComprehensionIf(test, start, end) {
    
        this.start = start;
        this.end = end;
        this.test = test;
    },

    TemplateExpression(lits, subs, start, end) {
    
        this.start = start;
        this.end = end;
        this.literals = lits;
        this.substitutions = subs;
    },

    Block(statements, start, end) {
    
        this.start = start;
        this.end = end;
        this.statements = statements;
    },

    LabelledStatement(label, statement, start, end) {
    
        this.start = start;
        this.end = end;
        this.label = label;
        this.statement = statement;
    },

    ExpressionStatement(expr, start, end) {
    
        this.start = start;
        this.end = end;
        this.expression = expr;
        this.directive = null;
    },

    EmptyStatement(start, end) { 

        this.start = start;
        this.end = end;
    },

    VariableDeclaration(kind, list, start, end) {
    
        this.start = start;
        this.end = end;
        this.kind = kind;
        this.declarations = list;
    },

    VariableDeclarator(pattern, initializer, start, end) {
    
        this.start = start;
        this.end = end;
        this.pattern = pattern;
        this.initializer = initializer;
    },

    ReturnStatement(arg, start, end) {
    
        this.start = start;
        this.end = end;
        this.argument = arg;
    },

    BreakStatement(label, start, end) {
    
        this.start = start;
        this.end = end;
        this.label = label;
    },

    ContinueStatement(label, start, end) {
    
        this.start = start;
        this.end = end;
        this.label = label;
    },

    ThrowStatement(expr, start, end) {
    
        this.start = start;
        this.end = end;
        this.expression = expr;
    },

    DebuggerStatement(start, end) {
    
        this.start = start;
        this.end = end;
    },

    IfStatement(test, cons, alt, start, end) {
    
        this.start = start;
        this.end = end;
        this.test = test;
        this.consequent = cons;
        this.alternate = alt;
    },

    DoWhileStatement(body, test, start, end) {
    
        this.start = start;
        this.end = end;
        this.body = body;
        this.test = test;
    },

    WhileStatement(test, body, start, end) {
    
        this.start = start;
        this.end = end;
        this.test = test;
        this.body = body;
    },

    ForStatement(initializer, test, update, body, start, end) {
    
        this.start = start;
        this.end = end;
        this.initializer = initializer;
        this.test = test;
        this.update = update;
        this.body = body;
    },

    ForInStatement(left, right, body, start, end) {
    
        this.start = start;
        this.end = end;
        this.left = left;
        this.right = right;
        this.body = body;
    },

    ForOfStatement(left, right, body, start, end) {
    
        this.start = start;
        this.end = end;
        this.left = left;
        this.right = right;
        this.body = body;
    },

    WithStatement(object, body, start, end) {
    
        this.start = start;
        this.end = end;
        this.object = object;
        this.body = body;
    },

    SwitchStatement(desc, cases, start, end) {
    
        this.start = start;
        this.end = end;
        this.descriminant = desc;
        this.cases = cases;
    },

    SwitchCase(test, cons, start, end) {
    
        this.start = start;
        this.end = end;
        this.test = test;
        this.consequent = cons;
    },

    TryStatement(block, handler, fin, start, end) {
    
        this.start = start;
        this.end = end;
        this.block = block;
        this.handler = handler;
        this.finalizer = fin;
    },

    CatchClause(param, body, start, end) {
    
        this.start = start;
        this.end = end;
        this.param = param;
        this.body = body;
    },

    FunctionDeclaration(kind, identifier, params, body, start, end) {
    
        this.start = start;
        this.end = end;
        this.kind = kind;
        this.identifier = identifier;
        this.params = params;
        this.body = body;
    },

    FunctionExpression(kind, identifier, params, body, start, end) {
    
        this.start = start;
        this.end = end;
        this.kind = kind;
        this.identifier = identifier;
        this.params = params;
        this.body = body;
    },

    FormalParameter(pattern, initializer, start, end) {
    
        this.start = start;
        this.end = end;
        this.pattern = pattern;
        this.initializer = initializer;
    },

    RestParameter(identifier, start, end) {
    
        this.start = start;
        this.end = end;
        this.identifier = identifier;
    },

    FunctionBody(statements, start, end) {
    
        this.start = start;
        this.end = end;
        this.statements = statements;
    },

    ArrowFunctionHead(params, start, end) {
    
        this.start = start;
        this.end = end;
        this.parameters = params;
    },

    ArrowFunction(kind, params, body, start, end) {
    
        this.start = start;
        this.end = end;
        this.kind = kind;
        this.params = params;
        this.body = body;
    },

    ModuleDeclaration(identifier, body, start, end) {
    
        this.start = start;
        this.end = end;
        this.identifier = identifier;
        this.body = body;
    },

    ModuleBody(statements, start, end) {
    
        this.start = start;
        this.end = end;
        this.statements = statements;
    },

    ModuleImport(identifier, from, start, end) {
    
        this.start = start;
        this.end = end;
        this.identifier = identifier;
        this.from = from;
    },

    ModuleAlias(identifier, path, start, end) {
    
        this.start = start;
        this.end = end;
        this.identifier = identifier;
        this.path = path;
    },

    ImportDefaultDeclaration(ident, from, start, end) {
    
        this.start = start;
        this.end = end;
        this.identifier = ident;
        this.from = from;
    },

    ImportDeclaration(specifiers, from, start, end) {
    
        this.start = start;
        this.end = end;
        this.specifiers = specifiers;
        this.from = from;
    },

    ImportSpecifier(remote, local, start, end) {
    
        this.start = start;
        this.end = end;
        this.remote = remote;
        this.local = local;
    },

    ExportDeclaration(binding, start, end) {
    
        this.start = start;
        this.end = end;
        this.binding = binding;
    },

    ExportsList(list, from, start, end) {
    
        this.start = start;
        this.end = end;
        this.specifiers = list;
        this.from = from;
    },

    ExportSpecifier(local, remote, start, end) {
    
        this.start = start;
        this.end = end;
        this.local = local;
        this.remote = remote;
    },

    ModulePath(list, start, end) {
    
        this.start = start;
        this.end = end;
        this.elements = list;
    },

    ClassDeclaration(identifier, base, body, start, end) {
    
        this.start = start;
        this.end = end;
        this.identifier = identifier;
        this.base = base;
        this.body = body;
    },

    ClassExpression(identifier, base, body, start, end) {
    
        this.start = start;
        this.end = end;
        this.identifier = identifier;
        this.base = base;
        this.body = body;
    },

    ClassBody(elems, start, end) {
    
        this.start = start;
        this.end = end;
        this.elements = elems;
    },

    ClassElement(isStatic, method, start, end) {
    
        this.start = start;
        this.end = end;
        this.static = isStatic;
        this.method = method;
    }

};

// Returns a function for defining object properties
function define(obj, name, value, enumerable) {

    function d(name, value, enumerable) {
    
        Object.defineProperty(obj, name, { value, enumerable, configurable: true, writable: true });
        return d;
    };
    
    return d;
}

// Executes a callback for every child of "this"
function forEachChild(fn) {

    var keys = Object.keys(this), val, i, j;

    for (i = 0; i < keys.length; ++i) {

        // Don't iterate over backlink to parent
        if (keys[i] === "parentNode")
            continue;
    
        val = this[keys[i]];

        // Skip non-objects and functions
        if (!val || typeof val !== "object") 
            continue;

        if (typeof val.type === "string") {

            // Nodes have a "type" property
            fn(val);

        } else {

            // Iterate arrays
            for (j = 0; j < (val.length >>> 0); ++j)
                if (val[j] && typeof val[j].type === "string")
                    fn(val[j]);
        }
    }
}

// Assign a prototype for each constructor
Object.keys(AST).forEach(name => {

    var fn = AST[name];
    
    define(fn.prototype = Object.create(null))
    ("constructor", fn, false)
    ("type", name, true)
    ("error", "", false)
    ("parentNode", null, false)
    ("forEachChild", forEachChild, false);
});
