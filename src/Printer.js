export class Printer {
  constructor() {
    this.indentWidth = 2;
    this.depth = 0;
    this.stringDelimiter = "'";
  }

  indent(s) {
    return ' '.repeat(this.indentWidth * this.depth) + s;
  }

  print(ast) {
    return this[ast.type](ast);
  }

  printList(list, sep = ', ') {
    return list.map(n => this.print(n)).join(sep);
  }

  js(literals, ...values) {
    let output = '';
    for (let i = 0; i < literals.length; ++i) {
      output += literals[i];
      if (i < values.length)
        output += typeof values[i] === 'string' ? values[i] : this.print(values[i]);
    }
    return output;
  }

  Identifier(node) {
    return node.value;
  }

  NumberLiteral(node) {
    return String(node.value) + (node.suffix || '');
  }

  StringLiteral(node) {
    return this.stringDelimiter + this.escapeString(node.value) + this.stringDelimiter;
  }

  TemplatePart() {
    return node.raw;
  }

  RegularExpression(node) {
    return `/${ node.value }/${ node.flags }`;
  }

  BooleanLiteral(node) {
    return node.value ? 'true' : 'false';
  }

  NullLiteral() {
    return 'null';
  }

  Script(node) {
    return this.printList(node.statements, '');
  }

  Module(node) {
    return this.printList(node.statement, '');
  }

  ThisExpression() {
    return 'this';
  }

  SuperKeyword() {
    return 'super';
  }

  SequenceExpression(node) {
    return this.printList(node.expressions);
  }

  AssignmentExpression(node) {
    return this.js`${ node.left } ${ node.operator } ${ node.right }`;
  }

  SpreadExpression(node) {
    return this.js`...${ node.expression }`;
  }

  YieldExpression(node) {
    return (node.delegate ? 'yield * ' : 'yield ') + this.print(node.expression);
  }

  ConditionalExpression(node) {
    return this.js`${ node.test } ? ${ node.consequent } : ${ node.alternate }`;
  }

  BinaryExpression(node) {
    return this.js`${ node.left } ${ node.operator } ${ node.right }`;
  }

  UpdateExpression(node) {
    return prefix ?
      this.js`${ node.operator }${ node.expression }` :
      this.js`${ node.expression }${ node.operator }`;
  }

  UnaryExpression(node) {
    return this.js`${ node.operator } ${ node.expression }`;
  }

  MemberExpression(node) {
    return computed ?
      this.js`${ node.object }[${ node.property }]` :
      this.js`${ node.object }.${ node.property }`;
  }

  MetaProperty(node) {
    return this.js`${ node.left }.${ node.right }`;
  }

  CallExpression(node) {
    return this.js`${ node.callee }(${ this.printList(node.arguments) })`;
  }

  TaggedTemplateExpression(node) {
    return this.js`${ node.tag }${ node.template }`;
  }

  NewExpression(node) {
    return this.js`new ${ node.callee }(${ this.printList(node.arguments) })`;
  }

  ParenExpression(node) {
    return this.js`(${ node.expression })`;
  }

  ObjectLiteral(node) {
    return this.js`{ ${ this.printList(node.properties) } }`;
  }

  ComputedPropertyName(node) {
    return this.js`[${ node.expression }]`;
  }

  PropertyDefinition(node) {
    return node.expression ?
      this.js`${ node.name }: ${ node.expression }` :
      this.js`${ node.name }`;
  }

  ObjectPattern(node) {
    return this.js`{ ${ this.printList(node.properties) } }`;
  }

  PatternProperty(node) {
    let out = this.js`${ node.name }`;

    if (node.pattern)
      out += this.js`: ${ node.pattern }`;

    if (node.initializer)
      out += this.js` = ${ node.initializer }`;

    return out;
  }

  ArrayPattern(node) {
    return this.js`[${ this.printList(node.elements) }]`;
  }

  PatternElement(node) {
    return node.initializer ?
      this.js`${ node.pattern } = ${ node.initializer }` :
      this.js`${ node.pattern }`;;
  }

  PatternRestElement(node) {
    return this.js`...${ node.pattern }`;
  }

  MethodDefinition(node) {
    let out = '';

    if (node.static) out += 'static ';

    switch (node.kind) {
      case 'generator': out += '*'; break;
      case 'async': out += 'async '; break;
      case 'async-generator': out += 'async *'; break;
    }

    out += this.js`${ node.name }(${ this.printList(node.params) })`;
    out += this.js`{${ node.body }}`;

    return out;
  }

  ArrayLiteral(node) {
    return this.js`[${ this.printList(node.elements) }]`;
  }

  TemplateExpression(node) {
    this.type = 'TemplateExpression';
    this.start = start;
    this.end = end;
    this.literals = lits;
    this.substitutions = subs;
  }

  Block(statements, start, end) {
    this.type = 'Block';
    this.start = start;
    this.end = end;
    this.statements = statements;
  }

  LabelledStatement(label, statement, start, end) {
    this.type = 'LabelledStatement';
    this.start = start;
    this.end = end;
    this.label = label;
    this.statement = statement;
  }

  ExpressionStatement(expr, start, end) {
    this.type = 'ExpressionStatement';
    this.start = start;
    this.end = end;
    this.expression = expr;
  }

  Directive(value, expr, start, end) {
    this.type = 'Directive';
    this.start = start;
    this.end = end;
    this.value = value;
    this.expression = expr;
  }

  EmptyStatement(start, end) {
    this.type = 'EmptyStatement';
    this.start = start;
    this.end = end;
  }

  VariableDeclaration(kind, list, start, end) {
    this.type = 'VariableDeclaration';
    this.start = start;
    this.end = end;
    this.kind = kind;
    this.declarations = list;
  }

  VariableDeclarator(pattern, initializer, start, end) {
    this.type = 'VariableDeclarator';
    this.start = start;
    this.end = end;
    this.pattern = pattern;
    this.initializer = initializer;
  }

  ReturnStatement(arg, start, end) {
    this.type = 'ReturnStatement';
    this.start = start;
    this.end = end;
    this.argument = arg;
  }

  BreakStatement(label, start, end) {
    this.type = 'BreakStatement';
    this.start = start;
    this.end = end;
    this.label = label;
  }

  ContinueStatement(label, start, end) {
    this.type = 'ContinueStatement';
    this.start = start;
    this.end = end;
    this.label = label;
  }

  ThrowStatement(expr, start, end) {
    this.type = 'ThrowStatement';
    this.start = start;
    this.end = end;
    this.expression = expr;
  }

  DebuggerStatement(start, end) {
    this.type = 'DebuggerStatement';
    this.start = start;
    this.end = end;
  }

  IfStatement(test, cons, alt, start, end) {
    this.type = 'IfStatement';
    this.start = start;
    this.end = end;
    this.test = test;
    this.consequent = cons;
    this.alternate = alt;
  }

  DoWhileStatement(body, test, start, end) {
    this.type = 'DoWhileStatement';
    this.start = start;
    this.end = end;
    this.body = body;
    this.test = test;
  }

  WhileStatement(test, body, start, end) {
    this.type = 'WhileStatement';
    this.start = start;
    this.end = end;
    this.test = test;
    this.body = body;
  }

  ForStatement(initializer, test, update, body, start, end) {
    this.type = 'ForStatement';
    this.start = start;
    this.end = end;
    this.initializer = initializer;
    this.test = test;
    this.update = update;
    this.body = body;
  }

  ForInStatement(left, right, body, start, end) {
    this.type = 'ForInStatement';
    this.start = start;
    this.end = end;
    this.left = left;
    this.right = right;
    this.body = body;
  }

  ForOfStatement(async, left, right, body, start, end) {
    this.type = 'ForOfStatement';
    this.async = async;
    this.start = start;
    this.end = end;
    this.left = left;
    this.right = right;
    this.body = body;
  }

  WithStatement(object, body, start, end) {
    this.type = 'WithStatement';
    this.start = start;
    this.end = end;
    this.object = object;
    this.body = body;
  }

  SwitchStatement(desc, cases, start, end) {
    this.type = 'SwitchStatement';
    this.start = start;
    this.end = end;
    this.descriminant = desc;
    this.cases = cases;
  }

  SwitchCase(test, cons, start, end) {
    this.type = 'SwitchCase';
    this.start = start;
    this.end = end;
    this.test = test;
    this.consequent = cons;
  }

  TryStatement(block, handler, fin, start, end) {
    this.type = 'TryStatement';
    this.start = start;
    this.end = end;
    this.block = block;
    this.handler = handler;
    this.finalizer = fin;
  }

  CatchClause(param, body, start, end) {
    this.type = 'CatchClause';
    this.start = start;
    this.end = end;
    this.param = param;
    this.body = body;
  }

  FunctionDeclaration(kind, identifier, params, body, start, end) {
    this.type = 'FunctionDeclaration';
    this.start = start;
    this.end = end;
    this.kind = kind;
    this.identifier = identifier;
    this.params = params;
    this.body = body;
  }

  FunctionExpression(kind, identifier, params, body, start, end) {
    this.type = 'FunctionExpression';
    this.start = start;
    this.end = end;
    this.kind = kind;
    this.identifier = identifier;
    this.params = params;
    this.body = body;
  }

  FormalParameter(pattern, initializer, start, end) {
    this.type = 'FormalParameter';
    this.start = start;
    this.end = end;
    this.pattern = pattern;
    this.initializer = initializer;
  }

  RestParameter(identifier, start, end) {
    this.type = 'RestParameter';
    this.start = start;
    this.end = end;
    this.identifier = identifier;
  }

  FunctionBody(statements, start, end) {
    this.type = 'FunctionBody';
    this.start = start;
    this.end = end;
    this.statements = statements;
  }

  ArrowFunctionHead(params, start, end) {
    this.type = 'ArrowFunctionHead';
    this.start = start;
    this.end = end;
    this.parameters = params;
  }

  ArrowFunction(kind, params, body, start, end) {
    this.type = 'ArrowFunction';
    this.start = start;
    this.end = end;
    this.kind = kind;
    this.params = params;
    this.body = body;
  }

  ClassDeclaration(identifier, base, body, start, end) {
    this.type = 'ClassDeclaration';
    this.start = start;
    this.end = end;
    this.identifier = identifier;
    this.base = base;
    this.body = body;
  }

  ClassExpression(identifier, base, body, start, end) {
    this.type = 'ClassExpression';
    this.start = start;
    this.end = end;
    this.identifier = identifier;
    this.base = base;
    this.body = body;
  }

  ClassBody(elems, start, end) {
    this.type = 'ClassBody';
    this.start = start;
    this.end = end;
    this.elements = elems;
  }

  EmptyClassElement(start, end) {
    this.type = 'EmptyClassElement';
    this.start = start;
    this.end = end;
  }

  ClassField(isStatic, name, initializer, start, end) {
    this.type = 'ClassField';
    this.static = isStatic;
    this.name = name;
    this.initializer = initializer;
    this.start = start;
    this.end = end;
  }

  ImportCall(argument, start, end) {
    this.type = 'ImportCall';
    this.argument = argument;
    this.start = start;
    this.end = end;
  }

  ImportDeclaration(imports, from, start, end) {
    this.type = 'ImportDeclaration';
    this.start = start;
    this.end = end;
    this.imports = imports;
    this.from = from;
  }

  NamespaceImport(identifier, start, end) {
    this.type = 'NamespaceImport';
    this.start = start;
    this.end = end;
    this.identifier = identifier;
  }

  NamedImports(specifiers, start, end) {
    this.type = 'NamedImports';
    this.start = start;
    this.end = end;
    this.specifiers = specifiers;
  }

  DefaultImport(identifier, imports, start, end) {
    this.type = 'DefaultImport';
    this.start = start;
    this.end = end;
    this.identifier = identifier;
    this.imports = imports;
  }

  ImportSpecifier(imported, local, start, end) {
    this.type = 'ImportSpecifier';
    this.start = start;
    this.end = end;
    this.imported = imported;
    this.local = local;
  }

  ExportDeclaration(declaration, start, end) {
    this.type = 'ExportDeclaration';
    this.start = start;
    this.end = end;
    this.declaration = declaration;
  }

  ExportDefault(binding, start, end) {
    this.type = 'ExportDefault';
    this.binding = binding;
    this.start = start;
    this.end = end;
  }

  ExportNameList(specifiers, from, start, end) {
    this.type = 'ExportNameList';
    this.start = start;
    this.end = end;
    this.specifiers = specifiers;
    this.from = from;
  }

  ExportNamespace(identifier, from, start, end) {
    this.type = 'ExportNamespace';
    this.start = start;
    this.end = end;
    this.identifier = identifier;
    this.from = from;
  }

  ExportDefaultFrom(identifier, from, start, end) {
    this.type = 'ExportDefaultFrom';
    this.start = start;
    this.end = end;
    this.identifier = identifier;
    this.from = from;
  }

  ExportSpecifier(local, exported, start, end) {
    this.type = 'ExportSpecifier';
    this.start = start;
    this.end = end;
    this.local = local;
    this.exported = exported;
  }

  Annotation(path, args, start, end) {
    this.type = 'Annotation';
    this.start = start;
    this.end = end;
    this.path = path;
    this.arguments = args;
  }

}
