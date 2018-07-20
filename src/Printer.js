import { LineMap } from './LineMap.js';

const SPACE = {};
const NEWLINE = {};
const INDENT = {};
const OUTDENT = {};

class PrintResult {
  constructor(output, lineMap, mappings) {
    this.output = output;
    this.lineMap = lineMap;
    this.mappings = mappings;
  }
}

export class Printer {
  constructor() {
    this.indentWidth = 2;
    this.depth = 0;
    this.stringDelimiter = "'";
    this.output = '';
    this.inputLineMap = null;
    this.inputStart = 0;
    this.mappings = [];
    this.currentLine = 1;
    this.currentLineOffset = 0;
    this.lineMap = new LineMap();
  }

  addMapping(node) {
    if (typeof node.start === 'number' && node.start > this.inputStart) {
      this.inputStart = node.start;

      let original = this.inputLineMap.locate(this.inputStart);

      let generated = {
        line: this.currentLine,
        column: this.output.length - this.currentLineOffset,
        offset: this.output.length,
        lineOffset: this.currentLineOffset,
      };

      this.mappings.push({ original, generated });
    }
  }

  newline() {
    this.output += '\n';
    this.currentLine += 1;
    this.currentLineOffset = this.output.length;

    if (this.indentWidth > 0)
      this.output += ' '.repeat(this.indentWidth * this.depth);
  }

  print(ast, options = {}) {
    this.output = '';
    this.inputLineMap = options.lineMap || new LineMap();
    this.printNode(ast);
    return new PrintResult(this.output, this.lineMap, this.mappings);
  }

  printNode(node) {
    if (node !== null && node !== undefined) {
      this.addMapping(node);
      this[node.type](node);
    }
  }

  escapeString(value) {
    // TODO
    // See: https://github.com/mathiasbynens/jsesc/blob/master/src/jsesc.js
    return value.replace(/['"\\\b\f\n\r\t]/g, c => {
      switch (c) {
        case '"':
        case '\'': return c === this.stringDelimiter ? '\\' + c : c;
        case '\\': return '\\\\';
        case '\b': return '\\b';
        case '\f': return '\\f';
        case '\n': return '\\n';
        case '\r': return '\\r';
        case '\t': return '\\t';
      }
    });
  }

  write(...args) {
    for (let i = 0; i < args.length; ++i) {
      switch (args[i]) {
        case SPACE:
          this.output += ' ';
          this.outputColumn += 1;
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

  writeList(list, ...sep) {
    if (sep.length === 0) sep = [',', SPACE];
    list.forEach((n, i) => {
      this.printNode(n);
      if (n && n.type === 'VariableDeclaration') this.write(';');
      if (i < list.length - 1) this.write(...sep);
    });
  }

  Identifier(node) {
    // TODO: escaping
    this.write(node.value);
  }

  NumberLiteral(node) {
    // TODO: Other numeric types? BigInt?
    this.write(String(node.value), node.suffix);
  }

  StringLiteral(node) {
    // TODO: consider using raw if possible to avoid escaping
    this.write(
      this.stringDelimiter,
      this.escapeString(node.value),
      this.stringDelimiter
    );
  }

  TemplatePart(node) {
    // TODO: should we use value if "raw" is not provided?
    this.write(node.raw);
  }

  RegularExpression(node) {
    // TODO: Handle non-escaped forward slashes
    this.write('/', node.value, '/', node.flags);
  }

  BooleanLiteral(node) {
    this.write(node.value ? 'true' : 'false');
  }

  NullLiteral() {
    this.write('null');
  }

  Script(node) {
    this.writeList(node.statements, NEWLINE);
  }

  Module(node) {
    this.writeList(node.statements, NEWLINE);
  }

  ThisExpression() {
    this.write('this');
  }

  SuperKeyword() {
    this.write('super');
  }

  SequenceExpression(node) {
    this.writeList(node.expressions);
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
      '?', SPACE, node.consequent, SPACE,
      ':', SPACE, node.alternate
    );
  }

  BinaryExpression(node) {
    // TODO: enforce space if node.right is RegularExpression
    this.write(node.left, SPACE, node.operator, SPACE, node.right);
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
    this.writeList(node.arguments);
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
    this.writeList(node.arguments);
    this.write(')');
  }

  ParenExpression(node) {
    this.write('(', node.expression, ')');
  }

  ObjectLiteral(node) {
    this.write('{', INDENT);
    this.writeList(node.properties, ',', NEWLINE);
    this.write(OUTDENT, '}');
  }

  ComputedPropertyName(node) {
    this.write('[', node.expression, ']');
  }

  PropertyDefinition(node) {
    this.write(node.name);
    if (node.expression) {
      this.write(':', SPACE, node.expression);
    }
  }

  ObjectPattern(node) {
    this.write('{', INDENT);
    this.writeList(node.properties, ',', NEWLINE);
    this.write(OUTDENT, '}');
  }

  PatternProperty(node) {
    this.write(node.name);
    if (node.pattern) this.write(':', SPACE, node.pattern);
    if (node.initializer) this.write(SPACE, '=', SPACE, node.initializer);
  }

  ArrayPattern(node) {
    this.write('[');
    this.writeList(node.elements);
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
      case 'get': this.write('get '); break;
      case 'set': this.write('set '); break;
    }

    this.write(node.name, '(');
    this.writeList(node.params);
    this.write(')', SPACE, node.body);
  }

  ArrayLiteral(node) {
    this.write('[');
    this.writeList(node.elements);
    this.write(']');
  }

  Block(node) {
    this.write('{', INDENT);
    this.writeList(node.statements, NEWLINE);
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
    this.writeList(node.declarations);
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
    if (node.alternate) this.write(' else ', node.alternate);
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
    this.writeList(node.cases, '');
    this.write(OUTDENT, '}');
  }

  SwitchCase(node) {
    if (node.test) this.write('case ', node.test, ':', INDENT);
    else this.write('default:', INDENT);
    this.writeList(node.consequent, NEWLINE);
    this.write(OUTDENT);
  }

  TryStatement(node) {
    this.write('try', SPACE, node.block);
    if (node.handler) this.write(SPACE, node.handler);
    if (node.finalizer) this.write(SPACE, 'finally', SPACE, node.finalizer);
  }

  CatchClause(node) {
    this.write('catch', SPACE, '(', node.param, ')', SPACE, node.body);
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
    this.writeList(node.params);
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
    this.writeList(node.statements, NEWLINE);
    this.write(OUTDENT, '}');
  }

  ArrowFunction(node) {
    if (node.kind === 'async')
      this.write('async ');

    this.write('(');
    this.writeList(node.params);
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
    this.writeList(node.elements, NEWLINE);
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
    this.writeList(node.specifiers);
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
    this.writeList(node.specifiers);
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
