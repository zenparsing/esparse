
export class Script {

    constructor(statements, start, end) {
    
        this.type = "Script";
        this.statements = statements;
        this.start = start;
        this.end = end;
    }
}

export class Module {

    constructor(statements, start, end) {
    
        this.type = "Module";
        this.statements = statements;
        this.start = start;
        this.end = end;
    }
}

export class Identifier {

    constructor(value, context, start, end) {
    
        this.type = "Identifier";
        this.value = value;
        this.context = context;
        this.start = start;
        this.end = end;
    }
}

export class Number {

    constructor(value, start, end) {
    
        this.type = "Number";
        this.value = value;
        this.start = start;
        this.end = end;
    }
}

export class String {

    constructor(value, start, end) {
    
        this.type = "String";
        this.value = value;
        this.start = start;
        this.end = end;
    }
}

export class Template {

    constructor(value, isEnd, start, end) {
    
        this.type = "Template";
        this.value = value;
        this.templateEnd = isEnd;
        this.start = start;
        this.end = end;
    }
}

export class RegularExpression {

    constructor(value, flags, start, end) {
    
        this.type = "RegularExpression";
        this.value = value;
        this.flags = flags;
        this.start = start;
        this.end = end;
    }
}

export class Null {

    constructor(start, end) {
    
        this.type = "Null";
        this.start = start;
        this.end = end;
    }
}

export class Boolean {

    constructor(value, start, end) {
    
        this.type = "Boolean";
        this.value = value;
        this.start = start;
        this.end = end;
    }
}

export class ThisExpression {

    constructor(start, end) {
    
        this.type = "ThisExpression";
        this.start = start;
        this.end = end;
    }
}

export class SuperExpression {

    constructor(start, end) {
    
        this.type = "SuperExpression";
        this.start = start;
        this.end = end;
    }
}

export class SequenceExpression {

    constructor(list, start, end) {
    
        this.type = "SequenceExpression";
        this.expressions = list;
        this.start = start;
        this.end = end;
    }
}

export class AssignmentExpression {

    constructor(op, left, right, start, end) {
    
        this.type = "AssignmentExpression";
        this.operator = op;
        this.left = left;
        this.right = right;
        this.start = start;
        this.end = end;
    }
}

export class SpreadExpression {

    constructor(expr, start, end) {
    
        this.type = "SpreadExpression";
        this.expression = expr;
        this.start = start;
        this.end = end;
    }
}

export class YieldExpression {

    constructor(expr, delegate, start, end) {
    
        this.type = "YieldExpression";
        this.delegate = delegate;
        this.expression = expr;
        this.start = start;
        this.end = end;
    }
}

export class ConditionalExpression {

    constructor(test, cons, alt, start, end) {
    
        this.type = "ConditionalExpression";
        this.test = test;
        this.consequent = cons;
        this.alternate = alt;
        this.start = start;
        this.end = end;
    }
}

export class BinaryExpression {

    constructor(op, left, right, start, end) {
    
        this.type = "BinaryExpression";
        this.operator = op;
        this.left = left;
        this.right = right;
        this.start = start;
        this.end = end;
    }
}

export class UpdateExpression {

    constructor(op, expr, prefix, start, end) {
    
        this.type = "UpdateExpression";
        this.operator = op;
        this.expression = expr;
        this.prefix = prefix;
        this.start = start;
        this.end = end;
    }
}

export class UnaryExpression {

    constructor(op, expr, start, end) {
    
        this.type = "UnaryExpression";
        this.operator = op;
        this.expression = expr;
        this.start = start;
        this.end = end;
    }
}

export class MemberExpression {

    constructor(obj, prop, computed, start, end) {
    
        this.type = "MemberExpression";
        this.object = obj;
        this.property = prop;
        this.computed = computed;
        this.start = start;
        this.end = end;
    }
}

export class CallExpression {

    constructor(callee, args, start, end) {
    
        this.type = "CallExpression";
        this.callee = callee;
        this.arguments = args;
        this.start = start;
        this.end = end;
    }
}

export class TaggedTemplateExpression {

    constructor(tag, template, start, end) {
    
        this.type = "TaggedTemplateExpression";
        this.tag = tag;
        this.template = template;
        this.start = start;
        this.end = end;
    }
}

export class NewExpression {

    constructor(callee, args, start, end) {
    
        this.type = "NewExpression";
        this.callee = callee;
        this.arguments = args;
        this.start = start;
        this.end = end;
    }
}

export class ParenExpression {
    
    constructor(expr, start, end) {
    
        this.type = "ParenExpression";
        this.expression = expr;
        this.start = start;
        this.end = end;
    }
}

export class ObjectExpression {

    constructor(props, start, end) {
    
        this.type = "ObjectExpression";
        this.properties = props;
        this.start = start;
        this.end = end;
    }
}

export class PropertyDefinition {

    constructor(name, expr, start, end) {
    
        this.type = "PropertyDefinition";
        this.name = name;
        this.expression = expr;
        this.start = start;
        this.end = end;
    }
}

export class CoveredPatternProperty {

    constructor(name, pattern, init, start, end) {
    
        this.type = "CoveredPatternProperty";
        this.name = name;
        this.pattern = pattern;
        this.init = init;
        this.start = start;
        this.end = end;
    }
}

export class MethodDefinition {

    constructor(modifier, name, params, body, start, end) {
    
        this.type = "MethodDefinition";
        this.modifier = modifier;
        this.name = name;
        this.params = params;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}

export class ArrayExpression {

    constructor(elements, start, end) {
    
        this.type = "ArrayExpression";
        this.elements = elements;
        this.start = start;
        this.end = end;
    }
}

export class ArrayComprehension {

    constructor(qualifiers, expr, start, end) {
    
        this.type = "ArrayComprehension";
        this.qualifiers = qualifiers;
        this.expression = expr;
        this.start = start;
        this.end = end;
    }
}

export class GeneratorComprehension {

    constructor(qualifiers, expr, start, end) {
    
        this.type = "GeneratorComprehension";
        this.qualifiers = qualifiers;
        this.expression = expr;
        this.start = start;
        this.end = end;
    }
}

export class ComprehensionFor {

    constructor(left, right, start, end) {
    
        this.type = "ComprehensionFor";
        this.left = left;
        this.right = right;
        this.start = start;
        this.end = end;
    }
}

export class ComprehensionIf {

    constructor(test, start, end) {
    
        this.type = "ComprehensionIf";
        this.test = test;
        this.start = start;
        this.end = end;
    }
}

export class TemplateExpression {

    constructor(lits, subs, start, end) {
    
        this.type = "TemplateExpression";
        this.literals = lits;
        this.substitutions = subs;
        this.start = start;
        this.end = end;
    }
}

export class Block {

    constructor(statements, start, end) {
    
        this.type = "Block";
        this.statements = statements;
        this.start = start;
        this.end = end;
    }
}

export class LabelledStatement {

    constructor(label, statement) {
    
        this.type = "LabelledStatement";
        this.label = label;
        this.statement = statement;
    }
}

export class ExpressionStatement {

    constructor(expr, start, end) {
    
        this.type = "ExpressionStatement";
        this.expression = expr;
        this.directive = null;
        this.start = start;
        this.end = end;
    }
}

export class EmptyStatement {

    constructor(start, end) {
    
        this.type = "EmptyStatement";
        this.start = start;
        this.end = end;
    }
}

export class VariableDeclaration {

    constructor(keyword, list, start, end) {
    
        this.type = "VariableDeclaration";
        this.keyword = keyword;
        this.declarations = list;
        this.start = start;
        this.end = end;
    }
}

export class VariableDeclarator {

    constructor(pattern, init, start, end) {
    
        this.type = "VariableDeclarator";
        this.pattern = pattern;
        this.init = init;
        this.start = start;
        this.end = end;
    }
}

export class ReturnStatement {

    constructor(arg, start, end) {
    
        this.type = "ReturnStatement";
        this.argument = arg;
        this.start = start;
        this.end = end;
    }
}

export class BreakStatement {

    constructor(label, start, end) {
    
        this.type = "BreakStatement";
        this.start = start;
        this.end = end;
    }
}

export class ContinueStatement {

    constructor(label, start, end) {
    
        this.type = "ContinueStatement";
        this.start = start;
        this.end = end;
    }
}

export class ThrowStatement {

    constructor(expr, start, end) {
    
        this.type = "ThrowStatement";
        this.expression = expr;
        this.start = start;
        this.end = end;
    }
}

export class DebuggerStatement {

    constructor(start, end) {
    
        this.type = "DebuggerStatement";
        this.start = start;
        this.end = end;
    }
}

export class IfStatement {

    constructor(test, cons, alt, start, end) {
    
        this.type = "IfStatement";
        this.test = test;
        this.consequent = cons;
        this.alternate = alt;
        this.start = start;
        this.end = end;
    }
}

export class DoWhileStatement {

    constructor(body, test, start, end) {
    
        this.type = "DoWhileStatement";
        this.body = body;
        this.test = test;
        this.start = start;
        this.end = end;
    }
}

export class WhileStatement {

    constructor(test, body, start, end) {
    
        this.type = "WhileStatement";
        this.test = test;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}

export class ForStatement {

    constructor(init, test, update, body, start, end) {
    
        this.type = "ForStatement";
        this.init = init;
        this.test = test;
        this.update = update;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}

export class ForInStatement {

    constructor(left, right, body, start, end) {
    
        this.type = "ForInStatement";
        this.left = left;
        this.right = right;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}

export class ForOfStatement {

    constructor(left, right, body, start, end) {
    
        this.type = "ForOfStatement";
        this.left = left;
        this.right = right;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}

export class WithStatement {

    constructor(object, body, start, end) {
    
        this.type = "WithStatement";
        this.object = object;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}

export class SwitchStatement {

    constructor(desc, cases, start, end) {
    
        this.type = "SwitchStatement";
        this.descriminant = desc;
        this.cases = cases;
        this.start = start;
        this.end = end;
    }
}

export class SwitchCase {

    constructor(test, cons, start, end) {
    
        this.type = "SwitchCase";
        this.test = test;
        this.consequent = cons;
        this.start = start;
        this.end = end;
    }
}

export class TryStatement {

    constructor(block, handler, fin, start, end) {
    
        this.type = "TryStatement";
        this.block = block;
        this.handler = handler;
        this.finalizer = fin;
        this.start = start;
        this.end = end;
    }
}

export class CatchClause {

    constructor(param, body, start, end) {
    
        this.type = "CatchClause";
        this.param = param;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}

export class FunctionDeclaration {

    constructor(gen, ident, params, body, start, end) {
    
        this.type = "FunctionDeclaration";
        this.generator = gen;
        this.ident = ident;
        this.params = params;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}

export class FunctionExpression {

    constructor(gen, ident, params, body, start, end) {
    
        this.type = "FunctionExpression";
        this.generator = gen;
        this.ident = ident;
        this.params = params;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}

export class FormalParameter {

    constructor(pattern, init, start, end) {
    
        this.type = "FormalParameter";
        this.pattern = pattern;
        this.init = init;
        this.start = start;
        this.end = end;
    }
}

export class RestParameter {

    constructor(ident, start, end) {
    
        this.type = "RestParameter";
        this.ident = ident;
        this.start = start;
        this.end = end;
    }
}

export class FunctionBody {

    constructor(statements, start, end) {
    
        this.type = "FunctionBody";
        this.statements = statements;
        this.start = start;
        this.end = end;
    }
}

export class ArrowFunction {

    constructor(params, body, start, end) {
    
        this.type = "ArrowFunction";
        this.params = params;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}

export class ModuleDeclaration {

    constructor(url, body, start, end) {
    
        this.type = "ModuleDeclaration";
        this.url = url;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}

export class ModuleBody {

    constructor(statements, start, end) {
    
        this.type = "ModuleBody";
        this.statements = statements;
        this.start = start;
        this.end = end;
    }
}

export class ImportAsDeclaration {

    constructor(from, ident, start, end) {
    
        this.type = "ImportAsDeclaration";
        this.from = from;
        this.ident = ident;
        this.start = start;
        this.end = end;
    }
}

export class ImportDeclaration {

    constructor(binding, from, start, end) {
    
        this.type = "ImportDeclaration";
        this.binding = binding;
        this.from = from;
        this.start = start;
        this.end = end;
    }
}

export class ImportSpecifierSet {

    constructor(list, start, end) {
    
        this.type = "ImportSpecifierSet";
        this.specifiers = list;
        this.start = start;
        this.end = end;
    }
}

export class ImportSpecifier {

    constructor(name, ident, start, end) {
    
        this.type = "ImportSpecifier";
        this.name = name;
        this.ident = ident;
        this.start = start;
        this.end = end;
    }
}

export class ExportDeclaration {

    constructor(binding, from, start, end) {
    
        this.type = "ExportDeclaration";
        this.binding = binding;
        this.from = from;
        this.start = start;
        this.end = end;
    }
}

export class ExportSpecifierSet {

    constructor(list, start, end) {
    
        this.type = "ExportSpecifierSet";
        this.specifiers = list;
        this.start = start;
        this.end = end;
    }
}

export class ExportSpecifier {

    constructor(ident, path, start, end) {
    
        this.type = "ExportSpecifier";
        this.ident = ident;
        this.path = path;
        this.start = start;
        this.end = end;
    }
}

export class BindingPath {
    
    constructor(list, start, end) {
    
        this.type = "BindingPath";
        this.elements = list;
        this.start = start;
        this.end = end;
    }
}

export class ClassDeclaration {

    constructor(ident, base, body, start, end) {
    
        this.type = "ClassDeclaration";
        this.ident = ident;
        this.base = base;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}

export class ClassExpression {

    constructor(ident, base, body, start, end) {
    
        this.type = "ClassExpression";
        this.ident = ident;
        this.base = base;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}

export class ClassBody {

    constructor(elems, start, end) {
    
        this.type = "ClassBody";
        this.elements = elems;
        this.start = start;
        this.end = end;
    }
}

export class ClassElement {

    constructor(isStatic, method, start, end) {
    
        this.type = "ClassElement";
        this.static = isStatic;
        this.method = method;
        this.start = start;
        this.end = end;
    }
}
