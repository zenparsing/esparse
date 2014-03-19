function define(obj, name, value, enumerable) {

    Object.defineProperty(obj, name, {
    
        enumerable,
        writable: true,
        configurable: true,
        value
    });
}
    
function proto(fn) {

    var p = Object.create(null);
    
    define(p, "constructor", fn, false);
    define(p, "type", fn.name, true);
    define(p, "error", "", false);
    define(p, "parentNode", null, false);
    define(p, "forEachChild", forEachChild, false);
    
    fn.prototype = p;
}

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

export function Node(type, start, end) {

    this.start = start;
    this.end = end;
    
} proto(Node);

export function Script(statements, start, end) {
    
    this.start = start;
    this.end = end;
    this.statements = statements;

} proto(Script);

export function Module(statements, start, end) {

    this.start = start;
    this.end = end;
    this.statements = statements;

} proto(Module);

export function Identifier(value, context, start, end) {

    this.start = start;
    this.end = end;
    this.value = value;
    this.context = context;
    
} proto(Identifier);

export function Number(value, start, end) {
    
    this.start = start;
    this.end = end;
    this.value = value;

} proto(Number);

export function String(value, start, end) {

    this.start = start;
    this.end = end;
    this.value = value;
    
} proto(String);

export function Template(value, isEnd, start, end) {
    
    this.start = start;
    this.end = end;
    this.value = value;
    this.templateEnd = isEnd;
    
} proto(Template);

export function RegularExpression(value, flags, start, end) {
    
    this.start = start;
    this.end = end;
    this.value = value;
    this.flags = flags;
    
} proto(RegularExpression);

export function Null(start, end) { 

    this.start = start;
    this.end = end;

} proto(Null);

export function Boolean(value, start, end) {
    
    this.start = start;
    this.end = end;
    this.value = value;
    
} proto(Boolean);

export function ThisExpression(start, end) { 

    this.start = start;
    this.end = end;
    
} proto(ThisExpression);

export function SuperExpression(start, end) { 

    this.start = start;
    this.end = end;
    
} proto(SuperExpression);

export function SequenceExpression(list, start, end) {

    this.start = start;
    this.end = end;
    this.expressions = list;

} proto(SequenceExpression);

export function AssignmentExpression(op, left, right, start, end) {
    
    this.start = start;
    this.end = end;
    this.operator = op;
    this.left = left;
    this.right = right;

} proto(AssignmentExpression);

export function SpreadExpression(expr, start, end) {
    
    this.start = start;
    this.end = end;
    this.expression = expr;
    
} proto(SpreadExpression);

export function YieldExpression(expr, delegate, start, end) {
    
    this.start = start;
    this.end = end;
    this.delegate = delegate;
    this.expression = expr;
    
} proto(YieldExpression);

export function ConditionalExpression(test, cons, alt, start, end) {
    
    this.start = start;
    this.end = end;
    this.test = test;
    this.consequent = cons;
    this.alternate = alt;
    
} proto(ConditionalExpression);

export function BinaryExpression(op, left, right, start, end) {
    
    this.start = start;
    this.end = end;
    this.operator = op;
    this.left = left;
    this.right = right;
    
} proto(BinaryExpression);

export function UpdateExpression(op, expr, prefix, start, end) {
    
    this.start = start;
    this.end = end;
    this.operator = op;
    this.expression = expr;
    this.prefix = prefix;
    
} proto(UpdateExpression);

export function UnaryExpression(op, expr, start, end) {
    
    this.start = start;
    this.end = end;
    this.operator = op;
    this.expression = expr;
    
} proto(UnaryExpression);

export function MemberExpression(obj, prop, computed, start, end) {
    
    this.start = start;
    this.end = end;
    this.object = obj;
    this.property = prop;
    this.computed = computed;
    
} proto(MemberExpression);

export function CallExpression(callee, args, start, end) {
    
    this.start = start;
    this.end = end;
    this.callee = callee;
    this.arguments = args;
    
} proto(CallExpression);

export function TaggedTemplateExpression(tag, template, start, end) {
    
    this.start = start;
    this.end = end;
    this.tag = tag;
    this.template = template;
    
} proto(TaggedTemplateExpression);

export function NewExpression(callee, args, start, end) {
    
    this.start = start;
    this.end = end;
    this.callee = callee;
    this.arguments = args;
    
} proto(NewExpression);

export function ParenExpression(expr, start, end) {
    
    this.start = start;
    this.end = end;
    this.expression = expr;
    
} proto(ParenExpression);

export function ObjectLiteral(props, start, end) {
    
    this.start = start;
    this.end = end;
    this.properties = props;
    
} proto(ObjectLiteral);

export function ComputedPropertyName(expr, start, end) {
    
    this.start = start;
    this.end = end;
    this.expression = expr;
    
} proto(ComputedPropertyName);

export function PropertyDefinition(name, expr, start, end) {
    
    this.start = start;
    this.end = end;
    this.name = name;
    this.expression = expr;
    
} proto(PropertyDefinition);

export function PatternProperty(name, pattern, initializer, start, end) {
    
    this.start = start;
    this.end = end;
    this.name = name;
    this.pattern = pattern;
    this.initializer = initializer;
    
} proto(PatternProperty);

export function PatternElement(pattern, initializer, rest, start, end) {
    
    this.start = start;
    this.end = end;
    this.pattern = pattern;
    this.initializer = initializer;
    this.rest = rest;
    
} proto(PatternElement);

export function MethodDefinition(kind, name, params, body, start, end) {
    
    this.start = start;
    this.end = end;
    this.kind = kind;
    this.name = name;
    this.params = params;
    this.body = body;
    
} proto(MethodDefinition);

export function ArrayLiteral(elements, start, end) {
    
    this.start = start;
    this.end = end;
    this.elements = elements;
    
} proto(ArrayLiteral);

export function ArrayComprehension(qualifiers, expr, start, end) {
    
    this.start = start;
    this.end = end;
    this.qualifiers = qualifiers;
    this.expression = expr;
    
} proto(ArrayComprehension);

export function GeneratorComprehension(qualifiers, expr, start, end) {
    
    this.start = start;
    this.end = end;
    this.qualifiers = qualifiers;
    this.expression = expr;
    
} proto(GeneratorComprehension);

export function ComprehensionFor(left, right, start, end) {
    
    this.start = start;
    this.end = end;
    this.left = left;
    this.right = right;
    
} proto(ComprehensionFor);

export function ComprehensionIf(test, start, end) {
    
    this.start = start;
    this.end = end;
    this.test = test;
    
} proto(ComprehensionIf);

export function TemplateExpression(lits, subs, start, end) {
    
    this.start = start;
    this.end = end;
    this.literals = lits;
    this.substitutions = subs;
    
} proto(TemplateExpression);

export function Block(statements, start, end) {
    
    this.start = start;
    this.end = end;
    this.statements = statements;
    
} proto(Block);

export function LabelledStatement(label, statement, start, end) {
    
    this.start = start;
    this.end = end;
    this.label = label;
    this.statement = statement;
    
} proto(LabelledStatement);

export function ExpressionStatement(expr, start, end) {
    
    this.start = start;
    this.end = end;
    this.expression = expr;
    this.directive = null;
    
} proto(ExpressionStatement);

export function EmptyStatement(start, end) { 

    this.start = start;
    this.end = end;
    
} proto(EmptyStatement);

export function VariableDeclaration(kind, list, start, end) {
    
    this.start = start;
    this.end = end;
    this.kind = kind;
    this.declarations = list;
    
} proto(VariableDeclaration);

export function VariableDeclarator(pattern, initializer, start, end) {
    
    this.start = start;
    this.end = end;
    this.pattern = pattern;
    this.initializer = initializer;
    
} proto(VariableDeclarator);

export function ReturnStatement(arg, start, end) {
    
    this.start = start;
    this.end = end;
    this.argument = arg;
    
} proto(ReturnStatement);

export function BreakStatement(label, start, end) {
    
    this.start = start;
    this.end = end;
    this.label = label;
    
} proto(BreakStatement);

export function ContinueStatement(label, start, end) {
    
    this.start = start;
    this.end = end;
    this.label = label;
    
} proto(ContinueStatement);

export function ThrowStatement(expr, start, end) {
    
    this.start = start;
    this.end = end;
    this.expression = expr;
    
} proto(ThrowStatement);

export function DebuggerStatement(start, end) {
    
    this.start = start;
    this.end = end;
    
} proto(DebuggerStatement);

export function IfStatement(test, cons, alt, start, end) {
    
    this.start = start;
    this.end = end;
    this.test = test;
    this.consequent = cons;
    this.alternate = alt;
    
} proto(IfStatement);

export function DoWhileStatement(body, test, start, end) {
    
    this.start = start;
    this.end = end;
    this.body = body;
    this.test = test;
    
} proto(DoWhileStatement);

export function WhileStatement(test, body, start, end) {
    
    this.start = start;
    this.end = end;
    this.test = test;
    this.body = body;
    
} proto(WhileStatement);

export function ForStatement(initializer, test, update, body, start, end) {
    
    this.start = start;
    this.end = end;
    this.initializer = initializer;
    this.test = test;
    this.update = update;
    this.body = body;
    
} proto(ForStatement);

export function ForInStatement(left, right, body, start, end) {
    
    this.start = start;
    this.end = end;
    this.left = left;
    this.right = right;
    this.body = body;
    
} proto(ForInStatement);

export function ForOfStatement(left, right, body, start, end) {
    
    this.start = start;
    this.end = end;
    this.left = left;
    this.right = right;
    this.body = body;
    
} proto(ForOfStatement);

export function WithStatement(object, body, start, end) {
    
    this.start = start;
    this.end = end;
    this.object = object;
    this.body = body;
    
} proto(WithStatement);

export function SwitchStatement(desc, cases, start, end) {
    
    this.start = start;
    this.end = end;
    this.descriminant = desc;
    this.cases = cases;
    
} proto(SwitchStatement);

export function SwitchCase(test, cons, start, end) {
    
    this.start = start;
    this.end = end;
    this.test = test;
    this.consequent = cons;
    
} proto(SwitchCase);

export function TryStatement(block, handler, fin, start, end) {
    
    this.start = start;
    this.end = end;
    this.block = block;
    this.handler = handler;
    this.finalizer = fin;
    
} proto(TryStatement);

export function CatchClause(param, body, start, end) {
    
    this.start = start;
    this.end = end;
    this.param = param;
    this.body = body;
    
} proto(CatchClause);

export function FunctionDeclaration(kind, identifier, params, body, start, end) {
    
    this.start = start;
    this.end = end;
    this.kind = kind;
    this.identifier = identifier;
    this.params = params;
    this.body = body;
    
} proto(FunctionDeclaration);

export function FunctionExpression(kind, identifier, params, body, start, end) {
    
    this.start = start;
    this.end = end;
    this.kind = kind;
    this.identifier = identifier;
    this.params = params;
    this.body = body;
    
} proto(FunctionExpression);

export function FormalParameter(pattern, initializer, start, end) {
    
    this.start = start;
    this.end = end;
    this.pattern = pattern;
    this.initializer = initializer;
    
} proto(FormalParameter);

export function RestParameter(identifier, start, end) {
    
    this.start = start;
    this.end = end;
    this.identifier = identifier;
    
} proto(RestParameter);

export function FunctionBody(statements, start, end) {
    
    this.start = start;
    this.end = end;
    this.statements = statements;
    
} proto(FunctionBody);

export function ArrowFunctionHead(params, start, end) {
    
    this.start = start;
    this.end = end;
    this.parameters = params;
    
} proto(ArrowFunctionHead);

export function ArrowFunction(kind, params, body, start, end) {
    
    this.start = start;
    this.end = end;
    this.kind = kind;
    this.params = params;
    this.body = body;
    
} proto(ArrowFunction);

export function ModuleDeclaration(identifier, body, start, end) {
    
    this.start = start;
    this.end = end;
    this.identifier = identifier;
    this.body = body;
    
} proto(ModuleDeclaration);

export function ModuleBody(statements, start, end) {
    
    this.start = start;
    this.end = end;
    this.statements = statements;
    
} proto(ModuleBody);

export function ModuleImport(identifier, from, start, end) {
    
    this.start = start;
    this.end = end;
    this.identifier = identifier;
    this.from = from;
    
} proto(ModuleImport);

export function ModuleAlias(identifier, path, start, end) {
    
    this.start = start;
    this.end = end;
    this.identifier = identifier;
    this.path = path;
    
} proto(ModuleAlias);

export function ImportDefaultDeclaration(ident, from, start, end) {
    
    this.start = start;
    this.end = end;
    this.identifier = ident;
    this.from = from;
    
} proto(ImportDefaultDeclaration);

export function ImportDeclaration(specifiers, from, start, end) {
    
    this.start = start;
    this.end = end;
    this.specifiers = specifiers;
    this.from = from;
    
} proto(ImportDeclaration);

export function ImportSpecifier(remote, local, start, end) {
    
    this.start = start;
    this.end = end;
    this.remote = remote;
    this.local = local;
    
} proto(ImportSpecifier);

export function ExportDeclaration(binding, start, end) {
    
    this.start = start;
    this.end = end;
    this.binding = binding;
    
} proto(ExportDeclaration);

export function ExportsList(list, from, start, end) {
    
    this.start = start;
    this.end = end;
    this.specifiers = list;
    this.from = from;
    
} proto(ExportsList);

export function ExportSpecifier(local, remote, start, end) {
    
    this.start = start;
    this.end = end;
    this.local = local;
    this.remote = remote;
    
} proto(ExportSpecifier);

export function ModulePath(list, start, end) {
    
    this.start = start;
    this.end = end;
    this.elements = list;
    
} proto(ModulePath);

export function ClassDeclaration(identifier, base, body, start, end) {
    
    this.start = start;
    this.end = end;
    this.identifier = identifier;
    this.base = base;
    this.body = body;
    
} proto(ClassDeclaration);

export function ClassExpression(identifier, base, body, start, end) {
    
    this.start = start;
    this.end = end;
    this.identifier = identifier;
    this.base = base;
    this.body = body;
    
} proto(ClassExpression);

export function ClassBody(elems, start, end) {
    
    this.start = start;
    this.end = end;
    this.elements = elems;
    
} proto(ClassBody);

export function ClassElement(isStatic, method, start, end) {
    
    this.start = start;
    this.end = end;
    this.static = isStatic;
    this.method = method;
    
} proto(ClassElement);

