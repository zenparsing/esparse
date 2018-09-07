function isNode(x) {
  return x !== null && typeof x === 'object' && typeof x.type === 'string';
}

export function forEachChild(node, fn) {
  let keys = Object.keys(node);
  let stop = {};

  for (let i = 0; i < keys.length; ++i) {
    let key = keys[i];
    let value = node[key];

    if (Array.isArray(value)) {

      for (let j = 0; j < value.length; ++j) {
        if (isNode(value[j]))
          if (fn(value[j], key, j, stop) === stop)
            return;
      }

    } else if (isNode(value)) {

      if (fn(value, key, null, stop) === stop)
        return;

    }
  }
}

export function Identifier(value, context) {
  this.type = 'Identifier';
  this.start = -1;
  this.end = -1;
  this.value = value;
  this.context = context;
}

export function NumberLiteral(value, suffix) {
  this.type = 'NumberLiteral';
  this.start = -1;
  this.end = -1;
  this.value = value;
  this.suffix = suffix;
}

export function StringLiteral(value) {
  this.type = 'StringLiteral';
  this.start = -1;
  this.end = -1;
  this.value = value;
}

export function TemplatePart(value, raw, isEnd) {
  this.type = 'TemplatePart';
  this.start = -1;
  this.end = -1;
  this.value = value;
  this.raw = raw;
  this.templateEnd = isEnd;
}

export function RegularExpression(value, flags) {
  this.type = 'RegularExpression';
  this.start = -1;
  this.end = -1;
  this.value = value;
  this.flags = flags;
}

export function BooleanLiteral(value) {
  this.type = 'BooleanLiteral';
  this.start = -1;
  this.end = -1;
  this.value = value;
}

export function NullLiteral() {
  this.type = 'NullLiteral';
  this.start = -1;
  this.end = -1;
}

export function Script(statements) {
  this.type = 'Script';
  this.start = -1;
  this.end = -1;
  this.statements = statements;
}

export function Module(statements) {
  this.type = 'Module';
  this.start = -1;
  this.end = -1;
  this.statements = statements;
}

export function ThisExpression() {
  this.type = 'ThisExpression';
  this.start = -1;
  this.end = -1;
}

export function SuperKeyword() {
  this.type = 'SuperKeyword';
  this.start = -1;
  this.end = -1;
}

export function SequenceExpression(list) {
  this.type = 'SequenceExpression';
  this.start = -1;
  this.end = -1;
  this.expressions = list;
}

export function AssignmentExpression(left, op, right) {
  this.type = 'AssignmentExpression';
  this.start = -1;
  this.end = -1;
  this.left = left;
  this.operator = op;
  this.right = right;
}

export function SpreadExpression(expr) {
  this.type = 'SpreadExpression';
  this.start = -1;
  this.end = -1;
  this.expression = expr;
}

export function YieldExpression(expr, delegate) {
  this.type = 'YieldExpression';
  this.start = -1;
  this.end = -1;
  this.delegate = delegate;
  this.expression = expr;
}

export function ConditionalExpression(test, cons, alt) {
  this.type = 'ConditionalExpression';
  this.start = -1;
  this.end = -1;
  this.test = test;
  this.consequent = cons;
  this.alternate = alt;
}

export function BinaryExpression(left, op, right) {
  this.type = 'BinaryExpression';
  this.start = -1;
  this.end = -1;
  this.left = left;
  this.operator = op;
  this.right = right;
}

export function UpdateExpression(op, expr, prefix) {
  this.type = 'UpdateExpression';
  this.start = -1;
  this.end = -1;
  this.operator = op;
  this.expression = expr;
  this.prefix = prefix;
}

export function UnaryExpression(op, expr) {
  this.type = 'UnaryExpression';
  this.start = -1;
  this.end = -1;
  this.operator = op;
  this.expression = expr;
}

export function MemberExpression(obj, prop) {
  this.type = 'MemberExpression';
  this.start = -1;
  this.end = -1;
  this.object = obj;
  this.property = prop;
}

export function MetaProperty(left, right) {
  this.type = 'MetaProperty';
  this.start = -1;
  this.end = -1;
  this.left = left;
  this.right = right;
}

export function CallExpression(callee, args, trailingComma) {
  this.type = 'CallExpression';
  this.start = -1;
  this.end = -1;
  this.callee = callee;
  this.arguments = args;
  this.trailingComma = trailingComma;
}

export function TemplateExpression(parts) {
  this.type = 'TemplateExpression';
  this.start = -1;
  this.end = -1;
  this.parts = parts;
}

export function TaggedTemplateExpression(tag, template) {
  this.type = 'TaggedTemplateExpression';
  this.start = -1;
  this.end = -1;
  this.tag = tag;
  this.template = template;
}

export function NewExpression(callee, args, trailingComma) {
  this.type = 'NewExpression';
  this.start = -1;
  this.end = -1;
  this.callee = callee;
  this.arguments = args;
  this.trailingComma = trailingComma;
}

export function ParenExpression(expr) {
  this.type = 'ParenExpression';
  this.start = -1;
  this.end = -1;
  this.expression = expr;
}

export function ObjectLiteral(props, comma) {
  this.type = 'ObjectLiteral';
  this.start = -1;
  this.end = -1;
  this.properties = props;
  this.trailingComma = comma;
}

export function ComputedPropertyName(expr) {
  this.type = 'ComputedPropertyName';
  this.start = -1;
  this.end = -1;
  this.expression = expr;
}

export function PropertyDefinition(name, expr) {
  this.type = 'PropertyDefinition';
  this.start = -1;
  this.end = -1;
  this.name = name;
  this.expression = expr;
}

export function ObjectPattern(props, comma) {
  this.type = 'ObjectPattern';
  this.start = -1;
  this.end = -1;
  this.properties = props;
  this.trailingComma = comma;
}

export function PatternProperty(name, pattern, initializer) {
  this.type = 'PatternProperty';
  this.start = -1;
  this.end = -1;
  this.name = name;
  this.pattern = pattern;
  this.initializer = initializer;
}

export function ArrayPattern(elements, comma) {
  this.type = 'ArrayPattern';
  this.start = -1;
  this.end = -1;
  this.elements = elements;
  this.trailingComma = comma;
}

export function PatternElement(pattern, initializer) {
  this.type = 'PatternElement';
  this.start = -1;
  this.end = -1;
  this.pattern = pattern;
  this.initializer = initializer;
}

export function PatternRestElement(pattern) {
  this.type = 'PatternRestElement';
  this.start = -1;
  this.end = -1;
  this.pattern = pattern;
}

export function MethodDefinition(isStatic, kind, name, params, body) {
  this.type = 'MethodDefinition';
  this.start = -1;
  this.end = -1;
  this.static = isStatic;
  this.kind = kind;
  this.name = name;
  this.params = params;
  this.body = body;
}

export function ArrayLiteral(elements, comma) {
  this.type = 'ArrayLiteral';
  this.start = -1;
  this.end = -1;
  this.elements = elements;
  this.trailingComma = comma;
}

export function Block(statements) {
  this.type = 'Block';
  this.start = -1;
  this.end = -1;
  this.statements = statements;
}

export function LabelledStatement(label, statement) {
  this.type = 'LabelledStatement';
  this.start = -1;
  this.end = -1;
  this.label = label;
  this.statement = statement;
}

export function ExpressionStatement(expr) {
  this.type = 'ExpressionStatement';
  this.start = -1;
  this.end = -1;
  this.expression = expr;
}

export function Directive(value, expr) {
  this.type = 'Directive';
  this.start = -1;
  this.end = -1;
  this.value = value;
  this.expression = expr;
}

export function EmptyStatement() {
  this.type = 'EmptyStatement';
  this.start = -1;
  this.end = -1;
}

export function VariableDeclaration(kind, list) {
  this.type = 'VariableDeclaration';
  this.start = -1;
  this.end = -1;
  this.kind = kind;
  this.declarations = list;
}

export function VariableDeclarator(pattern, initializer) {
  this.type = 'VariableDeclarator';
  this.start = -1;
  this.end = -1;
  this.pattern = pattern;
  this.initializer = initializer;
}

export function ReturnStatement(arg) {
  this.type = 'ReturnStatement';
  this.start = -1;
  this.end = -1;
  this.argument = arg;
}

export function BreakStatement(label) {
  this.type = 'BreakStatement';
  this.start = -1;
  this.end = -1;
  this.label = label;
}

export function ContinueStatement(label) {
  this.type = 'ContinueStatement';
  this.start = -1;
  this.end = -1;
  this.label = label;
}

export function ThrowStatement(expr) {
  this.type = 'ThrowStatement';
  this.start = -1;
  this.end = -1;
  this.expression = expr;
}

export function DebuggerStatement() {
  this.type = 'DebuggerStatement';
  this.start = -1;
  this.end = -1;
}

export function IfStatement(test, cons, alt) {
  this.type = 'IfStatement';
  this.start = -1;
  this.end = -1;
  this.test = test;
  this.consequent = cons;
  this.alternate = alt;
}

export function DoWhileStatement(body, test) {
  this.type = 'DoWhileStatement';
  this.start = -1;
  this.end = -1;
  this.body = body;
  this.test = test;
}

export function WhileStatement(test, body) {
  this.type = 'WhileStatement';
  this.start = -1;
  this.end = -1;
  this.test = test;
  this.body = body;
}

export function ForStatement(initializer, test, update, body) {
  this.type = 'ForStatement';
  this.start = -1;
  this.end = -1;
  this.initializer = initializer;
  this.test = test;
  this.update = update;
  this.body = body;
}

export function ForInStatement(left, right, body) {
  this.type = 'ForInStatement';
  this.start = -1;
  this.end = -1;
  this.left = left;
  this.right = right;
  this.body = body;
}

export function ForOfStatement(async, left, right, body) {
  this.type = 'ForOfStatement';
  this.start = -1;
  this.end = -1;
  this.async = async;
  this.left = left;
  this.right = right;
  this.body = body;
}

export function WithStatement(object, body) {
  this.type = 'WithStatement';
  this.start = -1;
  this.end = -1;
  this.object = object;
  this.body = body;
}

export function SwitchStatement(desc, cases) {
  this.type = 'SwitchStatement';
  this.start = -1;
  this.end = -1;
  this.descriminant = desc;
  this.cases = cases;
}

export function SwitchCase(test, cons) {
  this.type = 'SwitchCase';
  this.start = -1;
  this.end = -1;
  this.test = test;
  this.consequent = cons;
}

export function TryStatement(block, handler, fin) {
  this.type = 'TryStatement';
  this.start = -1;
  this.end = -1;
  this.block = block;
  this.handler = handler;
  this.finalizer = fin;
}

export function CatchClause(param, body) {
  this.type = 'CatchClause';
  this.start = -1;
  this.end = -1;
  this.param = param;
  this.body = body;
}

export function FunctionDeclaration(kind, identifier, params, body) {
  this.type = 'FunctionDeclaration';
  this.start = -1;
  this.end = -1;
  this.kind = kind;
  this.identifier = identifier;
  this.params = params;
  this.body = body;
}

export function FunctionExpression(kind, identifier, params, body) {
  this.type = 'FunctionExpression';
  this.start = -1;
  this.end = -1;
  this.kind = kind;
  this.identifier = identifier;
  this.params = params;
  this.body = body;
}

export function FormalParameter(pattern, initializer) {
  this.type = 'FormalParameter';
  this.start = -1;
  this.end = -1;
  this.pattern = pattern;
  this.initializer = initializer;
}

export function RestParameter(identifier) {
  this.type = 'RestParameter';
  this.start = -1;
  this.end = -1;
  this.identifier = identifier;
}

export function FunctionBody(statements) {
  this.type = 'FunctionBody';
  this.start = -1;
  this.end = -1;
  this.statements = statements;
}

export function ArrowFunctionHead(params) {
  this.type = 'ArrowFunctionHead';
  this.start = -1;
  this.end = -1;
  this.parameters = params;
}

export function ArrowFunction(kind, params, body) {
  this.type = 'ArrowFunction';
  this.start = -1;
  this.end = -1;
  this.kind = kind;
  this.params = params;
  this.body = body;
}

export function ClassDeclaration(identifier, base, body) {
  this.type = 'ClassDeclaration';
  this.start = -1;
  this.end = -1;
  this.identifier = identifier;
  this.base = base;
  this.body = body;
}

export function ClassExpression(identifier, base, body) {
  this.type = 'ClassExpression';
  this.start = -1;
  this.end = -1;
  this.identifier = identifier;
  this.base = base;
  this.body = body;
}

export function ClassBody(elems) {
  this.type = 'ClassBody';
  this.start = -1;
  this.end = -1;
  this.elements = elems;
}

export function EmptyClassElement() {
  this.type = 'EmptyClassElement';
  this.start = -1;
  this.end = -1;
}

export function ClassField(isStatic, name, initializer) {
  this.type = 'ClassField';
  this.start = -1;
  this.end = -1;
  this.static = isStatic;
  this.name = name;
  this.initializer = initializer;
}

export function ImportCall(argument) {
  this.type = 'ImportCall';
  this.start = -1;
  this.end = -1;
  this.argument = argument;
}

export function ImportDeclaration(imports, from) {
  this.type = 'ImportDeclaration';
  this.start = -1;
  this.end = -1;
  this.imports = imports;
  this.from = from;
}

export function NamespaceImport(identifier) {
  this.type = 'NamespaceImport';
  this.start = -1;
  this.end = -1;
  this.identifier = identifier;
}

export function NamedImports(specifiers) {
  this.type = 'NamedImports';
  this.start = -1;
  this.end = -1;
  this.specifiers = specifiers;
}

export function DefaultImport(identifier, imports) {
  this.type = 'DefaultImport';
  this.start = -1;
  this.end = -1;
  this.identifier = identifier;
  this.imports = imports;
}

export function ImportSpecifier(imported, local) {
  this.type = 'ImportSpecifier';
  this.start = -1;
  this.end = -1;
  this.imported = imported;
  this.local = local;
}

export function ExportDeclaration(declaration) {
  this.type = 'ExportDeclaration';
  this.start = -1;
  this.end = -1;
  this.declaration = declaration;
}

export function ExportDefault(binding) {
  this.type = 'ExportDefault';
  this.start = -1;
  this.end = -1;
  this.binding = binding;
}

export function ExportNameList(specifiers, from) {
  this.type = 'ExportNameList';
  this.start = -1;
  this.end = -1;
  this.specifiers = specifiers;
  this.from = from;
}

export function ExportNamespace(identifier, from) {
  this.type = 'ExportNamespace';
  this.start = -1;
  this.end = -1;
  this.identifier = identifier;
  this.from = from;
}

export function ExportDefaultFrom(identifier, from) {
  this.type = 'ExportDefaultFrom';
  this.start = -1;
  this.end = -1;
  this.identifier = identifier;
  this.from = from;
}

export function ExportSpecifier(local, exported) {
  this.type = 'ExportSpecifier';
  this.start = -1;
  this.end = -1;
  this.local = local;
  this.exported = exported;
}

export function Annotation(path, args) {
  this.type = 'Annotation';
  this.start = -1;
  this.end = -1;
  this.path = path;
  this.arguments = args;
}

export function Comment(text) {
  this.type = 'Comment';
  this.start = -1;
  this.end = -1;
  this.text = text;
}
