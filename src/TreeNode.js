
class Node {

    constructor(start, end) {
    
        this.type = this.constructor.name;
        this.start = start;
        this.end = end;
        this.error = "";
    }
}

export class Script extends Node {

    constructor(statements, start, end) {
    
        super(start, end);
        this.statements = statements;
    }
}

export class Module extends Node {

    constructor(statements, start, end) {
    
        super(start, end);
        this.statements = statements;
    }
}

export class Identifier extends Node {

    constructor(value, context, start, end) {
    
        super(start, end);
        this.value = value;
        this.context = context;
    }
}

export class Number extends Node {

    constructor(value, start, end) {
    
        super(start, end);
        this.value = value;
    }
}

export class String extends Node {

    constructor(value, start, end) {
    
        super(start, end);
        this.value = value;
    }
}

export class Template extends Node {

    constructor(value, isEnd, start, end) {
    
        super(start, end);
        this.value = value;
        this.templateEnd = isEnd;
    }
}

export class RegularExpression extends Node {

    constructor(value, flags, start, end) {
    
        super(start, end);
        this.value = value;
        this.flags = flags;
    }
}

export class Null extends Node {

    constructor(start, end) { super(start, end) }
}

export class Boolean extends Node {

    constructor(value, start, end) {
    
        super(start, end);
        this.value = value;
    }
}

export class ThisExpression extends Node {

    constructor(start, end) { super(start, end) }
}

export class SuperExpression extends Node {

    constructor(start, end) { super(start, end) }
}

export class SequenceExpression extends Node {

    constructor(list, start, end) {
    
        super(start, end);
        this.expressions = list;
    }
}

export class AssignmentExpression extends Node {

    constructor(op, left, right, start, end) {
    
        super(start, end);
        this.operator = op;
        this.left = left;
        this.right = right;
    }
}

export class SpreadExpression extends Node {

    constructor(expr, start, end) {
    
        super(start, end);
        this.expression = expr;
    }
}

export class YieldExpression extends Node {

    constructor(expr, delegate, start, end) {
    
        super(start, end);
        this.delegate = delegate;
        this.expression = expr;
    }
}

export class ConditionalExpression extends Node {

    constructor(test, cons, alt, start, end) {
    
        super(start, end);
        this.test = test;
        this.consequent = cons;
        this.alternate = alt;
    }
}

export class BinaryExpression extends Node {

    constructor(op, left, right, start, end) {
    
        super(start, end);
        this.operator = op;
        this.left = left;
        this.right = right;
    }
}

export class UpdateExpression extends Node {

    constructor(op, expr, prefix, start, end) {
    
        super(start, end);
        this.operator = op;
        this.expression = expr;
        this.prefix = prefix;
    }
}

export class UnaryExpression extends Node {

    constructor(op, expr, start, end) {
    
        super(start, end);
        this.operator = op;
        this.expression = expr;
    }
}

export class MemberExpression extends Node {

    constructor(obj, prop, computed, start, end) {
    
        super(start, end);
        this.object = obj;
        this.property = prop;
        this.computed = computed;
    }
}

export class CallExpression extends Node {

    constructor(callee, args, start, end) {
    
        super(start, end);
        this.callee = callee;
        this.arguments = args;
    }
}

export class TaggedTemplateExpression extends Node {

    constructor(tag, template, start, end) {
    
        super(start, end);
        this.tag = tag;
        this.template = template;
    }
}

export class NewExpression extends Node {

    constructor(callee, args, start, end) {
    
        super(start, end);
        this.callee = callee;
        this.arguments = args;
    }
}

export class ParenExpression extends Node {
    
    constructor(expr, start, end) {
    
        super(start, end);
        this.expression = expr;
    }
}

export class ObjectLiteral extends Node {

    constructor(props, start, end) {
    
        super(start, end);
        this.properties = props;
    }
}

export class ComputedPropertyName extends Node {

    constructor(expr, start, end) {
    
        super(start, end);
        this.expression = expr;
    }
}

export class PropertyDefinition extends Node {

    constructor(name, expr, start, end) {
    
        super(start, end);
        this.name = name;
        this.expression = expr;
    }
}

export class PatternProperty extends Node {

    constructor(name, pattern, initializer, start, end) {
    
        super(start, end);
        this.name = name;
        this.pattern = pattern;
        this.initializer = initializer;
    }
}

export class PatternElement extends Node {

    constructor(pattern, initializer, rest, start, end) {
    
        super(start, end);
        this.pattern = pattern;
        this.initializer = initializer;
        this.rest = rest;
    }
}

export class MethodDefinition extends Node {

    constructor(kind, name, params, body, start, end) {
    
        super(start, end);
        this.kind = kind;
        this.name = name;
        this.params = params;
        this.body = body;
    }
}

export class ArrayLiteral extends Node {

    constructor(elements, start, end) {
    
        super(start, end);
        this.elements = elements;
    }
}

export class ArrayComprehension extends Node {

    constructor(qualifiers, expr, start, end) {
    
        super(start, end);
        this.qualifiers = qualifiers;
        this.expression = expr;
    }
}

export class GeneratorComprehension extends Node {

    constructor(qualifiers, expr, start, end) {
    
        super(start, end);
        this.qualifiers = qualifiers;
        this.expression = expr;
    }
}

export class ComprehensionFor extends Node {

    constructor(left, right, start, end) {
    
        super(start, end);
        this.left = left;
        this.right = right;
    }
}

export class ComprehensionIf extends Node {

    constructor(test, start, end) {
    
        super(start, end);
        this.test = test;
    }
}

export class TemplateExpression extends Node {

    constructor(lits, subs, start, end) {
    
        super(start, end);
        this.literals = lits;
        this.substitutions = subs;
    }
}

export class Block extends Node {

    constructor(statements, start, end) {
    
        super(start, end);
        this.statements = statements;
    }
}

export class LabelledStatement extends Node {

    constructor(label, statement, start, end) {
    
        super(start, end);
        this.label = label;
        this.statement = statement;
    }
}

export class ExpressionStatement extends Node {

    constructor(expr, start, end) {
    
        super(start, end);
        this.expression = expr;
        this.directive = null;
    }
}

export class EmptyStatement extends Node {

    constructor(start, end) { super(start, end) }
}

export class VariableDeclaration extends Node {

    constructor(kind, list, start, end) {
    
        super(start, end);
        this.kind = kind;
        this.declarations = list;
    }
}

export class VariableDeclarator extends Node {

    constructor(pattern, initializer, start, end) {
    
        super(start, end);
        this.pattern = pattern;
        this.initializer = initializer;
    }
}

export class ReturnStatement extends Node {

    constructor(arg, start, end) {
    
        super(start, end);
        this.argument = arg;
    }
}

export class BreakStatement extends Node {

    constructor(label, start, end) {
    
        super(start, end);
        this.label = label;
    }
}

export class ContinueStatement extends Node {

    constructor(label, start, end) {
    
        super(start, end);
        this.label = label;
    }
}

export class ThrowStatement extends Node {

    constructor(expr, start, end) {
    
        super(start, end);
        this.expression = expr;
    }
}

export class DebuggerStatement extends Node {

    constructor(start, end) { super(start, end) }
}

export class IfStatement extends Node {

    constructor(test, cons, alt, start, end) {
    
        super(start, end);
        this.test = test;
        this.consequent = cons;
        this.alternate = alt;
    }
}

export class DoWhileStatement extends Node {

    constructor(body, test, start, end) {
    
        super(start, end);
        this.body = body;
        this.test = test;
    }
}

export class WhileStatement extends Node {

    constructor(test, body, start, end) {
    
        super(start, end);
        this.test = test;
        this.body = body;
    }
}

export class ForStatement extends Node {

    constructor(initializer, test, update, body, start, end) {
    
        super(start, end);
        this.initializer = initializer;
        this.test = test;
        this.update = update;
        this.body = body;
    }
}

export class ForInStatement extends Node {

    constructor(left, right, body, start, end) {
    
        super(start, end);
        this.left = left;
        this.right = right;
        this.body = body;
    }
}

export class ForOfStatement extends Node {

    constructor(left, right, body, start, end) {
    
        super(start, end);
        this.left = left;
        this.right = right;
        this.body = body;
    }
}

export class WithStatement extends Node {

    constructor(object, body, start, end) {
    
        super(start, end);
        this.object = object;
        this.body = body;
    }
}

export class SwitchStatement extends Node {

    constructor(desc, cases, start, end) {
    
        super(start, end);
        this.descriminant = desc;
        this.cases = cases;
    }
}

export class SwitchCase extends Node {

    constructor(test, cons, start, end) {
    
        super(start, end);
        this.test = test;
        this.consequent = cons;
    }
}

export class TryStatement extends Node {

    constructor(block, handler, fin, start, end) {
    
        super(start, end);
        this.block = block;
        this.handler = handler;
        this.finalizer = fin;
    }
}

export class CatchClause extends Node {

    constructor(param, body, start, end) {
    
        super(start, end);
        this.param = param;
        this.body = body;
    }
}

export class FunctionDeclaration extends Node {

    constructor(kind, identifier, params, body, start, end) {
    
        super(start, end);
        this.kind = kind;
        this.identifier = identifier;
        this.params = params;
        this.body = body;
    }
}

export class FunctionExpression extends Node {

    constructor(kind, identifier, params, body, start, end) {
    
        super(start, end);
        this.kind = kind;
        this.identifier = identifier;
        this.params = params;
        this.body = body;
    }
}

export class FormalParameter extends Node {

    constructor(pattern, initializer, start, end) {
    
        super(start, end);
        this.pattern = pattern;
        this.initializer = initializer;
    }
}

export class RestParameter extends Node {

    constructor(identifier, start, end) {
    
        super(start, end);
        this.identifier = identifier;
    }
}

export class FunctionBody extends Node {

    constructor(statements, start, end) {
    
        super(start, end);
        this.statements = statements;
    }
}

export class ArrowFunctionHead extends Node {

    constructor(params, start, end) {
    
        super(start, end);
        this.parameters = params;
    }
}

export class ArrowFunction extends Node {

    constructor(params, body, start, end) {
    
        super(start, end);
        this.params = params;
        this.body = body;
    }
}

export class ModuleDeclaration extends Node {

    constructor(identifier, body, start, end) {
    
        super(start, end);
        this.identifier = identifier;
        this.body = body;
    }
}

export class ModuleBody extends Node {

    constructor(statements, start, end) {
    
        super(start, end);
        this.statements = statements;
    }
}

export class ModuleFromDeclaration extends Node {

    constructor(identifier, from, start, end) {
    
        super(start, end);
        this.identifier = identifier;
        this.from = from;
    }
}

export class ModuleAlias extends Node {

    constructor(identifier, path, start, end) {
    
        super(start, end);
        this.identifier = identifier;
        this.path = path;
    }
}

export class ImportDefaultDeclaration extends Node {

    constructor(ident, from, start, end) {
    
        super(start, end);
        this.identifier = ident;
        this.from = from;
    }
}

export class ImportDeclaration extends Node {

    constructor(specifiers, from, start, end) {
    
        super(start, end);
        this.specifiers = specifiers;
        this.from = from;
    }
}

export class ImportSpecifier extends Node {

    constructor(remote, local, start, end) {
    
        super(start, end);
        this.remote = remote;
        this.local = local;
    }
}

export class ExportDeclaration extends Node {

    constructor(binding, start, end) {
    
        super(start, end);
        this.binding = binding;
    }
}

export class ExportsList extends Node {

    constructor(list, from, start, end) {
    
        super(start, end);
        this.specifiers = list;
        this.from = from;
    }
}

export class ExportSpecifier extends Node {

    constructor(local, remote, start, end) {
    
        super(start, end);
        this.local = local;
        this.remote = remote;
    }
}

export class ModulePath extends Node {
    
    constructor(list, start, end) {
    
        super(start, end);
        this.elements = list;
    }
}

export class ClassDeclaration extends Node {

    constructor(identifier, base, body, start, end) {
    
        super(start, end);
        this.identifier = identifier;
        this.base = base;
        this.body = body;
    }
}

export class ClassExpression extends Node {

    constructor(identifier, base, body, start, end) {
    
        super(start, end);
        this.identifier = identifier;
        this.base = base;
        this.body = body;
    }
}

export class ClassBody extends Node {

    constructor(elems, start, end) {
    
        super(start, end);
        this.elements = elems;
    }
}

export class ClassElement extends Node {

    constructor(isStatic, method, start, end) {
    
        super(start, end);
        this.static = isStatic;
        this.method = method;
    }
}
