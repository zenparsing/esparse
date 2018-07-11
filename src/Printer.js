const SPACE = {};
const NEWLINE = {};
const INDENT = {};
const OUTDENT = {};

export class Printer {
  constructor() {
    this.indentWidth = 2;
    this.depth = 0;
    this.stringDelimiter = "'";
    this.output = '';
  }

  newline() {
    this.output += '\n';
    if (this.indentWidth > 0)
      this.output += ' '.repeat(this.indentWidth * this.depth);
  }

  write(...args) {
    for (let i = 0; i < args.length; ++i) {
      switch (args[i]) {
        case SPACE:
          this.output += ' ';
          break;
        case NEWLINE:
          this.newline();
          break;
        case INDENT:
          this.depth += 1;
          this.newline();
          break;
        case OUTDENT:
          this.depth -= 1;
          this.newline();
          break;
        default:
          if (typeof args[i] === 'string') this.output += args[i];
          else this.printNode(args[i]);
          break;
      }
    }
  }

  print(ast) {
    this.output = '';
    this.printNode(ast);
    return this.output;
  }

  printNode(node) {
    if (node !== null && node !== undefined)
      this[node.type](node);
  }

  printList(list, sep = ', ') {
    list.forEach((n, i) => {
      this.printNode(n);
      if (i < list.length - 1) this.write(sep);
    });
  }

  Identifier(node) {
    // TODO: escaping
    this.write(node.value);
  }

  NumberLiteral(node) {
    this.write(String(node.value), node.suffix);
  }

  StringLiteral(node) {
    // TODO: escape string
    this.write(
      this.stringDelimiter,
      node.value,
      this.stringDelimiter
    );
  }

  TemplatePart(node) {
    this.write(node.raw);
  }

  RegularExpression(node) {
    this.write('/', node.value, '/', node.flags);
  }

  BooleanLiteral(node) {
    this.write(node.value ? 'true' : 'false');
  }

  NullLiteral() {
    this.write('null');
  }

  Script(node) {
    this.printList(node.statements, NEWLINE);
  }

  Module(node) {
    this.printList(node.statements, NEWLINE);
  }

  ThisExpression() {
    this.write('this');
  }

  SuperKeyword() {
    this.write('super');
  }

  SequenceExpression(node) {
    this.printList(node.expressions);
  }

  AssignmentExpression(node) {
    this.write(
      node.left,
      SPACE,
      node.operator,
      SPACE,
      node.right
    );
  }

  SpreadExpression(node) {
    this.write('...', node.expression);
  }

  YieldExpression(node) {
    this.write('yield');
    if (node.delegate) this.write(SPACE, '*');
    this.write(SPACE, node.expresion);
  }

  ConditionalExpression(node) {
    this.write(
      node.test, SPACE,
      '?', node.consequent, SPACE,
      ':', node.alternate
    );
  }

  BinaryExpression(node) {
    this.write(node.left, SPACE, node.right);
  }

  UpdateExpression(node) {
    if (node.prefix) this.write(node.operator, node.expression);
    else this.write(node.expression, node.operator);
  }

  UnaryExpression(node) {
    // TODO: no space if operator char
    this.write(node.operator, ' ', node.expression);
  }

  MemberExpression(node) {
    this.write(node.object);
    if (node.computed) this.write('[', node.property, ']');
    else this.write('.', node.property);
  }

  MetaProperty(node) {
    this.write(node.left, '.', node.right);
  }

  CallExpression(node) {
    this.write(node.callee, '(');
    this.printList(node.arguments);
    this.write(')');
  }

  TemplateExpression(node) {
    this.write('`');
    node.parts.forEach(part => {
      part.type === 'TemplatePart' ?
        this.write(part) :
        this.write('${', part, '}');
    });
    this.write('`');
  }

  TaggedTemplateExpression(node) {
    this.write(node.tag, node.template);
  }

  NewExpression(node) {
    this.write('new ', node.callee, '(');
    this.printList(node.arguments);
    this.write(')');
  }

  ParenExpression(node) {
    this.write('(', node.expression, ')');
  }

  ObjectLiteral(node) {
    this.write('{', INDENT);
    this.printList(node.properties, NEWLINE);
    this.write(OUTDENT, '}');
  }

  ComputedPropertyName(node) {
    this.write('[', node.expression, ']');
  }

  PropertyDefinition(node) {
    this.write(node.name, ':', SPACE, node.expression);
  }

  ObjectPattern(node) {
    this.write('{', INDENT);
    this.printList(node.properties, NEWLINE);
    this.write(OUTDENT, '}');
  }

  PatternProperty(node) {
    this.write(node.name);
    if (node.pattern) this.write(':', SPACE, node.pattern);
    if (node.initializer) this.write(SPACE, '=', SPACE, node.initializer);
  }

  ArrayPattern(node) {
    this.write('[');
    this.printList(node.elements);
    this.write(']');
  }

  PatternElement(node) {
    this.write(node.pattern);
    if (node.initializer) this.write(SPACE, '=', SPACE, node.initializer);
  }

  PatternRestElement(node) {
    this.write('...', node.pattern);
  }

  MethodDefinition(node) {
    if (node.static) this.write('static ');

    switch (node.kind) {
      case 'generator': this.write('*'); break;
      case 'async': this.write('async '); break;
      case 'async-generator': this.write('async *'); break;
    }

    this.write(node.name, '(');
    this.printList(node.params);
    this.write(')', SPACE, '{', INDENT, node.body, OUTDENT, '}');
  }

  ArrayLiteral(node) {
    this.write('[');
    this.printList(node.elements);
    this.write(']');
  }

  Block(node) {
    this.write('{', INDENT);
    this.printList(node.statements, NEWLINE);
    this.write(OUTDENT, '}');
  }

  LabelledStatement(node) {
    this.write(node.label, ':', SPACE, node.statement);
  }

  ExpressionStatement(node) {
    this.write(node.expression, ';');
  }

  Directive(node) {
    this.write(node.expression, ';');
  }

  EmptyStatement() {
    this.write(';');
  }

  VariableDeclaration(node) {
    this.write(node.kind, ' ');
    this.printList(node.declarations);
    this.write(';');
  }

  VariableDeclarator(node) {
    this.write(node.pattern);
    if (node.initializer)
      this.write(SPACE, '=', SPACE, node.initializer);
  }

  ReturnStatement(node) {
    this.write('return ', node.argument, ';');
  }

  BreakStatement(node) {
    this.write('break');
    if (node.label) this.write(' ', node.label);
    this.write(';');
  }

  ContinueStatement(node) {
    this.write('continue');
    if (node.label) this.write(' ', node.label);
    this.write(';');
  }

  ThrowStatement(node) {
    this.write('throw ', node.expression, ';');
  }

  DebuggerStatement() {
    this.write('debugger;');
  }

  IfStatement(node) {
    this.write('if', SPACE, '(', node.test, ')', SPACE, node.consequent);
    if (node.alternate) this.write('else ', node.alternate);
  }

  DoWhileStatement(node) {
    this.write('do ', node.body, ' while (', node.test, ')');
  }

  WhileStatement(node) {
    this.write('while', SPACE, '(', node.test, ')', node.body);
  }

  ForStatement(node) {
    this.write(
      'for', SPACE, '(',
      node.initializer, ';', SPACE,
      node.test, ';', SPACE,
      node.update,
      ')', SPACE, node.body
    );
  }

  ForInStatement(node) {
    this.write(
      'for', SPACE,
      '(', node.left, ' in ', node.right, ')', SPACE,
      node.body
    );
  }

  ForOfStatement(node) {
    this.write(
      'for', SPACE,
      '(', node.left, ' of ', node.right, ')', SPACE,
      node.body
    );
  }

  WithStatement(node) {
    this.write(
      'with', SPACE, '(', node.object, ')', SPACE, node.body
    );
  }

  SwitchStatement(node) {
    this.write(
      'switch', SPACE,
      '(', node.descriminant, ')', SPACE,
      '{', INDENT
    );
    this.printList(node.cases, NEWLINE);
    this.write(OUTDENT, '}');
  }

  SwitchCase(node) {
    this.write('case ', node.test, ':', SPACE, node.consequent);
  }

  TryStatement(node) {
    this.write(
      'try', SPACE, node.block, SPACE, node.handler, SPACE,
      'finally', SPACE, node.finalizer
    );
  }

  CatchClause(node) {
    this.write(
      ' catch', SPACE, '(', node.param, ')', SPACE, node.body
    );
  }

  FunctionDeclaration(node) {
    this.FunctionExpression(node);
  }

  FunctionExpression(node) {
    if (node.kind === 'async' || node.kind === 'async-generator')
      this.write('async ');

    this.write('function');

    if (node.kind === 'generator' || node.kind === 'async-generator')
      this.write('*');

    if (node.identifier)
      this.write(' ', node.identifier);

    this.write('(');
    this.printList(node.params);
    this.write(')', SPACE, node.body);
  }

  FormalParameter(node) {
    this.write(node.pattern);
    if (node.initializer)
      this.write(SPACE, '=', SPACE, node.initializer);
  }

  RestParameter(node) {
    this.write('...', node.identifier);
  }

  FunctionBody(node) {
    this.write('{', INDENT);
    this.printList(node.statements, NEWLINE);
    this.write(OUTDENT, '}');
  }

  ArrowFunction(node) {
    if (node.kind === 'async')
      this.write('async ');

    this.write('(');
    this.printList(node.params);
    this.write(')', SPACE, '=>', SPACE, node.body);
  }

  ClassDeclaration(node) {
    this.ClassExpression(node);
  }

  ClassExpression(node) {
    this.write('class');
    if (node.identifier) this.write(' ', node.identifier);
    if (node.base) this.write(' extends ', node.base);
    this.write(SPACE, node.body);
  }

  ClassBody(node) {
    this.write('{', INDENT);
    this.printList(node.elements, NEWLINE);
    this.write(OUTDENT, '}');
  }

  EmptyClassElement() {
    this.write(';');
  }

  ClassField(node) {
    if (node.static) this.write('static ');
    this.write(node.name);
    if (node.initializer) this.write(SPACE, '=', SPACE, node.initializer);
    this.write(';');
  }

  ImportCall(node) {
    this.write('import', SPACE, '(', node.argument, ')');
  }

  ImportDeclaration(node) {
    this.write('import ');
    if (node.imports) this.write(node.imports, ' from ');
    this.write(node.from, ';');
  }

  NamespaceImport(node) {
    this.write('* as ', node.identifier);
  }

  NamedImports(node) {
    this.write('{', SPACE);
    this.printList(node.specifiers);
    this.write(SPACE, '}');
  }

  DefaultImport(node) {
    this.write(node.identifier);
    if (node.imports) this.write(',', SPACE, node.imports);
  }

  ImportSpecifier(node) {
    this.write(node.imported);
    if (node.local) this.write(' as ', node.local);
  }

  ExportDeclaration(node) {
    this.write('export ', node.declaration);
  }

  ExportDefault(node) {
    this.write('export default ', node.binding);
  }

  ExportNameList(node) {
    this.write('export', SPACE, '{', SPACE);
    this.printList(node.specifiers);
    this.write(SPACE, '}');
    if (node.from) this.write(SPACE, 'from', SPACE, node.from);
  }

  ExportNamespace(node) {
    this.write('export * as ', node.identifier, ' from ', node.from);
  }

  ExportDefaultFrom(node) {
    this.write('export ', node.identifier, ' from ', node.from);
  }

  ExportSpecifier(node) {
    this.write(node.local);
    if (node.exported) this.write(' as ', node.exported);
  }

}
