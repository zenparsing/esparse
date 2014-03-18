// Initializes common node properties.  This is used in preference
// to super() for performance reasons.
function init(node, type, start, end) {

    node.type = type;
    node.start = start;
    node.end = end;
    node.error = "";
}

export class Node {

    constructor(type, start, end) {
    
        init(this, type, start, end);
    }
    
    forEachChild(fn) {

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
    
}

export class Script extends Node {

    constructor(statements, start, end) {
    
        init(this, "Script", start, end);
        this.statements = statements;
    }
}

export class Module extends Node {

    constructor(statements, start, end) {
    
        init(this, "Module", start, end);
        this.statements = statements;
    }
}

export class Identifier extends Node {

    constructor(value, context, start, end) {
    
        init(this, "Identifier", start, end);
        this.value = value;
        this.context = context;
    }
}

export class Number extends Node {

    constructor(value, start, end) {
    
        init(this, "Number", start, end);
        this.value = value;
    }
}

export class String extends Node {

    constructor(value, start, end) {
    
        init(this, "String", start, end);
        this.value = value;
    }
}

export class Template extends Node {

    constructor(value, isEnd, start, end) {
    
        init(this, "Template", start, end);
        this.value = value;
        this.templateEnd = isEnd;
    }
}

export class RegularExpression extends Node {

    constructor(value, flags, start, end) {
    
        init(this, "RegularExpression", start, end);
        this.value = value;
        this.flags = flags;
    }
}

export class Null extends Node { 

    constructor(start, end) { init(this, "Null", start, end) }
}

export class Boolean extends Node {

    constructor(value, start, end) {
    
        init(this, "Boolean", start, end);
        this.value = value;
    }
}

export class ThisExpression extends Node {

    constructor(start, end) { init(this, "ThisExpression", start, end) }
}

export class SuperExpression extends Node {
    
    constructor(start, end) { init(this, "SuperExpression", start, end) }
}

export class SequenceExpression extends Node {

    constructor(list, start, end) {
    
        init(this, "SequenceExpression", start, end);
        this.expressions = list;
    }
}

export class AssignmentExpression extends Node {

    constructor(op, left, right, start, end) {
    
        init(this, "AssignmentExpression", start, end);
        this.operator = op;
        this.left = left;
        this.right = right;
    }
}

export class SpreadExpression extends Node {

    constructor(expr, start, end) {
    
        init(this, "SpreadExpression", start, end);
        this.expression = expr;
    }
}

export class YieldExpression extends Node {

    constructor(expr, delegate, start, end) {
    
        init(this, "YieldExpression", start, end);
        this.delegate = delegate;
        this.expression = expr;
    }
}

export class ConditionalExpression extends Node {

    constructor(test, cons, alt, start, end) {
    
        init(this, "ConditionalExpression", start, end);
        this.test = test;
        this.consequent = cons;
        this.alternate = alt;
    }
}

export class BinaryExpression extends Node {

    constructor(op, left, right, start, end) {
    
        init(this, "BinaryExpression", start, end);
        this.operator = op;
        this.left = left;
        this.right = right;
    }
}

export class UpdateExpression extends Node {

    constructor(op, expr, prefix, start, end) {
    
        init(this, "UpdateExpression", start, end);
        this.operator = op;
        this.expression = expr;
        this.prefix = prefix;
    }
}

export class UnaryExpression extends Node {

    constructor(op, expr, start, end) {
    
        init(this, "UnaryExpression", start, end);
        this.operator = op;
        this.expression = expr;
    }
}

export class MemberExpression extends Node {

    constructor(obj, prop, computed, start, end) {
    
        init(this, "MemberExpression", start, end);
        this.object = obj;
        this.property = prop;
        this.computed = computed;
    }
}

export class CallExpression extends Node {

    constructor(callee, args, start, end) {
    
        init(this, "CallExpression", start, end);
        this.callee = callee;
        this.arguments = args;
    }
}

export class TaggedTemplateExpression extends Node {

    constructor(tag, template, start, end) {
    
        init(this, "TaggedTemplateExpression", start, end);
        this.tag = tag;
        this.template = template;
    }
}

export class NewExpression extends Node {

    constructor(callee, args, start, end) {
    
        init(this, "NewExpression", start, end);
        this.callee = callee;
        this.arguments = args;
    }
}

export class ParenExpression extends Node {
    
    constructor(expr, start, end) {
    
        init(this, "ParenExpression", start, end);
        this.expression = expr;
    }
}

export class ObjectLiteral extends Node {

    constructor(props, start, end) {
    
        init(this, "ObjectLiteral", start, end);
        this.properties = props;
    }
}

export class ComputedPropertyName extends Node {

    constructor(expr, start, end) {
    
        init(this, "ComputedPropertyName", start, end);
        this.expression = expr;
    }
}

export class PropertyDefinition extends Node {

    constructor(name, expr, start, end) {
    
        init(this, "PropertyDefinition", start, end);
        this.name = name;
        this.expression = expr;
    }
}

export class PatternProperty extends Node {

    constructor(name, pattern, initializer, start, end) {
    
        init(this, "PatternProperty", start, end);
        this.name = name;
        this.pattern = pattern;
        this.initializer = initializer;
    }
}

export class PatternElement extends Node {

    constructor(pattern, initializer, rest, start, end) {
    
        init(this, "PatternElement", start, end);
        this.pattern = pattern;
        this.initializer = initializer;
        this.rest = rest;
    }
}

export class MethodDefinition extends Node {

    constructor(kind, name, params, body, start, end) {
    
        init(this, "MethodDefinition", start, end);
        this.kind = kind;
        this.name = name;
        this.params = params;
        this.body = body;
    }
}

export class ArrayLiteral extends Node {

    constructor(elements, start, end) {
    
        init(this, "ArrayLiteral", start, end);
        this.elements = elements;
    }
}

export class ArrayComprehension extends Node {

    constructor(qualifiers, expr, start, end) {
    
        init(this, "ArrayComprehension", start, end);
        this.qualifiers = qualifiers;
        this.expression = expr;
    }
}

export class GeneratorComprehension extends Node {

    constructor(qualifiers, expr, start, end) {
    
        init(this, "GeneratorComprehension", start, end);
        this.qualifiers = qualifiers;
        this.expression = expr;
    }
}

export class ComprehensionFor extends Node {

    constructor(left, right, start, end) {
    
        init(this, "ComprehensionFor", start, end);
        this.left = left;
        this.right = right;
    }
}

export class ComprehensionIf extends Node {

    constructor(test, start, end) {
    
        init(this, "ComprehensionIf", start, end);
        this.test = test;
    }
}

export class TemplateExpression extends Node {

    constructor(lits, subs, start, end) {
    
        init(this, "TemplateExpression", start, end);
        this.literals = lits;
        this.substitutions = subs;
    }
}

export class Block extends Node {

    constructor(statements, start, end) {
    
        init(this, "Block", start, end);
        this.statements = statements;
    }
}

export class LabelledStatement extends Node {

    constructor(label, statement, start, end) {
    
        init(this, "LabelledStatement", start, end);
        this.label = label;
        this.statement = statement;
    }
}

export class ExpressionStatement extends Node {

    constructor(expr, start, end) {
    
        init(this, "ExpressionStatement", start, end);
        this.expression = expr;
        this.directive = null;
    }
}

export class EmptyStatement extends Node {

    constructor(start, end) { init(this, "EmptyStatement", start, end) }
}

export class VariableDeclaration extends Node {

    constructor(kind, list, start, end) {
    
        init(this, "VariableDeclaration", start, end);
        this.kind = kind;
        this.declarations = list;
    }
}

export class VariableDeclarator extends Node {

    constructor(pattern, initializer, start, end) {
    
        init(this, "VariableDeclarator", start, end);
        this.pattern = pattern;
        this.initializer = initializer;
    }
}

export class ReturnStatement extends Node {

    constructor(arg, start, end) {
    
        init(this, "ReturnStatement", start, end);
        this.argument = arg;
    }
}

export class BreakStatement extends Node {

    constructor(label, start, end) {
    
        init(this, "BreakStatement", start, end);
        this.label = label;
    }
}

export class ContinueStatement extends Node {

    constructor(label, start, end) {
    
        init(this, "ContinueStatement", start, end);
        this.label = label;
    }
}

export class ThrowStatement extends Node {

    constructor(expr, start, end) {
    
        init(this, "ThrowStatement", start, end);
        this.expression = expr;
    }
}

export class DebuggerStatement extends Node {
    
    constructor(start, end) {
    
        init(this, "DebuggerStatement", start, end);
    }
}

export class IfStatement extends Node {

    constructor(test, cons, alt, start, end) {
    
        init(this, "IfStatement", start, end);
        this.test = test;
        this.consequent = cons;
        this.alternate = alt;
    }
}

export class DoWhileStatement extends Node {

    constructor(body, test, start, end) {
    
        init(this, "DoWhileStatement", start, end);
        this.body = body;
        this.test = test;
    }
}

export class WhileStatement extends Node {

    constructor(test, body, start, end) {
    
        init(this, "WhileStatement", start, end);
        this.test = test;
        this.body = body;
    }
}

export class ForStatement extends Node {

    constructor(initializer, test, update, body, start, end) {
    
        init(this, "ForStatement", start, end);
        this.initializer = initializer;
        this.test = test;
        this.update = update;
        this.body = body;
    }
}

export class ForInStatement extends Node {

    constructor(left, right, body, start, end) {
    
        init(this, "ForInStatement", start, end);
        this.left = left;
        this.right = right;
        this.body = body;
    }
}

export class ForOfStatement extends Node {

    constructor(left, right, body, start, end) {
    
        init(this, "ForOfStatement", start, end);
        this.left = left;
        this.right = right;
        this.body = body;
    }
}

export class WithStatement extends Node {

    constructor(object, body, start, end) {
    
        init(this, "WithStatement", start, end);
        this.object = object;
        this.body = body;
    }
}

export class SwitchStatement extends Node {

    constructor(desc, cases, start, end) {
    
        init(this, "SwitchStatement", start, end);
        this.descriminant = desc;
        this.cases = cases;
    }
}

export class SwitchCase extends Node {

    constructor(test, cons, start, end) {
    
        init(this, "SwitchCase", start, end);
        this.test = test;
        this.consequent = cons;
    }
}

export class TryStatement extends Node {

    constructor(block, handler, fin, start, end) {
    
        init(this, "TryStatement", start, end);
        this.block = block;
        this.handler = handler;
        this.finalizer = fin;
    }
}

export class CatchClause extends Node {

    constructor(param, body, start, end) {
    
        init(this, "CatchClause", start, end);
        this.param = param;
        this.body = body;
    }
}

export class FunctionDeclaration extends Node {

    constructor(kind, identifier, params, body, start, end) {
    
        init(this, "FunctionDeclaration", start, end);
        this.kind = kind;
        this.identifier = identifier;
        this.params = params;
        this.body = body;
    }
}

export class FunctionExpression extends Node {

    constructor(kind, identifier, params, body, start, end) {
    
        init(this, "FunctionExpression", start, end);
        this.kind = kind;
        this.identifier = identifier;
        this.params = params;
        this.body = body;
    }
}

export class FormalParameter extends Node {

    constructor(pattern, initializer, start, end) {
    
        init(this, "FormalParameter", start, end);
        this.pattern = pattern;
        this.initializer = initializer;
    }
}

export class RestParameter extends Node {

    constructor(identifier, start, end) {
    
        init(this, "RestParameter", start, end);
        this.identifier = identifier;
    }
}

export class FunctionBody extends Node {

    constructor(statements, start, end) {
    
        init(this, "FunctionBody", start, end);
        this.statements = statements;
    }
}

export class ArrowFunctionHead extends Node {

    constructor(params, start, end) {
    
        init(this, "ArrowFunctionHead", start, end);
        this.parameters = params;
    }
}

export class ArrowFunction extends Node {

    constructor(kind, params, body, start, end) {
    
        init(this, "ArrowFunction", start, end);
        this.kind = kind;
        this.params = params;
        this.body = body;
    }
}

export class ModuleDeclaration extends Node {

    constructor(identifier, body, start, end) {
    
        init(this, "ModuleDeclaration", start, end);
        this.identifier = identifier;
        this.body = body;
    }
}

export class ModuleBody extends Node {

    constructor(statements, start, end) {
    
        init(this, "ModuleBody", start, end);
        this.statements = statements;
    }
}

export class ModuleImport extends Node {

    constructor(identifier, from, start, end) {
    
        init(this, "ModuleImport", start, end);
        this.identifier = identifier;
        this.from = from;
    }
}

export class ModuleAlias extends Node {

    constructor(identifier, path, start, end) {
    
        init(this, "ModuleAlias", start, end);
        this.identifier = identifier;
        this.path = path;
    }
}

export class ImportDefaultDeclaration extends Node {

    constructor(ident, from, start, end) {
    
        init(this, "ImportDefaultDeclaration", start, end);
        this.identifier = ident;
        this.from = from;
    }
}

export class ImportDeclaration extends Node {

    constructor(specifiers, from, start, end) {
    
        init(this, "ImportDeclaration", start, end);
        this.specifiers = specifiers;
        this.from = from;
    }
}

export class ImportSpecifier extends Node {

    constructor(remote, local, start, end) {
    
        init(this, "ImportSpecifier", start, end);
        this.remote = remote;
        this.local = local;
    }
}

export class ExportDeclaration extends Node {

    constructor(binding, start, end) {
    
        init(this, "ExportDeclaration", start, end);
        this.binding = binding;
    }
}

export class ExportsList extends Node {

    constructor(list, from, start, end) {
    
        init(this, "ExportsList", start, end);
        this.specifiers = list;
        this.from = from;
    }
}

export class ExportSpecifier extends Node {

    constructor(local, remote, start, end) {
    
        init(this, "ExportSpecifier", start, end);
        this.local = local;
        this.remote = remote;
    }
}

export class ModulePath extends Node {
    
    constructor(list, start, end) {
    
        init(this, "ModulePath", start, end);
        this.elements = list;
    }
}

export class ClassDeclaration extends Node {

    constructor(identifier, base, body, start, end) {
    
        init(this, "ClassDeclaration", start, end);
        this.identifier = identifier;
        this.base = base;
        this.body = body;
    }
}

export class ClassExpression extends Node {

    constructor(identifier, base, body, start, end) {
    
        init(this, "ClassExpression", start, end);
        this.identifier = identifier;
        this.base = base;
        this.body = body;
    }
}

export class ClassBody extends Node {

    constructor(elems, start, end) {
    
        init(this, "ClassBody", start, end);
        this.elements = elems;
    }
}

export class ClassElement extends Node {

    constructor(isStatic, method, start, end) {
    
        init(this, "ClassElement", start, end);
        this.static = isStatic;
        this.method = method;
    }
}
