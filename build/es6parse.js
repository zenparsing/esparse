/*=es6now=*/(function(fn, deps) { if (typeof exports !== 'undefined') fn.call(typeof global === 'object' ? global : this, require, exports); else if (typeof __MODULE === 'function') __MODULE(fn, deps); else if (typeof define === 'function' && define.amd) define(['require', 'exports'].concat(deps), fn); else if (typeof window !== 'undefined' && "") fn.call(window, null, window[""] = {}); else fn.call(window || this, null, {}); })(function(require, exports) { "use strict"; 

var __modules = [], __exports = [], __global = this; 

function __require(i, obj) { 
    var e = __exports; 
    if (e[i] !== void 0) return e[i]; 
    __modules[i].call(__global, e[i] = (obj || {})); 
    return e[i]; 
} 

__modules[0] = function(exports) {
var Node = __require(1);
var Parser = __require(2).Parser;
var Scanner = __require(3).Scanner;



function parseModule(input, options) {

    return new Parser(input, options).parseModule();
}

function parseScript(input, options) {

    return new Parser(input, options).parseScript();
}

function forEachChild(node, fn) {

    var keys = Object.keys(node), val, i, j;
    
    for (i = 0; i < keys.length; ++i) {
    
        if (keys[i] === "parentNode")
            continue;
            
        val = node[keys[i]];
        
        // Skip non-objects
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


exports.Parser = Parser;
exports.Scanner = Scanner;
exports.Node = Node;
exports.parseModule = parseModule;
exports.parseScript = parseScript;
exports.forEachChild = forEachChild;
};

__modules[1] = function(exports) {

var Script = es6now.Class(function(__super) { return {

    constructor: function(statements, start, end) {
    
        this.type = "Script";
        this.statements = statements;
        this.start = start;
        this.end = end;
    }
}});

var Module = es6now.Class(function(__super) { return {

    constructor: function(statements, start, end) {
    
        this.type = "Module";
        this.statements = statements;
        this.start = start;
        this.end = end;
    }
}});

var Identifier = es6now.Class(function(__super) { return {

    constructor: function(value, context, start, end) {
    
        this.type = "Identifier";
        this.value = value;
        this.context = context;
        this.start = start;
        this.end = end;
    }
}});

var Number = es6now.Class(function(__super) { return {

    constructor: function(value, start, end) {
    
        this.type = "Number";
        this.value = value;
        this.start = start;
        this.end = end;
    }
}});

var String = es6now.Class(function(__super) { return {

    constructor: function(value, start, end) {
    
        this.type = "String";
        this.value = value;
        this.start = start;
        this.end = end;
    }
}});

var Template = es6now.Class(function(__super) { return {

    constructor: function(value, isEnd, start, end) {
    
        this.type = "Template";
        this.value = value;
        this.templateEnd = isEnd;
        this.start = start;
        this.end = end;
    }
}});

var RegularExpression = es6now.Class(function(__super) { return {

    constructor: function(value, flags, start, end) {
    
        this.type = "RegularExpression";
        this.value = value;
        this.flags = flags;
        this.start = start;
        this.end = end;
    }
}});

var Null = es6now.Class(function(__super) { return {

    constructor: function(start, end) {
    
        this.type = "Null";
        this.start = start;
        this.end = end;
    }
}});

var Boolean = es6now.Class(function(__super) { return {

    constructor: function(value, start, end) {
    
        this.type = "Boolean";
        this.value = value;
        this.start = start;
        this.end = end;
    }
}});

var ThisExpression = es6now.Class(function(__super) { return {

    constructor: function(start, end) {
    
        this.type = "ThisExpression";
        this.start = start;
        this.end = end;
    }
}});

var SuperExpression = es6now.Class(function(__super) { return {

    constructor: function(start, end) {
    
        this.type = "SuperExpression";
        this.start = start;
        this.end = end;
    }
}});

var SequenceExpression = es6now.Class(function(__super) { return {

    constructor: function(list, start, end) {
    
        this.type = "SequenceExpression";
        this.expressions = list;
        this.start = start;
        this.end = end;
    }
}});

var AssignmentExpression = es6now.Class(function(__super) { return {

    constructor: function(op, left, right, start, end) {
    
        this.type = "AssignmentExpression";
        this.operator = op;
        this.left = left;
        this.right = right;
        this.start = start;
        this.end = end;
    }
}});

var SpreadExpression = es6now.Class(function(__super) { return {

    constructor: function(expr, start, end) {
    
        this.type = "SpreadExpression";
        this.expression = expr;
        this.start = start;
        this.end = end;
    }
}});

var YieldExpression = es6now.Class(function(__super) { return {

    constructor: function(expr, delegate, start, end) {
    
        this.type = "YieldExpression";
        this.delegate = delegate;
        this.expression = expr;
        this.start = start;
        this.end = end;
    }
}});

var ConditionalExpression = es6now.Class(function(__super) { return {

    constructor: function(test, cons, alt, start, end) {
    
        this.type = "ConditionalExpression";
        this.test = test;
        this.consequent = cons;
        this.alternate = alt;
        this.start = start;
        this.end = end;
    }
}});

var BinaryExpression = es6now.Class(function(__super) { return {

    constructor: function(op, left, right, start, end) {
    
        this.type = "BinaryExpression";
        this.operator = op;
        this.left = left;
        this.right = right;
        this.start = start;
        this.end = end;
    }
}});

var UpdateExpression = es6now.Class(function(__super) { return {

    constructor: function(op, expr, prefix, start, end) {
    
        this.type = "UpdateExpression";
        this.operator = op;
        this.expression = expr;
        this.prefix = prefix;
        this.start = start;
        this.end = end;
    }
}});

var UnaryExpression = es6now.Class(function(__super) { return {

    constructor: function(op, expr, start, end) {
    
        this.type = "UnaryExpression";
        this.operator = op;
        this.expression = expr;
        this.start = start;
        this.end = end;
    }
}});

var MemberExpression = es6now.Class(function(__super) { return {

    constructor: function(obj, prop, computed, start, end) {
    
        this.type = "MemberExpression";
        this.object = obj;
        this.property = prop;
        this.computed = computed;
        this.start = start;
        this.end = end;
    }
}});

var CallExpression = es6now.Class(function(__super) { return {

    constructor: function(callee, args, start, end) {
    
        this.type = "CallExpression";
        this.callee = callee;
        this.arguments = args;
        this.start = start;
        this.end = end;
    }
}});

var TaggedTemplateExpression = es6now.Class(function(__super) { return {

    constructor: function(tag, template, start, end) {
    
        this.type = "TaggedTemplateExpression";
        this.tag = tag;
        this.template = template;
        this.start = start;
        this.end = end;
    }
}});

var NewExpression = es6now.Class(function(__super) { return {

    constructor: function(callee, args, start, end) {
    
        this.type = "NewExpression";
        this.callee = callee;
        this.arguments = args;
        this.start = start;
        this.end = end;
    }
}});

var ParenExpression = es6now.Class(function(__super) { return {
    
    constructor: function(expr, start, end) {
    
        this.type = "ParenExpression";
        this.expression = expr;
        this.start = start;
        this.end = end;
    }
}});

var ObjectExpression = es6now.Class(function(__super) { return {

    constructor: function(props, start, end) {
    
        this.type = "ObjectExpression";
        this.properties = props;
        this.start = start;
        this.end = end;
    }
}});

var PropertyDefinition = es6now.Class(function(__super) { return {

    constructor: function(name, expr, start, end) {
    
        this.type = "PropertyDefinition";
        this.name = name;
        this.expression = expr;
        this.start = start;
        this.end = end;
    }
}});

var CoveredPatternProperty = es6now.Class(function(__super) { return {

    constructor: function(name, pattern, init, start, end) {
    
        this.type = "CoveredPatternProperty";
        this.name = name;
        this.pattern = pattern;
        this.init = init;
        this.start = start;
        this.end = end;
    }
}});

var MethodDefinition = es6now.Class(function(__super) { return {

    constructor: function(modifier, name, params, body, start, end) {
    
        this.type = "MethodDefinition";
        this.modifier = modifier;
        this.name = name;
        this.params = params;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}});

var ArrayExpression = es6now.Class(function(__super) { return {

    constructor: function(elements, start, end) {
    
        this.type = "ArrayExpression";
        this.elements = elements;
        this.start = start;
        this.end = end;
    }
}});

var ArrayComprehension = es6now.Class(function(__super) { return {

    constructor: function(qualifiers, expr, start, end) {
    
        this.type = "ArrayComprehension";
        this.qualifiers = qualifiers;
        this.expression = expr;
        this.start = start;
        this.end = end;
    }
}});

var GeneratorComprehension = es6now.Class(function(__super) { return {

    constructor: function(qualifiers, expr, start, end) {
    
        this.type = "GeneratorComprehension";
        this.qualifiers = qualifiers;
        this.expression = expr;
        this.start = start;
        this.end = end;
    }
}});

var ComprehensionFor = es6now.Class(function(__super) { return {

    constructor: function(left, right, start, end) {
    
        this.type = "ComprehensionFor";
        this.left = left;
        this.right = right;
        this.start = start;
        this.end = end;
    }
}});

var ComprehensionIf = es6now.Class(function(__super) { return {

    constructor: function(test, start, end) {
    
        this.type = "ComprehensionIf";
        this.test = test;
        this.start = start;
        this.end = end;
    }
}});

var TemplateExpression = es6now.Class(function(__super) { return {

    constructor: function(lits, subs, start, end) {
    
        this.type = "TemplateExpression";
        this.literals = lits;
        this.substitutions = subs;
        this.start = start;
        this.end = end;
    }
}});

var Block = es6now.Class(function(__super) { return {

    constructor: function(statements, start, end) {
    
        this.type = "Block";
        this.statements = statements;
        this.start = start;
        this.end = end;
    }
}});

var LabelledStatement = es6now.Class(function(__super) { return {

    constructor: function(label, statement) {
    
        this.type = "LabelledStatement";
        this.label = label;
        this.statement = statement;
    }
}});

var ExpressionStatement = es6now.Class(function(__super) { return {

    constructor: function(expr, start, end) {
    
        this.type = "ExpressionStatement";
        this.expression = expr;
        this.directive = null;
        this.start = start;
        this.end = end;
    }
}});

var EmptyStatement = es6now.Class(function(__super) { return {

    constructor: function(start, end) {
    
        this.type = "EmptyStatement";
        this.start = start;
        this.end = end;
    }
}});

var VariableDeclaration = es6now.Class(function(__super) { return {

    constructor: function(keyword, list, start, end) {
    
        this.type = "VariableDeclaration";
        this.keyword = keyword;
        this.declarations = list;
        this.start = start;
        this.end = end;
    }
}});

var VariableDeclarator = es6now.Class(function(__super) { return {

    constructor: function(pattern, init, start, end) {
    
        this.type = "VariableDeclarator";
        this.pattern = pattern;
        this.init = init;
        this.start = start;
        this.end = end;
    }
}});

var ReturnStatement = es6now.Class(function(__super) { return {

    constructor: function(arg, start, end) {
    
        this.type = "ReturnStatement";
        this.argument = arg;
        this.start = start;
        this.end = end;
    }
}});

var BreakStatement = es6now.Class(function(__super) { return {

    constructor: function(label, start, end) {
    
        this.type = "BreakStatement";
        this.start = start;
        this.end = end;
    }
}});

var ContinueStatement = es6now.Class(function(__super) { return {

    constructor: function(label, start, end) {
    
        this.type = "ContinueStatement";
        this.start = start;
        this.end = end;
    }
}});

var ThrowStatement = es6now.Class(function(__super) { return {

    constructor: function(expr, start, end) {
    
        this.type = "ThrowStatement";
        this.expression = expr;
        this.start = start;
        this.end = end;
    }
}});

var DebuggerStatement = es6now.Class(function(__super) { return {

    constructor: function(start, end) {
    
        this.type = "DebuggerStatement";
        this.start = start;
        this.end = end;
    }
}});

var IfStatement = es6now.Class(function(__super) { return {

    constructor: function(test, cons, alt, start, end) {
    
        this.type = "IfStatement";
        this.test = test;
        this.consequent = cons;
        this.alternate = alt;
        this.start = start;
        this.end = end;
    }
}});

var DoWhileStatement = es6now.Class(function(__super) { return {

    constructor: function(body, test, start, end) {
    
        this.type = "DoWhileStatement";
        this.body = body;
        this.test = test;
        this.start = start;
        this.end = end;
    }
}});

var WhileStatement = es6now.Class(function(__super) { return {

    constructor: function(test, body, start, end) {
    
        this.type = "WhileStatement";
        this.test = test;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}});

var ForStatement = es6now.Class(function(__super) { return {

    constructor: function(init, test, update, body, start, end) {
    
        this.type = "ForStatement";
        this.init = init;
        this.test = test;
        this.update = update;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}});

var ForInStatement = es6now.Class(function(__super) { return {

    constructor: function(left, right, body, start, end) {
    
        this.type = "ForInStatement";
        this.left = left;
        this.right = right;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}});

var ForOfStatement = es6now.Class(function(__super) { return {

    constructor: function(left, right, body, start, end) {
    
        this.type = "ForOfStatement";
        this.left = left;
        this.right = right;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}});

var WithStatement = es6now.Class(function(__super) { return {

    constructor: function(object, body, start, end) {
    
        this.type = "WithStatement";
        this.object = object;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}});

var SwitchStatement = es6now.Class(function(__super) { return {

    constructor: function(desc, cases, start, end) {
    
        this.type = "SwitchStatement";
        this.descriminant = desc;
        this.cases = cases;
        this.start = start;
        this.end = end;
    }
}});

var SwitchCase = es6now.Class(function(__super) { return {

    constructor: function(test, cons, start, end) {
    
        this.type = "SwitchCase";
        this.test = test;
        this.consequent = cons;
        this.start = start;
        this.end = end;
    }
}});

var TryStatement = es6now.Class(function(__super) { return {

    constructor: function(block, handler, fin, start, end) {
    
        this.type = "TryStatement";
        this.block = block;
        this.handler = handler;
        this.finalizer = fin;
        this.start = start;
        this.end = end;
    }
}});

var CatchClause = es6now.Class(function(__super) { return {

    constructor: function(param, body, start, end) {
    
        this.type = "CatchClause";
        this.param = param;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}});

var FunctionDeclaration = es6now.Class(function(__super) { return {

    constructor: function(gen, ident, params, body, start, end) {
    
        this.type = "FunctionDeclaration";
        this.generator = gen;
        this.ident = ident;
        this.params = params;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}});

var FunctionExpression = es6now.Class(function(__super) { return {

    constructor: function(gen, ident, params, body, start, end) {
    
        this.type = "FunctionExpression";
        this.generator = gen;
        this.ident = ident;
        this.params = params;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}});

var FormalParameter = es6now.Class(function(__super) { return {

    constructor: function(pattern, init, start, end) {
    
        this.type = "FormalParameter";
        this.pattern = pattern;
        this.init = init;
        this.start = start;
        this.end = end;
    }
}});

var RestParameter = es6now.Class(function(__super) { return {

    constructor: function(ident, start, end) {
    
        this.type = "RestParameter";
        this.ident = ident;
        this.start = start;
        this.end = end;
    }
}});

var FunctionBody = es6now.Class(function(__super) { return {

    constructor: function(statements, start, end) {
    
        this.type = "FunctionBody";
        this.statements = statements;
        this.start = start;
        this.end = end;
    }
}});

var ArrowFunction = es6now.Class(function(__super) { return {

    constructor: function(params, body, start, end) {
    
        this.type = "ArrowFunction";
        this.params = params;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}});

var ModuleDeclaration = es6now.Class(function(__super) { return {

    constructor: function(url, body, start, end) {
    
        this.type = "ModuleDeclaration";
        this.url = url;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}});

var ModuleBody = es6now.Class(function(__super) { return {

    constructor: function(statements, start, end) {
    
        this.type = "ModuleBody";
        this.statements = statements;
        this.start = start;
        this.end = end;
    }
}});

var ImportAsDeclaration = es6now.Class(function(__super) { return {

    constructor: function(from, ident, start, end) {
    
        this.type = "ImportAsDeclaration";
        this.from = from;
        this.ident = ident;
        this.start = start;
        this.end = end;
    }
}});

var ImportDeclaration = es6now.Class(function(__super) { return {

    constructor: function(binding, from, start, end) {
    
        this.type = "ImportDeclaration";
        this.binding = binding;
        this.from = from;
        this.start = start;
        this.end = end;
    }
}});

var ImportSpecifierSet = es6now.Class(function(__super) { return {

    constructor: function(list, start, end) {
    
        this.type = "ImportSpecifierSet";
        this.specifiers = list;
        this.start = start;
        this.end = end;
    }
}});

var ImportSpecifier = es6now.Class(function(__super) { return {

    constructor: function(name, ident, start, end) {
    
        this.type = "ImportSpecifier";
        this.name = name;
        this.ident = ident;
        this.start = start;
        this.end = end;
    }
}});

var ExportDeclaration = es6now.Class(function(__super) { return {

    constructor: function(binding, from, start, end) {
    
        this.type = "ExportDeclaration";
        this.binding = binding;
        this.from = from;
        this.start = start;
        this.end = end;
    }
}});

var ExportSpecifierSet = es6now.Class(function(__super) { return {

    constructor: function(list, start, end) {
    
        this.type = "ExportSpecifierSet";
        this.specifiers = list;
        this.start = start;
        this.end = end;
    }
}});

var ExportSpecifier = es6now.Class(function(__super) { return {

    constructor: function(ident, path, start, end) {
    
        this.type = "ExportSpecifier";
        this.ident = ident;
        this.path = path;
        this.start = start;
        this.end = end;
    }
}});

var BindingPath = es6now.Class(function(__super) { return {
    
    constructor: function(list, start, end) {
    
        this.type = "BindingPath";
        this.elements = list;
        this.start = start;
        this.end = end;
    }
}});

var ClassDeclaration = es6now.Class(function(__super) { return {

    constructor: function(ident, base, body, start, end) {
    
        this.type = "ClassDeclaration";
        this.ident = ident;
        this.base = base;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}});

var ClassExpression = es6now.Class(function(__super) { return {

    constructor: function(ident, base, body, start, end) {
    
        this.type = "ClassExpression";
        this.ident = ident;
        this.base = base;
        this.body = body;
        this.start = start;
        this.end = end;
    }
}});

var ClassBody = es6now.Class(function(__super) { return {

    constructor: function(elems, start, end) {
    
        this.type = "ClassBody";
        this.elements = elems;
        this.start = start;
        this.end = end;
    }
}});

var ClassElement = es6now.Class(function(__super) { return {

    constructor: function(isStatic, method, start, end) {
    
        this.type = "ClassElement";
        this.static = isStatic;
        this.method = method;
        this.start = start;
        this.end = end;
    }
}});

exports.Script = Script;
exports.Module = Module;
exports.Identifier = Identifier;
exports.Number = Number;
exports.String = String;
exports.Template = Template;
exports.RegularExpression = RegularExpression;
exports.Null = Null;
exports.Boolean = Boolean;
exports.ThisExpression = ThisExpression;
exports.SuperExpression = SuperExpression;
exports.SequenceExpression = SequenceExpression;
exports.AssignmentExpression = AssignmentExpression;
exports.SpreadExpression = SpreadExpression;
exports.YieldExpression = YieldExpression;
exports.ConditionalExpression = ConditionalExpression;
exports.BinaryExpression = BinaryExpression;
exports.UpdateExpression = UpdateExpression;
exports.UnaryExpression = UnaryExpression;
exports.MemberExpression = MemberExpression;
exports.CallExpression = CallExpression;
exports.TaggedTemplateExpression = TaggedTemplateExpression;
exports.NewExpression = NewExpression;
exports.ParenExpression = ParenExpression;
exports.ObjectExpression = ObjectExpression;
exports.PropertyDefinition = PropertyDefinition;
exports.CoveredPatternProperty = CoveredPatternProperty;
exports.MethodDefinition = MethodDefinition;
exports.ArrayExpression = ArrayExpression;
exports.ArrayComprehension = ArrayComprehension;
exports.GeneratorComprehension = GeneratorComprehension;
exports.ComprehensionFor = ComprehensionFor;
exports.ComprehensionIf = ComprehensionIf;
exports.TemplateExpression = TemplateExpression;
exports.Block = Block;
exports.LabelledStatement = LabelledStatement;
exports.ExpressionStatement = ExpressionStatement;
exports.EmptyStatement = EmptyStatement;
exports.VariableDeclaration = VariableDeclaration;
exports.VariableDeclarator = VariableDeclarator;
exports.ReturnStatement = ReturnStatement;
exports.BreakStatement = BreakStatement;
exports.ContinueStatement = ContinueStatement;
exports.ThrowStatement = ThrowStatement;
exports.DebuggerStatement = DebuggerStatement;
exports.IfStatement = IfStatement;
exports.DoWhileStatement = DoWhileStatement;
exports.WhileStatement = WhileStatement;
exports.ForStatement = ForStatement;
exports.ForInStatement = ForInStatement;
exports.ForOfStatement = ForOfStatement;
exports.WithStatement = WithStatement;
exports.SwitchStatement = SwitchStatement;
exports.SwitchCase = SwitchCase;
exports.TryStatement = TryStatement;
exports.CatchClause = CatchClause;
exports.FunctionDeclaration = FunctionDeclaration;
exports.FunctionExpression = FunctionExpression;
exports.FormalParameter = FormalParameter;
exports.RestParameter = RestParameter;
exports.FunctionBody = FunctionBody;
exports.ArrowFunction = ArrowFunction;
exports.ModuleDeclaration = ModuleDeclaration;
exports.ModuleBody = ModuleBody;
exports.ImportAsDeclaration = ImportAsDeclaration;
exports.ImportDeclaration = ImportDeclaration;
exports.ImportSpecifierSet = ImportSpecifierSet;
exports.ImportSpecifier = ImportSpecifier;
exports.ExportDeclaration = ExportDeclaration;
exports.ExportSpecifierSet = ExportSpecifierSet;
exports.ExportSpecifier = ExportSpecifier;
exports.BindingPath = BindingPath;
exports.ClassDeclaration = ClassDeclaration;
exports.ClassExpression = ClassExpression;
exports.ClassBody = ClassBody;
exports.ClassElement = ClassElement;
};

__modules[2] = function(exports) {
var Node = __require(1);

var Scanner = __require(3).Scanner;
var Transform = __require(4).Transform;
var Validate = __require(5).Validate;

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

var TokenData = es6now.Class(function(__super) { return {

    constructor: function(token) {
    
        this.type = token.type;
        this.value = token.value;
        this.newlineBefore = token.newlineBefore;
        this.start = token.start;
        this.end = token.end;
        this.regexFlags = token.regexFlags;
        this.templateEnd = token.templateEnd;
    }
}});

var Parser = es6now.Class(function(__super) { return {

    constructor: function(input, offset) {

        var scanner = new Scanner(input, offset);
            
        this.scanner = scanner;
        this.input = input;
        
        this.peek0 = null;
        this.peek1 = null;
        this.endOffset = scanner.offset;
        
        this.contextStack = [];
        this.pushContext(false);
    },

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
            
                this.peek0 = new TokenData(this.peek0);
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
    
    formatErrorMessage: function(msg, pos) {
    
        return "" + (msg) + " (line " + (pos.line) + ":" + (pos.column) + ")";
    },
    
    fail: function(msg, loc) {
    
        var pos = this.scanner.position(loc || this.peek0),
            err = new SyntaxError(this.formatErrorMessage(msg, pos));
        
        throw err;
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
    
    peekModule: function() {
    
        if (this.peekToken().value === "module") {
        
            var p = this.peekToken("div", 1);
            
            if (!p.newlineBefore && p.type === "STRING")
                return true;
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
    
        var start = this.startOffset;
        
        return new Node.Script(this.StatementList(true, false), start, this.endOffset);
    },
    
    Module: function() {
    
        var start = this.startOffset;
        
        // Modules are always strict
        this.setStrict();
        
        return new Node.Module(this.StatementList(true, true), start, this.endOffset);
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
            
            if (list === null)
                expr = new Node.SequenceExpression(list = [expr], start, -1);
            
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
        
        return new Node.AssignmentExpression(
            this.read(),
            left,
            this.AssignmentExpression(noIn),
            start,
            this.endOffset);
    },
    
    SpreadAssignment: function(noIn) {
    
        if (this.peek() === "...") {
        
            var start = this.startOffset;
            
            this.read();
            
            return new Node.SpreadExpression(
                this.AssignmentExpression(noIn), 
                start, 
                this.endOffset);
        }
        
        return this.AssignmentExpression(noIn);
    },
    
    YieldExpression: function() {
    
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
        
        return new Node.ConditionalExpression(left, middle, right, start, this.endOffset);
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
            
            lhs = new Node.BinaryExpression(op, lhs, rhs, lhs.start, rhs.end);
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
    },
    
    NewExpression: function() {
    
        var start = this.startOffset;
        
        this.read("new");
        
        var expr = this.MemberExpression(false),
            args = this.peek("div") === "(" ? this.ArgumentList() : null;
        
        return new Node.NewExpression(expr, args, start, this.endOffset);
    },
    
    SuperExpression: function() {
    
        var start = this.startOffset;
        this.read("super");
        
        return new Node.SuperExpression(start, this.endOffset);
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
    },
    
    Identifier: function(isVar) {
    
        var token = this.readToken("IDENTIFIER"),
            context = isVar ? "variable" : "";
        
        return new Node.Identifier(token.value, context, token.start, token.end);
    },
    
    IdentifierName: function() {
    
        var token = this.readToken("IDENTIFIER", "name");
        return new Node.Identifier(token.value, "", token.start, token.end);
    },
    
    String: function() {
    
        var token = this.readToken("STRING");
        return new Node.String(token.value, token.start, token.end);
    },
    
    Number: function() {
    
        var token = this.readToken("NUMBER");
        return new Node.Number(token.value, token.start, token.end);
    },
    
    Template: function() {
    
        var token = this.readToken("TEMPLATE", "template");
        return new Node.Template(token.value, token.templateEnd, token.start, token.end);
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
        
        return new Node.ObjectExpression(list, start, this.endOffset);
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
    },
    
    ArrayExpression: function() {
    
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
    },
    
    ArrayComprehension: function() {
    
        var start = this.startOffset;
        
        this.read("[");
        
        var list = this.ComprehensionQualifierList(),
            expr = this.AssignmentExpression();
        
        this.read("]");
        
        return new Node.ArrayComprehension(list, expr, start, this.endOffset);
    },
    
    GeneratorComprehension: function() {
    
        var start = this.startOffset;
        
        this.read("(");
        
        var list = this.ComprehensionQualifierList(),
            expr = this.AssignmentExpression();
        
        this.read(")");
        
        return new Node.GeneratorComprehension(list, expr, start, this.endOffset);
    },
    
    ComprehensionQualifierList: function() {
    
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
    },
    
    ComprehensionFor: function() {
    
        var start = this.startOffset;
        
        this.read("for");
        
        return new Node.ComprehensionFor(
            this.BindingPattern(),
            (this.readKeyword("of"), this.AssignmentExpression()),
            start,
            this.endOffset);
    },
    
    ComprehensionIf: function() {
    
        var start = this.startOffset,
            test;
            
        this.read("if");
        
        this.read("(");
        test = this.AssignmentExpression();
        this.read(")");
        
        return new Node.ComprehensionIf(test, start, this.endOffset);
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
        
        return new Node.TemplateExpression(lit, sub, start, this.endOffset);
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
        
        return new Node.Block(list, start, this.endOffset);
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
        
        return new Node.LabelledStatement(
            label, 
            this.StatementWithLabel(label),
            start,
            this.endOffset);
    },
    
    ExpressionStatement: function() {
    
        var start = this.startOffset,
            expr = this.Expression();
        
        this.Semicolon();
        
        return new Node.ExpressionStatement(expr, start, this.endOffset);
    },
    
    EmptyStatement: function() {
    
        var start = this.startOffset;
        
        this.Semicolon();
        
        return new Node.EmptyStatement(start, this.endOffset);
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
        
        return new Node.VariableDeclaration(keyword, list, start, this.endOffset);
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
        
        return new Node.VariableDeclarator(pattern, init, start, this.endOffset);
    },
    
    ReturnStatement: function() {
    
        if (!this.context.isFunction)
            this.fail("Return statement outside of function");
        
        var start = this.startOffset;
        
        this.read("return");
        var value = this.maybeEnd() ? this.Expression() : null;
        
        this.Semicolon();
        
        return new Node.ReturnStatement(value, start, this.endOffset);
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
        
        return keyword === "break" ?
            new Node.BreakStatement(label, start, this.endOffset) :
            new Node.ContinueStatement(label, start, this.endOffset);
    },
    
    ThrowStatement: function() {
    
        var start = this.startOffset;
        
        this.read("throw");
        
        var expr = this.maybeEnd() ? this.Expression() : null;
        
        if (expr === null)
            this.fail("Missing throw expression");
        
        this.Semicolon();
        
        return new Node.ThrowStatement(expr, start, this.endOffset);
    },
    
    DebuggerStatement: function() {
    
        var start = this.startOffset;
        
        this.read("debugger");
        this.Semicolon();
        
        return new Node.DebuggerStatement(start, this.endOffset);
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
        
        return new Node.IfStatement(test, body, elseBody, start, this.endOffset);
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
        
        return new Node.DoWhileStatement(body, test, start, this.endOffset);
    },
    
    WhileStatement: function() {
    
        var start = this.startOffset;
        
        this.read("while");
        this.read("(");
        
        return new Node.WhileStatement(
            this.Expression(), 
            (this.read(")"), this.StatementWithLabel()), 
            start, 
            this.endOffset);
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
        
        return new Node.ForStatement(
            init, 
            test, 
            step, 
            this.StatementWithLabel(), 
            start, 
            this.endOffset);
    },
    
    ForInStatement: function(init, start) {
    
        this.checkForInit(init, "in");
        
        this.read("in");
        var expr = this.Expression();
        this.read(")");
        
        return new Node.ForInStatement(
            init, 
            expr, 
            this.StatementWithLabel(), 
            start, 
            this.endOffset);
    },
    
    ForOfStatement: function(init, start) {
    
        this.checkForInit(init, "of");
        
        this.readKeyword("of");
        var expr = this.AssignmentExpression();
        this.read(")");
        
        return new Node.ForOfStatement(
            init, 
            expr, 
            this.StatementWithLabel(), 
            start, 
            this.endOffset);
    },
    
    WithStatement: function() {
    
        if (this.context.strict)
            this.fail("With statement is not allowed in strict mode");
    
        var start = this.startOffset;
        
        this.read("with");
        this.read("(");
        
        return new Node.WithStatement(
            this.Expression(), 
            (this.read(")"), this.Statement()),
            start,
            this.endOffset);
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
        
            node = this.SwitchCase();
            
            if (node.test === null) {
            
                if (hasDefault)
                    this.fail("Switch statement cannot have more than one default");
                
                hasDefault = true;
            }
            
            cases.push(node);
        }
        
        this.context.switchDepth -= 1;
        this.read("}");
        
        return new Node.SwitchStatement(head, cases, start, this.endOffset);
    },
    
    SwitchCase: function() {
    
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
        
        return new Node.SwitchCase(expr, list, start, this.endOffset);
    },
    
    TryStatement: function() {
    
        var start = this.startOffset;
        
        this.read("try");
        
        var tryBlock = this.Block(),
            handler = null,
            fin = null;
        
        if (this.peek() === "catch")
            handler = this.CatchClause();
        
        if (this.peek() === "finally") {
        
            this.read("finally");
            fin = this.Block();
        }
        
        return new Node.TryStatement(tryBlock, handler, fin, start, this.endOffset);
    },
    
    CatchClause: function() {
    
        var start = this.startOffset;
        
        this.read("catch");
        this.read("(");
        var param = this.BindingPattern();
        this.read(")");
        
        return new Node.CatchClause(param, this.Block(), start, this.endOffset);
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
                
                if (this.peekModule())
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
            ident,
            params;
        
        this.read("function");
        
        if (this.peek() === "*") {
            
            this.read();
            gen = true;
        }
        
        return new Node.FunctionDeclaration(
            gen,
            ident = this.Identifier(),
            params = this.FormalParameters(),
            this.FunctionBody(ident, params, false),
            start,
            this.endOffset);
    },
    
    FunctionExpression: function() {
    
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
        
        return new Node.FunctionExpression(
            gen,
            ident,
            params = this.FormalParameters(),
            this.FunctionBody(ident, params, false),
            start,
            this.endOffset);
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
        
        return new Node.FormalParameter(pattern, init, start, this.endOffset);
    },
    
    RestParameter: function() {
    
        var start = this.startOffset;
        
        this.read("...");
        
        return new Node.RestParameter(this.BindingIdentifier(), start, this.endOffset);
    },
    
    FunctionBody: function(ident, params, isStrict) {
    
        this.pushContext(true, isStrict);
        
        var start = this.startOffset;
        
        this.read("{");
        var statements = this.StatementList(true);
        this.read("}");
        
        if (ident) this.checkBindingIdent(ident);
        this.checkParameters(params);
        
        this.popContext();
        
        return new Node.FunctionBody(statements, start, this.endOffset);
    },
    
    ArrowFunction: function(formals, rest, start) {
    
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
        
        return new Node.ArrowFunction(params, body, start, this.endOffset);
    },
    
    // === Modules ===
    
    ModuleDeclaration: function() {
        
        var start = this.startOffset;
        
        this.readKeyword("module");
        
        return new Node.ModuleDeclaration(
            this.String(),
            this.ModuleBody(),
            start,
            this.endOffset);
    },
    
    ModuleBody: function() {
    
        this.pushContext(false, true);
        
        var start = this.startOffset;
        
        this.read("{");
        var list = this.StatementList(true, true);
        this.read("}");
        
        this.popContext();
        
        return new Node.ModuleBody(list, start, this.endOffset);
    },
    
    ImportDeclaration: function() {
    
        var start = this.startOffset,
            binding,
            from;
        
        this.read("import");
        
        if (this.peek() === "STRING") {
        
            from = this.String();
            this.readKeyword("as");
            binding = this.BindingIdentifier();
            this.Semicolon();
            
            return new Node.ImportAsDeclaration(from, binding, start, this.endOffset);
        }
        
        binding = this.peek() === "{" ?
            this.ImportSpecifierSet() :
            this.BindingIdentifier();
        
        this.readKeyword("from");
        from = this.peek() === "STRING" ? this.String() : this.Identifier();
        this.Semicolon();
        
        return new Node.ImportDeclaration(binding, from, start, this.endOffset);
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
        
        return new Node.ImportSpecifierSet(list, start, this.endOffset);
    },
    
    ImportSpecifier: function() {
    
        var start = this.startOffset,
            name = this.Identifier(),
            ident = null;
        
        if (this.peek() === ":") {
        
            this.read();
            ident = this.BindingIdentifier();
            
        } else {
        
            this.checkBindingIdent(name);
        }
        
        return new Node.ImportSpecifier(name, ident, start, this.endOffset);
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
        
        return new Node.ExportDeclaration(binding, from, start, this.endOffset);
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
        
        return new Node.ExportSpecifierSet(list, start, this.endOffset);
    },
    
    ExportSpecifier: function() {
    
        var start = this.startOffset,
            ident = this.Identifier(),
            path = null;
            
        if (this.peek() === ":") {
        
            this.checkBindingIdent(ident);
            
            this.read();
            path = this.BindingPath();
        }
        
        return new Node.ExportSpecifier(ident, path, start, this.endOffset);
    },
    
    BindingPath: function() {
    
        var start = this.startOffset,
            path = [];
        
        while (true) {
        
            path.push(this.readToken("IDENTIFIER").value);
            
            if (this.peek("div") === ".") this.read();
            else break;
        }
        
        return new Node.BindingPath(path, start, this.endOffset);
    },
    
    // === Classes ===
    
    ClassDeclaration: function() {
    
        var start = this.startOffset,
            ident = null,
            base = null;
        
        this.read("class");
        
        ident = this.BindingIdentifier();
        
        if (this.peek() === "extends") {
        
            this.read();
            base = this.AssignmentExpression();
        }
        
        return new Node.ClassDeclaration(
            ident,
            base,
            this.ClassBody(),
            start,
            this.endOffset);
    },
    
    ClassExpression: function() {
    
        var start = this.startOffset, 
            ident = null,
            base = null;
        
        this.read("class");
        
        if (this.peek() === "IDENTIFIER")
            ident = this.BindingIdentifier();
        
        if (this.peek() === "extends") {
        
            this.read();
            base = this.AssignmentExpression();
        }
        
        return new Node.ClassExpression(
            ident, 
            base, 
            this.ClassBody(), 
            start, 
            this.endOffset);
    },
    
    ClassBody: function() {
    
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
        
        return new Node.ClassBody(list, start, this.endOffset);
    },
    
    ClassElement: function(nameSet, staticSet) {
    
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
    
    
}});


// Add externally defined methods
Object.mixin(Parser.prototype, Transform.prototype);
Object.mixin(Parser.prototype, Validate.prototype);

exports.Parser = Parser;
};

__modules[3] = function(exports) {
// === Unicode Categories for Javascript ===
var Unicode = (function() {

    var cat = {
    
        Ll: "0061-007A00AA00B500BA00DF-00F600F8-00FF01010103010501070109010B010D010F01110113011501170119011B011D011F01210123012501270129012B012D012F01310133013501370138013A013C013E014001420144014601480149014B014D014F01510153015501570159015B015D015F01610163016501670169016B016D016F0171017301750177017A017C017E-0180018301850188018C018D019201950199-019B019E01A101A301A501A801AA01AB01AD01B001B401B601B901BA01BD-01BF01C601C901CC01CE01D001D201D401D601D801DA01DC01DD01DF01E101E301E501E701E901EB01ED01EF01F001F301F501F901FB01FD01FF02010203020502070209020B020D020F02110213021502170219021B021D021F02210223022502270229022B022D022F02310233-0239023C023F0240024202470249024B024D024F-02930295-02AF037103730377037B-037D039003AC-03CE03D003D103D5-03D703D903DB03DD03DF03E103E303E503E703E903EB03ED03EF-03F303F503F803FB03FC0430-045F04610463046504670469046B046D046F04710473047504770479047B047D047F0481048B048D048F04910493049504970499049B049D049F04A104A304A504A704A904AB04AD04AF04B104B304B504B704B904BB04BD04BF04C204C404C604C804CA04CC04CE04CF04D104D304D504D704D904DB04DD04DF04E104E304E504E704E904EB04ED04EF04F104F304F504F704F904FB04FD04FF05010503050505070509050B050D050F05110513051505170519051B051D051F0521052305250561-05871D00-1D2B1D62-1D771D79-1D9A1E011E031E051E071E091E0B1E0D1E0F1E111E131E151E171E191E1B1E1D1E1F1E211E231E251E271E291E2B1E2D1E2F1E311E331E351E371E391E3B1E3D1E3F1E411E431E451E471E491E4B1E4D1E4F1E511E531E551E571E591E5B1E5D1E5F1E611E631E651E671E691E6B1E6D1E6F1E711E731E751E771E791E7B1E7D1E7F1E811E831E851E871E891E8B1E8D1E8F1E911E931E95-1E9D1E9F1EA11EA31EA51EA71EA91EAB1EAD1EAF1EB11EB31EB51EB71EB91EBB1EBD1EBF1EC11EC31EC51EC71EC91ECB1ECD1ECF1ED11ED31ED51ED71ED91EDB1EDD1EDF1EE11EE31EE51EE71EE91EEB1EED1EEF1EF11EF31EF51EF71EF91EFB1EFD1EFF-1F071F10-1F151F20-1F271F30-1F371F40-1F451F50-1F571F60-1F671F70-1F7D1F80-1F871F90-1F971FA0-1FA71FB0-1FB41FB61FB71FBE1FC2-1FC41FC61FC71FD0-1FD31FD61FD71FE0-1FE71FF2-1FF41FF61FF7210A210E210F2113212F21342139213C213D2146-2149214E21842C30-2C5E2C612C652C662C682C6A2C6C2C712C732C742C76-2C7C2C812C832C852C872C892C8B2C8D2C8F2C912C932C952C972C992C9B2C9D2C9F2CA12CA32CA52CA72CA92CAB2CAD2CAF2CB12CB32CB52CB72CB92CBB2CBD2CBF2CC12CC32CC52CC72CC92CCB2CCD2CCF2CD12CD32CD52CD72CD92CDB2CDD2CDF2CE12CE32CE42CEC2CEE2D00-2D25A641A643A645A647A649A64BA64DA64FA651A653A655A657A659A65BA65DA65FA663A665A667A669A66BA66DA681A683A685A687A689A68BA68DA68FA691A693A695A697A723A725A727A729A72BA72DA72F-A731A733A735A737A739A73BA73DA73FA741A743A745A747A749A74BA74DA74FA751A753A755A757A759A75BA75DA75FA761A763A765A767A769A76BA76DA76FA771-A778A77AA77CA77FA781A783A785A787A78CFB00-FB06FB13-FB17FF41-FF5A",
        Lu: "0041-005A00C0-00D600D8-00DE01000102010401060108010A010C010E01100112011401160118011A011C011E01200122012401260128012A012C012E01300132013401360139013B013D013F0141014301450147014A014C014E01500152015401560158015A015C015E01600162016401660168016A016C016E017001720174017601780179017B017D018101820184018601870189-018B018E-0191019301940196-0198019C019D019F01A001A201A401A601A701A901AC01AE01AF01B1-01B301B501B701B801BC01C401C701CA01CD01CF01D101D301D501D701D901DB01DE01E001E201E401E601E801EA01EC01EE01F101F401F6-01F801FA01FC01FE02000202020402060208020A020C020E02100212021402160218021A021C021E02200222022402260228022A022C022E02300232023A023B023D023E02410243-02460248024A024C024E03700372037603860388-038A038C038E038F0391-03A103A3-03AB03CF03D2-03D403D803DA03DC03DE03E003E203E403E603E803EA03EC03EE03F403F703F903FA03FD-042F04600462046404660468046A046C046E04700472047404760478047A047C047E0480048A048C048E04900492049404960498049A049C049E04A004A204A404A604A804AA04AC04AE04B004B204B404B604B804BA04BC04BE04C004C104C304C504C704C904CB04CD04D004D204D404D604D804DA04DC04DE04E004E204E404E604E804EA04EC04EE04F004F204F404F604F804FA04FC04FE05000502050405060508050A050C050E05100512051405160518051A051C051E0520052205240531-055610A0-10C51E001E021E041E061E081E0A1E0C1E0E1E101E121E141E161E181E1A1E1C1E1E1E201E221E241E261E281E2A1E2C1E2E1E301E321E341E361E381E3A1E3C1E3E1E401E421E441E461E481E4A1E4C1E4E1E501E521E541E561E581E5A1E5C1E5E1E601E621E641E661E681E6A1E6C1E6E1E701E721E741E761E781E7A1E7C1E7E1E801E821E841E861E881E8A1E8C1E8E1E901E921E941E9E1EA01EA21EA41EA61EA81EAA1EAC1EAE1EB01EB21EB41EB61EB81EBA1EBC1EBE1EC01EC21EC41EC61EC81ECA1ECC1ECE1ED01ED21ED41ED61ED81EDA1EDC1EDE1EE01EE21EE41EE61EE81EEA1EEC1EEE1EF01EF21EF41EF61EF81EFA1EFC1EFE1F08-1F0F1F18-1F1D1F28-1F2F1F38-1F3F1F48-1F4D1F591F5B1F5D1F5F1F68-1F6F1FB8-1FBB1FC8-1FCB1FD8-1FDB1FE8-1FEC1FF8-1FFB21022107210B-210D2110-211221152119-211D212421262128212A-212D2130-2133213E213F214521832C00-2C2E2C602C62-2C642C672C692C6B2C6D-2C702C722C752C7E-2C802C822C842C862C882C8A2C8C2C8E2C902C922C942C962C982C9A2C9C2C9E2CA02CA22CA42CA62CA82CAA2CAC2CAE2CB02CB22CB42CB62CB82CBA2CBC2CBE2CC02CC22CC42CC62CC82CCA2CCC2CCE2CD02CD22CD42CD62CD82CDA2CDC2CDE2CE02CE22CEB2CEDA640A642A644A646A648A64AA64CA64EA650A652A654A656A658A65AA65CA65EA662A664A666A668A66AA66CA680A682A684A686A688A68AA68CA68EA690A692A694A696A722A724A726A728A72AA72CA72EA732A734A736A738A73AA73CA73EA740A742A744A746A748A74AA74CA74EA750A752A754A756A758A75AA75CA75EA760A762A764A766A768A76AA76CA76EA779A77BA77DA77EA780A782A784A786A78BFF21-FF3A",
        Lt: "01C501C801CB01F21F88-1F8F1F98-1F9F1FA8-1FAF1FBC1FCC1FFC",
        Lm: "02B0-02C102C6-02D102E0-02E402EC02EE0374037A0559064006E506E607F407F507FA081A0824082809710E460EC610FC17D718431AA71C78-1C7D1D2C-1D611D781D9B-1DBF2071207F2090-20942C7D2D6F2E2F30053031-3035303B309D309E30FC-30FEA015A4F8-A4FDA60CA67FA717-A71FA770A788A9CFAA70AADDFF70FF9EFF9F",
        Lo: "01BB01C0-01C3029405D0-05EA05F0-05F20621-063F0641-064A066E066F0671-06D306D506EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA0800-08150904-0939093D09500958-096109720979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10D05-0D0C0D0E-0D100D12-0D280D2A-0D390D3D0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E450E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EDC0EDD0F000F40-0F470F49-0F6C0F88-0F8B1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10D0-10FA1100-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317DC1820-18421844-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541B05-1B331B45-1B4B1B83-1BA01BAE1BAF1C00-1C231C4D-1C4F1C5A-1C771CE9-1CEC1CEE-1CF12135-21382D30-2D652D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE3006303C3041-3096309F30A1-30FA30FF3105-312D3131-318E31A0-31B731F0-31FF3400-4DB54E00-9FCBA000-A014A016-A48CA4D0-A4F7A500-A60BA610-A61FA62AA62BA66EA6A0-A6E5A7FB-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2AA00-AA28AA40-AA42AA44-AA4BAA60-AA6FAA71-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADBAADCABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA2DFA30-FA6DFA70-FAD9FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF66-FF6FFF71-FF9DFFA0-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",
        Mn: "0300-036F0483-04870591-05BD05BF05C105C205C405C505C70610-061A064B-065E067006D6-06DC06DF-06E406E706E806EA-06ED07110730-074A07A6-07B007EB-07F30816-0819081B-08230825-08270829-082D0900-0902093C0941-0948094D0951-095509620963098109BC09C1-09C409CD09E209E30A010A020A3C0A410A420A470A480A4B-0A4D0A510A700A710A750A810A820ABC0AC1-0AC50AC70AC80ACD0AE20AE30B010B3C0B3F0B41-0B440B4D0B560B620B630B820BC00BCD0C3E-0C400C46-0C480C4A-0C4D0C550C560C620C630CBC0CBF0CC60CCC0CCD0CE20CE30D41-0D440D4D0D620D630DCA0DD2-0DD40DD60E310E34-0E3A0E47-0E4E0EB10EB4-0EB90EBB0EBC0EC8-0ECD0F180F190F350F370F390F71-0F7E0F80-0F840F860F870F90-0F970F99-0FBC0FC6102D-10301032-10371039103A103D103E10581059105E-10601071-1074108210851086108D109D135F1712-17141732-1734175217531772177317B7-17BD17C617C9-17D317DD180B-180D18A91920-19221927192819321939-193B1A171A181A561A58-1A5E1A601A621A65-1A6C1A73-1A7C1A7F1B00-1B031B341B36-1B3A1B3C1B421B6B-1B731B801B811BA2-1BA51BA81BA91C2C-1C331C361C371CD0-1CD21CD4-1CE01CE2-1CE81CED1DC0-1DE61DFD-1DFF20D0-20DC20E120E5-20F02CEF-2CF12DE0-2DFF302A-302F3099309AA66FA67CA67DA6F0A6F1A802A806A80BA825A826A8C4A8E0-A8F1A926-A92DA947-A951A980-A982A9B3A9B6-A9B9A9BCAA29-AA2EAA31AA32AA35AA36AA43AA4CAAB0AAB2-AAB4AAB7AAB8AABEAABFAAC1ABE5ABE8ABEDFB1EFE00-FE0FFE20-FE26",
        Mc: "0903093E-09400949-094C094E0982098309BE-09C009C709C809CB09CC09D70A030A3E-0A400A830ABE-0AC00AC90ACB0ACC0B020B030B3E0B400B470B480B4B0B4C0B570BBE0BBF0BC10BC20BC6-0BC80BCA-0BCC0BD70C01-0C030C41-0C440C820C830CBE0CC0-0CC40CC70CC80CCA0CCB0CD50CD60D020D030D3E-0D400D46-0D480D4A-0D4C0D570D820D830DCF-0DD10DD8-0DDF0DF20DF30F3E0F3F0F7F102B102C10311038103B103C105610571062-10641067-106D108310841087-108C108F109A-109C17B617BE-17C517C717C81923-19261929-192B193019311933-193819B0-19C019C819C91A19-1A1B1A551A571A611A631A641A6D-1A721B041B351B3B1B3D-1B411B431B441B821BA11BA61BA71BAA1C24-1C2B1C341C351CE11CF2A823A824A827A880A881A8B4-A8C3A952A953A983A9B4A9B5A9BAA9BBA9BD-A9C0AA2FAA30AA33AA34AA4DAA7BABE3ABE4ABE6ABE7ABE9ABEAABEC",
        Nd: "0030-00390660-066906F0-06F907C0-07C90966-096F09E6-09EF0A66-0A6F0AE6-0AEF0B66-0B6F0BE6-0BEF0C66-0C6F0CE6-0CEF0D66-0D6F0E50-0E590ED0-0ED90F20-0F291040-10491090-109917E0-17E91810-18191946-194F19D0-19DA1A80-1A891A90-1A991B50-1B591BB0-1BB91C40-1C491C50-1C59A620-A629A8D0-A8D9A900-A909A9D0-A9D9AA50-AA59ABF0-ABF9FF10-FF19",
        Nl: "16EE-16F02160-21822185-218830073021-30293038-303AA6E6-A6EF",
        Pc: "005F203F20402054FE33FE34FE4D-FE4FFF3F"
    
    };
    
    var pattern = /([0-9a-f]{4})(-[0-9a-f]{4})?/ig;
    
    Object.keys(cat).forEach((function(k) {
    
        cat[k] = cat[k].replace(pattern, (function(m, m1, m2) { return "\\u" + m1 + (m2 ? "-\\u" + m2.slice(1) : ""); })
        );
    }));
    
    return cat;

})();

// === Unicode Matching Patterns ===
var unicodeLetter = Unicode.Lu + Unicode.Ll + Unicode.Lt + Unicode.Lm + Unicode.Lo + Unicode.Nl,
    identifierStart = new RegExp("^[\\\\_$" + unicodeLetter + "]"),
    identifierPart = new RegExp("^[_$\u200c\u200d" + unicodeLetter + Unicode.Mn + Unicode.Mc + Unicode.Nd + Unicode.Pc + "]+"),
    identifierEscape = /\\u([0-9a-fA-F]{4})/g,
    whitespaceChars = /\t\v\f\uFEFF \u1680\u180E\u202F\u205F\u3000\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A/,
    newlineSequence = /\r\n?|[\n\u2028\u2029]/g;


// === Reserved Words ===
var reservedWord = new RegExp("^(?:" +
    "break|case|catch|class|const|continue|debugger|default|delete|do|" +
    "else|enum|export|extends|false|finally|for|function|if|import|in|" +
    "instanceof|new|null|return|super|switch|this|throw|true|try|typeof|" +
    "var|void|while|with" +
")$");

var strictReservedWord = new RegExp("^(?:" +
    "implements|private|public|interface|package|let|protected|static|yield" +
")$");

// === Punctuators ===
var multiCharPunctuator = new RegExp("^(?:" +
    "[-+]{2}|" +
    "[&|]{2}|" +
    "<<=?|" +
    ">>>?=?|" +
    "[!=]==|" +
    "=>|" +
    "[\.]{2,3}|" +
    "[-+&|<>!=*&\^%\/]=" +
")$");

// === Miscellaneous Patterns ===
var octalEscape = /^(?:[0-3][0-7]{0,2}|[4-7][0-7]?)/,
      blockCommentPattern = /\r\n?|[\n\u2028\u2029]|\*\//g,
      hexChar = /[0-9a-f]/i;

// === Character Types ===
var WHITESPACE = 1,
    NEWLINE = 2,
    DECIMAL_DIGIT = 3,
    PUNCTUATOR = 4,
    STRING = 5,
    TEMPLATE = 6,
    IDENTIFIER = 7,
    ZERO = 8,
    DOT = 9,
    SLASH = 10,
    LBRACE = 11;

// === Character Type Lookup Table ===
var charTable = (function() {

    var table = new Array(128), i;
    
    add(WHITESPACE, "\t\v\f ");
    add(NEWLINE, "\r\n");
    add(DECIMAL_DIGIT, "123456789");
    add(PUNCTUATOR, "{[]();,<>+-*%&|^!~?:=");
    add(DOT, ".");
    add(SLASH, "/");
    add(LBRACE, "}");
    add(ZERO, "0");
    add(STRING, "'\"");
    add(TEMPLATE, "`");
    
    add(IDENTIFIER, "$_\\");
    for (i = 65; i <= 90; ++i) table[i] = IDENTIFIER;
    for (i = 97; i <= 122; ++i) table[i] = IDENTIFIER;
    
    return table;
    
    function add(type, string) {
    
        string.split("").forEach((function(c) { table[c.charCodeAt(0)] = type }));
    }

})();

// Performs a binary search on an array
function binarySearch(array, val) {

    var right = array.length - 1,
        left = 0,
        mid,
        test;
    
    while (left <= right) {
        
        mid = (left + right) >> 1;
        test = array[mid];
        
        if (val > test) left = mid + 1;
        else if (val < test) right = mid - 1;
        else return mid;
    }
    
    return left;
}

// Returns true if the character is a valid identifier part
function isIdentifierPart(c) {

    if (!c)
        return false;
    
    var code = c.charCodeAt(0);
    
    return  code > 64 && code < 91 || 
            code > 96 && code < 123 ||
            code > 47 && code < 58 ||
            code === 36 ||
            code === 95 ||
            code === 92 ||
            code > 123 && identifierPart.test(c);
}

// Returns true if the specified character is a newline
function isNewlineChar(c) {

    switch (c) {
    
        case "\r":
        case "\n":
        case "\u2028":
        case "\u2029":
            return true;
    }
    
    return false;
}

// Returns true if the specified character can exist in a non-starting position
function isPunctuatorNext(c) {

    switch (c) {
    
        case "+":
        case "-":
        case "&":
        case "|":
        case "<":
        case ">":
        case "=":
        case ".":
            return true;
    }
    
    return false;
}

// Returns true if the specified character is a valid numeric following character
function isNumberFollow(c) {

    if (!c)
        return true;
    
    var code = c.charCodeAt(0);
    
    return !(
        code > 64 && code < 91 || 
        code > 96 && code < 123 ||
        code > 47 && code < 58 ||
        code === 36 ||
        code === 95 ||
        code === 92 ||
        code > 123 && identifierStart.test(c)
    );
}

var Scanner = es6now.Class(function(__super) { return {

    constructor: function(input, offset) {

        this.input = input;
        this.offset = offset || 0;
        this.length = input.length;
        this.lines = [-1];
        
        this.strict = false;
        
        this.type = "";
        this.start = 0;
        this.end = 0;
        this.value = null;
        this.templateEnd = false;
        this.regexFlags = null;
        this.newlineBefore = false;
        this.error = "";
    },

    next: function(context) {

        if (this.type !== "COMMENT")
            this.newlineBefore = false;
        
        this.error = "";
        
        var type = null, 
            start;
        
        while (type === null) {
        
            start = this.offset;
            type = start >= this.length ? "EOF" : this.Start(context);
        }
        
        this.type = type;
        this.start = start;
        this.end = this.offset;
        
        return type;
    },
    
    raw: function(token) {
    
        token || (token = this);
        return this.input.slice(this.start, this.end);
    },
    
    position: function(token) {
    
        token || (token = this);
        
        var offset = token.start,
            i = binarySearch(this.lines, offset);
        
        return { 
        
            offset: offset, 
            line: i, 
            column: offset - this.lines[i - 1]
        };
    },
    
    addLineBreak: function(offset) {
    
        this.lines.push(offset);
    },
    
    readOctalEscape: function() {
    
        var m = octalEscape.exec(this.input.slice(this.offset, this.offset + 3)),
            val = m ? m[0] : "";
        
        this.offset += val.length;
        
        return val;
    },
    
    readStringEscape: function() {
    
        this.offset++;
        
        var chr, esc;
        
        switch (chr = this.input[this.offset++]) {
        
            case "t": return "\t";
            case "b": return "\b";
            case "v": return "\v";
            case "f": return "\f";
            case "r": return "\r";
            case "n": return "\n";
    
            case "\r":
            
                this.addLineBreak(this.offset - 1);
                
                if (this.input[this.offset] === "\n")
                    this.offset++;
                
                return "";
            
            case "\n":
            case "\u2028":
            case "\u2029":
            
                this.addLineBreak(this.offset - 1);
                return "";

            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            
                this.offset--;
                esc = this.readOctalEscape();
                
                if (esc === "0") {
                
                    return String.fromCharCode(0);
                
                } else if (this.strict) {
                
                    this.error = "Octal literals are not allowed in strict mode";
                    return null;
                    
                } else {
                
                    return String.fromCharCode(parseInt(esc, 8));
                }
            
            case "x":
            
                esc = this.readHex(2);
                return (esc.length < 2) ? null : String.fromCharCode(parseInt(esc, 16));
            
            case "u":
            
                esc = this.readHex(4);
                return (esc.length < 4) ? null : String.fromCharCode(parseInt(esc, 16));
            
            default: 
            
                return chr;
        }
    },
    
    readRange: function(low, high) {
    
        var start = this.offset,
            code;
        
        while (code = this.input.charCodeAt(this.offset)) {
        
            if (code >= low && code <= high) this.offset++;
            else break;
        }
        
        return this.input.slice(start, this.offset);
    },
    
    readInteger: function() {
    
        var start = this.offset,
            code;
        
        while (code = this.input.charCodeAt(this.offset)) {
        
            if (code >= 48 && code <= 57) this.offset++;
            else break;
        }
        
        return this.input.slice(start, this.offset);
    },
    
    readHex: function(maxLen) {
        
        var str = "", 
            chr;
        
        while (chr = this.input[this.offset]) {
        
            if (!hexChar.test(chr))
                break;
            
            str += chr;
            this.offset++;
            
            if (str.length === maxLen)
                break;
        }
        
        return str;
    },
    
    Start: function(context) {
    
        var code = this.input.charCodeAt(this.offset),
            next;
            
        switch (charTable[code]) {
        
            case WHITESPACE: return this.Whitespace();

            case NEWLINE: return this.Newline();
            
            case IDENTIFIER: return this.Identifier(context);
            
            case PUNCTUATOR: return this.Punctuator();
            
            case DECIMAL_DIGIT: return this.Number();
            
            case TEMPLATE: return this.Template();
            
            case STRING: return this.String();
            
            case ZERO: 
            
                switch (code = this.input.charCodeAt(this.offset + 1)) {
                
                    case 88: case 120: return this.HexNumber();   // x
                    case 66: case 98: return this.BinaryNumber(); // b
                    case 79: case 111: return this.OctalNumber(); // o
                }
                
                return code >= 48 && code <= 55 ?
                    this.LegacyOctalNumber() :
                    this.Number();
            
            case DOT: 
            
                code = this.input.charCodeAt(this.offset + 1);
                
                if (code >= 48 && code <= 57) return this.Number();
                else return this.Punctuator();
            
            case SLASH:
            
                next = this.input[this.offset + 1];

                if (next === "/") return this.LineComment();
                else if (next === "*") return this.BlockComment();
                else if (context === "div") return this.Punctuator();
                else return this.RegularExpression();
            
            case LBRACE:
            
                if (context === "template") return this.Template();
                else return this.Punctuator();
        }
        
        var chr = this.input[this.offset];
        
        // Unicode newlines
        if (isNewlineChar(chr))
            return this.Newline();
        
        // Unicode whitespace
        if (whitespaceChars.test(chr))
            return this.UnicodeWhitespace();
        
        // Unicode identifier chars
        if (identifierStart.test(chr))
            return this.Identifier(context);
        
        return this.Error();
    },
    
    Whitespace: function() {
    
        this.offset++;
        
        while (charTable[this.input.charCodeAt(this.offset)] === WHITESPACE)
            this.offset++;
        
        return null;
    },
    
    UnicodeWhitespace: function() {
    
        this.offset++;
        
        while (whitespaceChars.test(this.input[this.offset]))
            this.offset++;
        
        return null;
    },
    
    Newline: function() {
        
        this.addLineBreak(this.offset);
        
        if (this.input[this.offset++] === "\r" && this.input[this.offset] === "\n")
            this.offset++;
        
        this.newlineBefore = true;
        
        return null;
    },
    
    Punctuator: function(code) {
        
        var op = this.input[this.offset++], 
            chr,
            next;
        
        while (
            isPunctuatorNext(chr = this.input[this.offset]) &&
            multiCharPunctuator.test(next = op + chr)) {
        
            this.offset++;
            op = next;
        }
        
        return op;
    },
    
    Template: function() {
    
        var first = this.input[this.offset++],
            end = false, 
            val = "", 
            esc,
            chr;
        
        while (chr = this.input[this.offset]) {
            
            if (chr === "`") {
            
                end = true;
                break;
            }
            
            if (chr === "$" && this.input[this.offset + 1] === "{") {
            
                this.offset++;
                break;
            }
            
            if (chr === "\\") {
            
                esc = this.readStringEscape();
                
                if (!esc) 
                    return this.Error();
                
                val += esc;
                
            } else {
            
                val += chr;
                this.offset++;
            }
        }
        
        if (!chr)
            return this.Error();
        
        this.offset++;
        
        this.value = val;
        this.templateEnd = end;
        
        return "TEMPLATE";
    },
    
    String: function() {
    
        var delim = this.input[this.offset++],
            val = "",
            esc,
            chr;
        
        while (chr = this.input[this.offset]) {
        
            if (chr === delim)
                break;
            
            if (isNewlineChar(chr))
                return this.Error();
            
            if (chr === "\\") {
            
                esc = this.readStringEscape();
                
                if (esc === null)
                    return this.Error();
                
                val += esc;
                
            } else {
            
                val += chr;
                this.offset++;
            }
        }
        
        if (!chr)
            return this.Error();
        
        this.offset++;
        this.value = val;
        
        return "STRING";
    },
    
    RegularExpression: function() {
    
        this.offset++;
        
        var backslash = false, 
            inClass = false,
            flags = null,
            val = "", 
            chr;
        
        while ((chr = this.input[this.offset++])) {
        
            if (isNewlineChar(chr))
                return this.Error();
            
            if (backslash) {
            
                val += "\\" + chr;
                backslash = false;
            
            } else if (chr == "[") {
            
                inClass = true;
                val += chr;
            
            } else if (chr == "]" && inClass) {
            
                inClass = false;
                val += chr;
            
            } else if (chr == "/" && !inClass) {
            
                break;
            
            } else if (chr == "\\") {
            
                backslash = true;
                
            } else {
            
                val += chr;
            }
        }
        
        if (!chr)
            return this.Error();
        
        if (isIdentifierPart(this.input[this.offset]))
            flags = this.Identifier("name").value;
        
        this.value = val;
        this.regexFlags = flags;
        
        return "REGEX";
    },
    
    LegacyOctalNumber: function() {
    
        this.offset++;
        
        var start = this.offset,
            code;
        
        while (code = this.input.charCodeAt(this.offset)) {
        
            if (code >= 48 && code <= 55)
                this.offset++;
            else
                break;
        }
        
        if (this.strict)
            return this.Error("Octal literals are not allowed in strict mode");
        
        this.value = parseInt(this.input.slice(start, this.offset), 8);
        
        return isNumberFollow(this.input[this.offset]) ? "NUMBER" : this.Error();
    },
    
    Number: function() {
    
        var start = this.offset,
            next;
        
        this.readInteger();
        
        if (this.input[this.offset] === ".") {
        
            this.offset++;
            this.readInteger();
        }
        
        next = this.input[this.offset];
        
        if (next === "e" || next === "E") {
        
            this.offset++;
            
            next = this.input[this.offset];
            
            if (next === "+" || next === "-")
                this.offset++;
            
            if (!this.readInteger())
                return this.Error();
        }
        
        this.value = parseFloat(this.input.slice(start, this.offset));
        
        return isNumberFollow(this.input[this.offset]) ? "NUMBER" : this.Error();
    },
    
    BinaryNumber: function() {
    
        this.offset += 2;
        this.value = parseInt(this.readRange(48, 49), 2);
        
        return isNumberFollow(this.input[this.offset]) ? "NUMBER" : this.Error();
    },
    
    OctalNumber: function() {
    
        this.offset += 2;
        this.value = parseInt(this.readRange(48, 55), 8);
        
        return isNumberFollow(this.input[this.offset]) ? "NUMBER" : this.Error();
    },
    
    HexNumber: function() {
    
        this.offset += 2;
        this.value = parseInt(this.readHex(0), 16);
        
        return isNumberFollow(this.input[this.offset]) ? "NUMBER" : this.Error();
    },
    
    Identifier: function(context) {
    
        var start = this.offset,
            id = "",
            chr,
            hex;

        while (isIdentifierPart(chr = this.input[this.offset])) {
        
            if (chr === "\\") {
            
                id += this.input.slice(start, this.offset++);
                
                if (this.input[this.offset++] !== "u")
                    return this.Error();
                
                hex = this.readHex(4);
                
                if (hex.length < 4)
                    return this.Error();
                
                id += String.fromCharCode(parseInt(hex, 16));
                start = this.offset;
                
            } else {
            
                this.offset++;
            }
        }
        
        id += this.input.slice(start, this.offset);
        
        if (context !== "name")
            if (reservedWord.test(id) || this.strict && strictReservedWord.test(id))
                return id;
        
        this.value = id;
        
        return "IDENTIFIER";
    },
    
    LineComment: function() {
    
        this.offset += 2;
        
        var start = this.offset,
            chr;
        
        while (chr = this.input[this.offset]) {
        
            if (isNewlineChar(chr))
                break;
            
            this.offset++;
        }
        
        this.value = this.input.slice(start, this.offset);
        
        return "COMMENT";
    },
    
    BlockComment: function() {
    
        this.offset += 2;
        
        var pattern = blockCommentPattern,
            start = this.offset,
            m;
        
        while (true) {
        
            pattern.lastIndex = this.offset;
            
            m = pattern.exec(this.input);
            if (!m) return this.Error();
            
            this.offset = m.index + m[0].length;
            
            if (m[0] === "*/")
                break;
            
            this.newlineBefore = true;
            this.addLineBreak(m.index);
        }
        
        this.value = this.input.slice(start, this.offset - 2);
        
        return "COMMENT";
    },
    
    Error: function(msg) {
    
        this.offset++;
        
        if (msg)
            this.error = msg;
        
        return "ILLEGAL";
    }
    
}});

exports.Scanner = Scanner;
};

__modules[4] = function(exports) {
var Transform = es6now.Class(function(__super) { return {

    // Transform an expression into a formal parameter list
    transformFormals: function(expr) {
    
        if (expr === null)
            return [];
            
        var list = (expr.type === "SequenceExpression") ? expr.expressions : [expr],
            params = [],
            param,
            node,
            i;
    
        for (i = 0; i < list.length; ++i) {
        
            node = list[i];
            
            params.push(param = {
            
                type: "FormalParameter",
                pattern: node,
                init: null,
                start: node.start,
                end: node.end
            });
            
            this.transformPatternElement(param, true);
        }
        
        return params;
    },
    
    transformArrayPattern: function(node, binding) {
    
        node.type = "ArrayPattern";
        
        var elems = node.elements,
            elem,
            rest,
            i;
        
        for (i = 0; i < elems.length; ++i) {
        
            elem = elems[i];
            
            if (!elem) 
                continue;
            
            if (elem.type !== "PatternElement") {
            
                rest = (elem.type === "SpreadExpression");
                
                elem = elems[i] = {
                
                    type: "PatternElement",
                    pattern: rest ? elem.expression : elem,
                    init: null,
                    rest: rest,
                    start: elem.start,
                    end: elem.end
                };
                
                // No trailing comma allowed after rest
                if (rest && (node.trailingComma || i < elems.length - 1))
                    this.fail("Invalid destructuring pattern", elem);
            }
            
            if (elem.rest) this.transformPattern(elem.pattern, binding);
            else this.transformPatternElement(elem, binding);
        }
    },
    
    transformObjectPattern: function(node, binding) {

        node.type = "ObjectPattern";
        
        var props = node.properties, 
            prop,
            i;
        
        for (i = 0; i < props.length; ++i) {
        
            prop = props[i];
            
            switch (prop.type) {
            
                case "PatternProperty":
                
                    break;
                
                case "CoveredPatternProperty":
                    
                    prop.type = "PatternProperty";
                    break;
                    
                case "PropertyDefinition":
                    
                    prop.type = "PatternProperty";
                    prop.pattern = prop.expression;
                    prop.init = null;
                    
                    delete prop.expression;
                    break;
                
                default:
                
                    this.fail("Invalid pattern", prop);
            }
            
            // Clear error flags
            if (prop.error)
                delete prop.error;
            
            if (prop.pattern) this.transformPatternElement(prop, binding);
            else this.transformPattern(prop.name, binding);
        }
    },
    
    transformPatternElement: function(elem, binding) {
    
        var node = elem.pattern;
        
        // Split assignment into pattern and initializer
        if (node.type === "AssignmentExpression" && node.operator === "=") {
        
            elem.pattern = node.left;
            elem.init = node.right;
        }
        
        this.transformPattern(elem.pattern, binding);
    },
    
    // Transforms an expression into a pattern
    transformPattern: function(node, binding) {

        switch (node.type) {
        
            case "Identifier":
            
                if (binding) this.checkBindingIdent(node, true);
                else this.checkAssignTarget(node, true);
                
                break;
            
            case "MemberExpression":
            case "CallExpression":
                if (binding) this.fail("Invalid left-hand-side in binding pattern", node);
                break;
            
            case "ObjectExpression":
            case "ObjectPattern":
                this.transformObjectPattern(node, binding);
                break;
            
            case "ArrayExpression":
            case "ArrayPattern":
                this.transformArrayPattern(node, binding);
                break;
                
            default:
                this.fail("Invalid expression in pattern", node);
                break;
        }
        
        return node;
    }
    
}});


exports.Transform = Transform;
};

__modules[5] = function(exports) {
// Object literal property name flags
var PROP_NORMAL = 1,
    PROP_ASSIGN = 2,
    PROP_GET = 4,
    PROP_SET = 8;

// Returns true if the specified name is a restricted identifier in strict mode
function isPoisonIdent(name) {

    return name === "eval" || name === "arguments";
}

var Validate = es6now.Class(function(__super) { return {

    // Checks an assignment target for strict mode restrictions
    checkAssignTarget: function(node, strict) {
    
        if (node.type !== "Identifier")
            return;
        
        // Mark identifier node as a variable
        node.context = "variable";
        
        if (!strict && !this.context.strict)
            return;
        
        if (isPoisonIdent(node.value))
            this.fail("Cannot modify " + node.value + " in strict mode", node);
    },
    
    // Checks a binding identifier for strict mode restrictions
    checkBindingIdent: function(node, strict) {
    
        // Mark identifier node as a declaration
        node.context = "declaration";
        
        if (!strict && !this.context.strict)
            return;
            
        var name = node.value;
        
        if (isPoisonIdent(name))
            this.fail("Binding cannot be created for '" + name + "' in strict mode", node);
    },
    
    // Checks function formal parameters for strict mode restrictions
    checkParameters: function(params) {
    
        if (!this.context.strict)
            return;
        
        var names = {}, 
            name,
            node,
            i;
        
        for (i = 0; i < params.length; ++i) {
        
            node = params[i];
            
            if (node.type !== "FormalParameter" || node.pattern.type !== "Identifier")
                continue;
            
            name = node.pattern.value;
            
            if (isPoisonIdent(name))
                this.fail("Parameter name " + name + " is not allowed in strict mode", node);
            
            if (names[name] === 1)
                this.fail("Strict mode function may not have duplicate parameter names", node);
            
            names[name] = 1;
        }
    },
    
    // Performs validation on the init portion of a for-in or for-of statement
    checkForInit: function(init, type) {
    
        if (init.type === "VariableDeclaration") {
        
            // For-in/of may only have one variable declaration
            
            if (init.declarations.length !== 1)
                this.fail("for-" + type + " statement may not have more than one variable declaration", init);
            
            // A variable initializer is only allowed in for-in where 
            // variable type is "var" and it is not a pattern
                
            var decl = init.declarations[0];
            
            if (decl.init && (
                type === "of" ||
                init.keyword !== "var" ||
                decl.pattern.type !== "Identifier")) {
                
                this.fail("Invalid initializer in for-" + type + " statement", init);
            }
            
        } else {
        
            // Transform object and array patterns
            this.transformPattern(init, false);
        }
    },
    
    // Returns true if the specified name type is a duplicate for a given set of flags
    isDuplicateName: function(type, flags) {
    
        if (!flags)
            return false;
        
        switch (type) {
        
            case PROP_ASSIGN: return (this.context.strict || flags !== PROP_ASSIGN);
            case PROP_GET: return (flags !== PROP_SET);
            case PROP_SET: return (flags !== PROP_GET);
            default: return !!flags;
        }
    },
    
    // Checks for duplicate property names in object literals or classes
    checkInvalidNodes: function() {
    
        var context = this.context,
            list = context.invalidNodes,
            node,
            i;
        
        if (list === null)
            return;
        
        for (i = 0; i < list.length; ++i) {
        
            node = list[i];
            
            if (node.error)
                this.fail(node.error, node);
        }
        
        context.invalidNodes = null;
    }
    
}});
exports.Validate = Validate;
};

__require(0, exports);


}, []);