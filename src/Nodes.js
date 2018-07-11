export function Node(type, start, end) {
  this.type = type;
  this.start = start;
  this.end = end;
}

export function Identifier(value, context, start, end) {
  this.type = 'Identifier';
  this.start = start;
  this.end = end;
  this.value = value;
  this.context = context;
}

export function NumberLiteral(value, suffix, start, end) {
  this.type = 'NumberLiteral';
  this.start = start;
  this.end = end;
  this.value = value;
  this.suffix = suffix;
}

export function StringLiteral(value, start, end) {
  this.type = 'StringLiteral';
  this.start = start;
  this.end = end;
  this.value = value;
}

export function TemplatePart(value, raw, isEnd, start, end) {
  this.type = 'TemplatePart';
  this.start = start;
  this.end = end;
  this.value = value;
  this.raw = raw;
  this.templateEnd = isEnd;
}

export function RegularExpression(value, flags, start, end) {
  this.type = 'RegularExpression';
  this.start = start;
  this.end = end;
  this.value = value;
  this.flags = flags;
}

export function BooleanLiteral(value, start, end) {
  this.type = 'BooleanLiteral';
  this.start = start;
  this.end = end;
  this.value = value;
}

export function NullLiteral(start, end) {
  this.type = 'NullLiteral';
  this.start = start;
  this.end = end;
}

export function Script(statements, start, end) {
  this.type = 'Script';
  this.start = start;
  this.end = end;
  this.statements = statements;
}

export function Module(statements, start, end) {
  this.type = 'Module';
  this.start = start;
  this.end = end;
  this.statements = statements;
}

export function ThisExpression(start, end) {
  this.type = 'ThisExpression';
  this.start = start;
  this.end = end;
}

export function SuperKeyword(start, end) {
  this.type = 'SuperKeyword';
  this.start = start;
  this.end = end;
}

export function SequenceExpression(list, start, end) {
  this.type = 'SequenceExpression';
  this.start = start;
  this.end = end;
  this.expressions = list;
}

export function AssignmentExpression(op, left, right, start, end) {
  this.type = 'AssignmentExpression';
  this.start = start;
  this.end = end;
  this.operator = op;
  this.left = left;
  this.right = right;
}

export function SpreadExpression(expr, start, end) {
  this.type = 'SpreadExpression';
  this.start = start;
  this.end = end;
  this.expression = expr;
}

export function YieldExpression(expr, delegate, start, end) {
  this.type = 'YieldExpression';
  this.start = start;
  this.end = end;
  this.delegate = delegate;
  this.expression = expr;
}

export function ConditionalExpression(test, cons, alt, start, end) {
  this.type = 'ConditionalExpression';
  this.start = start;
  this.end = end;
  this.test = test;
  this.consequent = cons;
  this.alternate = alt;
}

export function BinaryExpression(op, left, right, start, end) {
  this.type = 'BinaryExpression';
  this.start = start;
  this.end = end;
  this.operator = op;
  this.left = left;
  this.right = right;
}

export function UpdateExpression(op, expr, prefix, start, end) {
  this.type = 'UpdateExpression';
  this.start = start;
  this.end = end;
  this.operator = op;
  this.expression = expr;
  this.prefix = prefix;
}

export function UnaryExpression(op, expr, start, end) {
  this.type = 'UnaryExpression';
  this.start = start;
  this.end = end;
  this.operator = op;
  this.expression = expr;
}

export function MemberExpression(obj, prop, computed, start, end) {
  this.type = 'MemberExpression';
  this.start = start;
  this.end = end;
  this.object = obj;
  this.property = prop;
  this.computed = computed;
}

export function MetaProperty(left, right, start, end) {
  this.type = 'MetaProperty';
  this.start = start;
  this.end = end;
  this.left = left;
  this.right = right;
}

export function CallExpression(callee, args, trailingComma, start, end) {
  this.type = 'CallExpression';
  this.start = start;
  this.end = end;
  this.callee = callee;
  this.arguments = args;
  this.trailingComma = trailingComma;
}

export function TemplateExpression(parts, start, end) {
  this.type = 'TemplateExpression';
  this.start = start;
  this.end = end;
  this.parts = parts;
}

export function TaggedTemplateExpression(tag, template, start, end) {
  this.type = 'TaggedTemplateExpression';
  this.start = start;
  this.end = end;
  this.tag = tag;
  this.template = template;
}

export function NewExpression(callee, args, trailingComma, start, end) {
  this.type = 'NewExpression';
  this.start = start;
  this.end = end;
  this.callee = callee;
  this.arguments = args;
  this.trailingComma = trailingComma;
}

export function ParenExpression(expr, start, end) {
  this.type = 'ParenExpression';
  this.start = start;
  this.end = end;
  this.expression = expr;
}

export function ObjectLiteral(props, comma, start, end) {
  this.type = 'ObjectLiteral';
  this.start = start;
  this.end = end;
  this.properties = props;
  this.trailingComma = comma;
}

export function ComputedPropertyName(expr, start, end) {
  this.type = 'ComputedPropertyName';
  this.start = start;
  this.end = end;
  this.expression = expr;
}

export function PropertyDefinition(name, expr, start, end) {
  this.type = 'PropertyDefinition';
  this.start = start;
  this.end = end;
  this.name = name;
  this.expression = expr;
}

export function ObjectPattern(props, comma, start, end) {
  this.type = 'ObjectPattern';
  this.start = start;
  this.end = end;
  this.properties = props;
  this.trailingComma = comma;
}

export function PatternProperty(name, pattern, initializer, start, end) {
  this.type = 'PatternProperty';
  this.start = start;
  this.end = end;
  this.name = name;
  this.pattern = pattern;
  this.initializer = initializer;
}

export function ArrayPattern(elements, comma, start, end) {
  this.type = 'ArrayPattern';
  this.start = start;
  this.end = end;
  this.elements = elements;
  this.trailingComma = comma;
}

export function PatternElement(pattern, initializer, start, end) {
  this.type = 'PatternElement';
  this.start = start;
  this.end = end;
  this.pattern = pattern;
  this.initializer = initializer;
}

export function PatternRestElement(pattern, start, end) {
  this.type = 'PatternRestElement';
  this.start = start;
  this.end = end;
  this.pattern = pattern;
}

export function MethodDefinition(isStatic, kind, name, params, body, start, end) {
  this.type = 'MethodDefinition';
  this.start = start;
  this.end = end;
  this.static = isStatic;
  this.kind = kind;
  this.name = name;
  this.params = params;
  this.body = body;
}

export function ArrayLiteral(elements, comma, start, end) {
  this.type = 'ArrayLiteral';
  this.start = start;
  this.end = end;
  this.elements = elements;
  this.trailingComma = comma;
}

export function Block(statements, start, end) {
  this.type = 'Block';
  this.start = start;
  this.end = end;
  this.statements = statements;
}

export function LabelledStatement(label, statement, start, end) {
  this.type = 'LabelledStatement';
  this.start = start;
  this.end = end;
  this.label = label;
  this.statement = statement;
}

export function ExpressionStatement(expr, start, end) {
  this.type = 'ExpressionStatement';
  this.start = start;
  this.end = end;
  this.expression = expr;
}

export function Directive(value, expr, start, end) {
  this.type = 'Directive';
  this.start = start;
  this.end = end;
  this.value = value;
  this.expression = expr;
}

export function EmptyStatement(start, end) {
  this.type = 'EmptyStatement';
  this.start = start;
  this.end = end;
}

export function VariableDeclaration(kind, list, start, end) {
  this.type = 'VariableDeclaration';
  this.start = start;
  this.end = end;
  this.kind = kind;
  this.declarations = list;
}

export function VariableDeclarator(pattern, initializer, start, end) {
  this.type = 'VariableDeclarator';
  this.start = start;
  this.end = end;
  this.pattern = pattern;
  this.initializer = initializer;
}

export function ReturnStatement(arg, start, end) {
  this.type = 'ReturnStatement';
  this.start = start;
  this.end = end;
  this.argument = arg;
}

export function BreakStatement(label, start, end) {
  this.type = 'BreakStatement';
  this.start = start;
  this.end = end;
  this.label = label;
}

export function ContinueStatement(label, start, end) {
  this.type = 'ContinueStatement';
  this.start = start;
  this.end = end;
  this.label = label;
}

export function ThrowStatement(expr, start, end) {
  this.type = 'ThrowStatement';
  this.start = start;
  this.end = end;
  this.expression = expr;
}

export function DebuggerStatement(start, end) {
  this.type = 'DebuggerStatement';
  this.start = start;
  this.end = end;
}

export function IfStatement(test, cons, alt, start, end) {
  this.type = 'IfStatement';
  this.start = start;
  this.end = end;
  this.test = test;
  this.consequent = cons;
  this.alternate = alt;
}

export function DoWhileStatement(body, test, start, end) {
  this.type = 'DoWhileStatement';
  this.start = start;
  this.end = end;
  this.body = body;
  this.test = test;
}

export function WhileStatement(test, body, start, end) {
  this.type = 'WhileStatement';
  this.start = start;
  this.end = end;
  this.test = test;
  this.body = body;
}

export function ForStatement(initializer, test, update, body, start, end) {
  this.type = 'ForStatement';
  this.start = start;
  this.end = end;
  this.initializer = initializer;
  this.test = test;
  this.update = update;
  this.body = body;
}

export function ForInStatement(left, right, body, start, end) {
  this.type = 'ForInStatement';
  this.start = start;
  this.end = end;
  this.left = left;
  this.right = right;
  this.body = body;
}

export function ForOfStatement(async, left, right, body, start, end) {
  this.type = 'ForOfStatement';
  this.async = async;
  this.start = start;
  this.end = end;
  this.left = left;
  this.right = right;
  this.body = body;
}

export function WithStatement(object, body, start, end) {
  this.type = 'WithStatement';
  this.start = start;
  this.end = end;
  this.object = object;
  this.body = body;
}

export function SwitchStatement(desc, cases, start, end) {
  this.type = 'SwitchStatement';
  this.start = start;
  this.end = end;
  this.descriminant = desc;
  this.cases = cases;
}

export function SwitchCase(test, cons, start, end) {
  this.type = 'SwitchCase';
  this.start = start;
  this.end = end;
  this.test = test;
  this.consequent = cons;
}

export function TryStatement(block, handler, fin, start, end) {
  this.type = 'TryStatement';
  this.start = start;
  this.end = end;
  this.block = block;
  this.handler = handler;
  this.finalizer = fin;
}

export function CatchClause(param, body, start, end) {
  this.type = 'CatchClause';
  this.start = start;
  this.end = end;
  this.param = param;
  this.body = body;
}

export function FunctionDeclaration(kind, identifier, params, body, start, end) {
  this.type = 'FunctionDeclaration';
  this.start = start;
  this.end = end;
  this.kind = kind;
  this.identifier = identifier;
  this.params = params;
  this.body = body;
}

export function FunctionExpression(kind, identifier, params, body, start, end) {
  this.type = 'FunctionExpression';
  this.start = start;
  this.end = end;
  this.kind = kind;
  this.identifier = identifier;
  this.params = params;
  this.body = body;
}

export function FormalParameter(pattern, initializer, start, end) {
  this.type = 'FormalParameter';
  this.start = start;
  this.end = end;
  this.pattern = pattern;
  this.initializer = initializer;
}

export function RestParameter(identifier, start, end) {
  this.type = 'RestParameter';
  this.start = start;
  this.end = end;
  this.identifier = identifier;
}

export function FunctionBody(statements, start, end) {
  this.type = 'FunctionBody';
  this.start = start;
  this.end = end;
  this.statements = statements;
}

export function ArrowFunctionHead(params, start, end) {
  this.type = 'ArrowFunctionHead';
  this.start = start;
  this.end = end;
  this.parameters = params;
}

export function ArrowFunction(kind, params, body, start, end) {
  this.type = 'ArrowFunction';
  this.start = start;
  this.end = end;
  this.kind = kind;
  this.params = params;
  this.body = body;
}

export function ClassDeclaration(identifier, base, body, start, end) {
  this.type = 'ClassDeclaration';
  this.start = start;
  this.end = end;
  this.identifier = identifier;
  this.base = base;
  this.body = body;
}

export function ClassExpression(identifier, base, body, start, end) {
  this.type = 'ClassExpression';
  this.start = start;
  this.end = end;
  this.identifier = identifier;
  this.base = base;
  this.body = body;
}

export function ClassBody(elems, start, end) {
  this.type = 'ClassBody';
  this.start = start;
  this.end = end;
  this.elements = elems;
}

export function EmptyClassElement(start, end) {
  this.type = 'EmptyClassElement';
  this.start = start;
  this.end = end;
}

export function ClassField(isStatic, name, initializer, start, end) {
  this.type = 'ClassField';
  this.static = isStatic;
  this.name = name;
  this.initializer = initializer;
  this.start = start;
  this.end = end;
}

export function ImportCall(argument, start, end) {
  this.type = 'ImportCall';
  this.argument = argument;
  this.start = start;
  this.end = end;
}

export function ImportDeclaration(imports, from, start, end) {
  this.type = 'ImportDeclaration';
  this.start = start;
  this.end = end;
  this.imports = imports;
  this.from = from;
}

export function NamespaceImport(identifier, start, end) {
  this.type = 'NamespaceImport';
  this.start = start;
  this.end = end;
  this.identifier = identifier;
}

export function NamedImports(specifiers, start, end) {
  this.type = 'NamedImports';
  this.start = start;
  this.end = end;
  this.specifiers = specifiers;
}

export function DefaultImport(identifier, imports, start, end) {
  this.type = 'DefaultImport';
  this.start = start;
  this.end = end;
  this.identifier = identifier;
  this.imports = imports;
}

export function ImportSpecifier(imported, local, start, end) {
  this.type = 'ImportSpecifier';
  this.start = start;
  this.end = end;
  this.imported = imported;
  this.local = local;
}

export function ExportDeclaration(declaration, start, end) {
  this.type = 'ExportDeclaration';
  this.start = start;
  this.end = end;
  this.declaration = declaration;
}

export function ExportDefault(binding, start, end) {
  this.type = 'ExportDefault';
  this.binding = binding;
  this.start = start;
  this.end = end;
}

export function ExportNameList(specifiers, from, start, end) {
  this.type = 'ExportNameList';
  this.start = start;
  this.end = end;
  this.specifiers = specifiers;
  this.from = from;
}

export function ExportNamespace(identifier, from, start, end) {
  this.type = 'ExportNamespace';
  this.start = start;
  this.end = end;
  this.identifier = identifier;
  this.from = from;
}

export function ExportDefaultFrom(identifier, from, start, end) {
  this.type = 'ExportDefaultFrom';
  this.start = start;
  this.end = end;
  this.identifier = identifier;
  this.from = from;
}

export function ExportSpecifier(local, exported, start, end) {
  this.type = 'ExportSpecifier';
  this.start = start;
  this.end = end;
  this.local = local;
  this.exported = exported;
}

export function Annotation(path, args, start, end) {
  this.type = 'Annotation';
  this.start = start;
  this.end = end;
  this.path = path;
  this.arguments = args;
}

export function Comment(text, start, end) {
  this.type = 'Comment';
  this.start = start;
  this.end = end;
  this.text = text;
}
