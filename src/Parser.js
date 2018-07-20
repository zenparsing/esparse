import * as AST from './AST.js';
import { Scanner } from './Scanner.js';
import { Transform } from './Transform.js';
import { Validate } from './Validate.js';

// Returns true if the specified operator is an increment operator
function isIncrement(op) {
  return op === '++' || op === '--';
}

// Returns a binary operator precedence level
function getPrecedence(op) {
  switch (op) {
    case '||':
      return 1;
    case '&&':
      return 2;
    case '|':
      return 3;
    case '^':
      return 4;
    case '&':
      return 5;
    case '==':
    case '!=':
    case '===':
    case '!==':
      return 6;
    case '<=':
    case '>=':
    case '>':
    case '<':
    case 'instanceof':
    case 'in':
      return 7;
    case '>>>':
    case '>>':
    case '<<':
      return 8;
    case '+':
    case '-':
      return 9;
    case '*':
    case '/':
    case '%':
      return 10;
    case '**':
      return 11;
  }

  return 0;
}

// Returns true if the specified operator is an assignment operator
function isAssignment(op) {
  if (op === '=')
    return true;

  switch (op) {
    case '*=':
    case '**=':
    case '&=':
    case '^=':
    case '|=':
    case '<<=':
    case '>>=':
    case '>>>=':
    case '%=':
    case '+=':
    case '-=':
    case '/=':
      return true;
  }

  return false;
}

// Returns true if the specified operator is a unary operator
function isUnary(op) {
  switch (op) {
    case 'await':
    case 'delete':
    case 'void':
    case 'typeof':
    case '!':
    case '~':
    case '+':
    case '-':
      return true;
  }

  return false;
}

// Returns true if the supplied meta property pair is valid
function isValidMeta(left, right) {
  switch (left) {
    case 'new':
      return right === 'target';
    case 'import':
      return right === 'meta';
  }

  return false;
}

// Returns true if the value is a known directive
function isDirective(value) {
  return value === 'use strict';
}

// Returns the value of the specified token, if it is an identifier and does not
// contain any unicode escapes
function keywordFromToken(token) {
  if (token.type === 'IDENTIFIER' && token.end - token.start === token.value.length)
    return token.value;

  return '';
}

// Returns the value of the specified node, if it is an Identifier and does not
// contain any unicode escapes
function keywordFromNode(node) {
  if (node.type === 'Identifier' && node.end - node.start === node.value.length)
    return node.value;

  return '';
}

// Copies token data
function copyToken(from, to) {
  to.type = from.type;
  to.value = from.value;
  to.number = from.number;
  to.numberSuffix = from.numberSuffix;
  to.regexFlags = from.regexFlags;
  to.templateEnd = from.templateEnd;
  to.newlineBefore = from.newlineBefore;
  to.strictError = from.strictError;
  to.start = from.start;
  to.end = from.end;

  return to;
}

class Context {

  constructor(parent) {
    this.parent = parent;
    this.strict = parent && parent.strict || false;
    this.allowUseStrict = true;
    this.isFunction = false;
    this.functionBody = false;
    this.isGenerator = false;
    this.isAsync = false;
    this.isMethod = false;
    this.allowSuperCall = false;
    this.hasYieldAwait = false;
    this.labelMap = null;
    this.switchDepth = 0;
    this.loopDepth = 0;
    this.invalidNodes = [];
  }

}

class ParseResult {

  constructor(results) {
    this.input = results.input;
    this.lineMap = results.lineMap;
    this.ast = results.ast;
    this.annotations = results.annotations;
    this.comments = results.comments;
    this.scopeTree = null;
  }

  locate(offset) {
    return this.lineMap.locate(offset);
  }

  createSyntaxError(message, node) {
    let loc = this.lineMap.locate(node.start);
    let err = new SyntaxError(message);

    err.line = loc.line;
    err.column = loc.column;
    err.lineOffset = loc.lineOffset;
    err.startOffset = node.start;
    err.endOffset = node.end;
    err.sourceText = this.input;

    return err;
  }

}

export class Parser {

  constructor(input, options) {
    options = options || {};

    let scanner = new Scanner(input, options.offset);

    this.onASI = options.onASI || null;
    this.scanner = scanner;
    this.input = input;
    this.peek0 = null;
    this.peek1 = null;
    this.tokenStash = new Scanner();
    this.tokenEnd = scanner.offset;
    this.context = new Context(null);
    this.annotations = [];
    this.comments = [];
  }

  createParseResult(ast) {
    return new ParseResult({
      ast,
      input: this.input,
      lineMap: this.scanner.lineMap,
      annotations: this.annotations,
      comments: this.comments,
    });
  }

  parseModule() {
    return this.createParseResult(this.Module());
  }

  parseScript() {
    return this.createParseResult(this.Script());
  }

  parseAnnotation(context) {
    if (this.peek(context) === '@') {
      this.annotations.push(this.Annotation());
      return true;
    }
    return false;
  }

  nextToken(context) {
    context = context || '';

    let scanner = this.scanner;

    while (true) {
      let type = scanner.next(context);
      if (type === 'COMMENT') this.addComment(scanner);
      else break;
    }

    return scanner;
  }

  nodeStart() {
    if (this.peek0)
      return this.peek0.start;

    // Skip over whitespace and comments
    while (true) {
      let type = this.scanner.skip();
      if (type === 'COMMENT') this.addComment(this.scanner);
      else break;
    }

    return this.scanner.offset;
  }

  addComment(token) {
    let node = new AST.Comment(token.value, token.start, token.end);
    this.comments.push(node);
  }

  nodeEnd() {
    return this.tokenEnd;
  }

  readToken(type, context) {
    let token = this.peek0 || this.nextToken(context);

    this.peek0 = this.peek1;
    this.peek1 = null;
    this.tokenEnd = token.end;

    if (type && token.type !== type)
      this.unexpected(token);

    return token;
  }

  read(type, context) {
    return this.readToken(type, context).type;
  }

  peekToken(context) {
    if (!this.peek0)
      this.peek0 = this.nextToken(context);

    return this.peek0;
  }

  peek(context) {
    return this.peekToken(context).type;
  }

  peekTokenAt(context, index) {
    if (index !== 1 || this.peek0 === null)
      throw new Error('Invalid lookahead');

    if (this.peek1 === null) {
      this.peek0 = copyToken(this.peek0, this.tokenStash);
      this.peek1 = this.nextToken(context);
    }

    return this.peek1;
  }

  peekAt(context, index) {
    return this.peekTokenAt(context, index).type;
  }

  unpeek() {
    if (this.peek0) {
      this.scanner.offset = this.peek0.start;
      this.peek0 = null;
      this.peek1 = null;
    }
  }

  peekUntil(type, context) {
    let tok = this.peek(context);
    return tok !== 'EOF' && tok !== type ? tok : null;
  }

  readKeyword(word) {
    let token = this.readToken();

    if (token.type === word || keywordFromToken(token) === word)
      return token;

    this.unexpected(token);
  }

  peekKeyword(word) {
    let token = this.peekToken();
    return token.type === word || keywordFromToken(token) === word;
  }

  peekLet() {
    if (this.peekKeyword('let')) {
      switch (this.peekAt('div', 1)) {
        case '{':
        case '[':
        case 'IDENTIFIER':
          return true;
      }
    }

    return false;
  }

  peekTrivialExpression() {
    switch (this.peek()) {
      case 'null':
      case 'false':
      case 'true':
      case 'this':
      case 'NUMBER':
      case 'IDENTIFIER':
      case 'STRING':
        switch (this.peekAt('div', 1)) {
          case ',':
          case ';':
          case '}':
          case ']':
            return true;
        }
    }

    return false;
  }

  peekYield() {
    return this.context.functionBody &&
      this.context.isGenerator &&
      this.peekKeyword('yield');
  }

  peekAwait() {
    if (this.peekKeyword('await')) {
      if (this.context.functionBody && this.context.isAsync)
        return true;

      if (this.isModule)
        this.fail('Await is reserved within modules');
    }

    return false;
  }

  peekAsync() {
    let token = this.peekToken();

    if (keywordFromToken(token) !== 'async')
      return '';

    token = this.peekTokenAt('div', 1);

    if (token.newlineBefore)
      return '';

    let type = token.type;

    return type === 'function' ? type : '';
  }

  peekExpressionEnd() {
    let token = this.peekToken();

    if (!token.newlineBefore) {
      switch (token.type) {
        case 'EOF':
        case '}':
        case ';':
          break;

        // yield-specific
        case ']':
        case ')':
        case 'in':
        case ',':
          break;

        default:
          return false;
      }
    }

    return true;
  }

  unexpected(token) {
    let type = token.type;
    let msg;

    msg = type === 'EOF' ?
      'Unexpected end of input' :
      'Unexpected token ' + token.type;

    this.fail(msg, token);
  }

  fail(msg, node) {
    if (!node)
      node = this.peekToken();

    let result = this.createParseResult(null);
    throw result.createSyntaxError(msg, node);
  }

  unwrapParens(node) {
    // Remove any parenthesis surrounding the target
    for (; node.type === 'ParenExpression'; node = node.expression) ;
    return node;
  }


  // == Context Management ==

  pushContext(lexical) {
    let parent = this.context;
    let c = new Context(parent);

    this.context = c;

    if (lexical) {
      c.isMethod = parent.isMethod;
      c.allowSuperCall = parent.allowSuperCall;
    }

    return c;
  }

  pushMaybeContext() {
    let parent = this.context;
    let c = this.pushContext();

    c.isFunction = parent.isFunction;
    c.isGenerator = parent.isGenerator;
    c.isAsync = parent.isAsync;
    c.isMethod = parent.isMethod;
    c.allowSuperCall = parent.allowSuperCall;
    c.functionBody = parent.functionBody;
  }

  popContext(collapse) {
    let context = this.context;
    let parent = context.parent;

    // If collapsing into parent context, copy invalid nodes into parent
    if (collapse)
      context.invalidNodes.forEach(node => parent.invalidNodes.push(node));
    else
      this.checkInvalidNodes();

    this.context = this.context.parent;
  }

  setStrict(strict) {
    this.context.strict = strict;
  }

  addStrictError(error, node) {
    this.addInvalidNode(error, node, true);
  }

  addInvalidNode(error, node, strict) {
    node.error = error;
    this.context.invalidNodes.push({
      node,
      strict: Boolean(strict),
    });
  }

  setLabel(label, value) {
    let m = this.context.labelMap;

    if (!m)
      m = this.context.labelMap = Object.create(null);

    m[label] = value;
  }

  getLabel(label) {
    let m = this.context.labelMap;
    return (m && m[label]) | 0;
  }

  setFunctionType(kind) {
    let c = this.context;
    let a = false;
    let g = false;

    switch (kind) {
      case 'async':
        a = true;
        break;
      case 'generator':
        g = true;
        break;
      case 'async-generator':
        a = g = true;
        break;
    }

    c.isFunction = true;
    c.isAsync = a;
    c.isGenerator = g;
  }

  // === Top Level ===

  Script() {
    this.isModule = false;
    this.pushContext();

    let start = this.nodeStart();
    let statements = this.StatementList(true);

    this.popContext();

    return new AST.Script(statements, start, this.nodeEnd());
  }

  Module() {
    this.isModule = true;
    this.pushContext();
    this.setStrict(true);

    let start = this.nodeStart();
    let list = this.ModuleItemList();

    this.popContext();

    return new AST.Module(list, start, this.nodeEnd());
  }

  // === Expressions ===

  Expression(noIn) {
    let expr = this.AssignmentExpression(noIn);
    let list = null;

    while (this.peek('div') === ',') {
      this.read();

      if (list === null)
        expr = new AST.SequenceExpression(list = [expr], expr.start, -1);

      if (this.peek() === ')') {
        this.addInvalidNode('Invalid trailing comma in sequence expression', expr);
        break;
      }

      list.push(this.AssignmentExpression(noIn));
    }

    if (list)
      expr.end = this.nodeEnd();

    return expr;
  }

  AssignmentExpression(noIn, allowSpread) {
    let start = this.nodeStart();
    let node;

    if (this.peek() === '...') {
      this.read();

      node = new AST.SpreadExpression(
        this.AssignmentExpression(noIn),
        start,
        this.nodeEnd());

      if (!allowSpread)
        this.addInvalidNode('Invalid spread expression', node);

      return node;
    }

    if (this.peekYield())
      return this.YieldExpression(noIn);

    node = this.ConditionalExpression(noIn);

    if (node.type === 'ArrowFunctionHead')
      return this.ArrowFunctionBody(node, noIn);

    // Check for assignment operator
    if (!isAssignment(this.peek('div')))
      return node;

    this.checkAssignmentTarget(node, false);

    return new AST.AssignmentExpression(
      this.read(),
      node,
      this.AssignmentExpression(noIn),
      start,
      this.nodeEnd());
  }

  YieldExpression(noIn) {
    let start = this.nodeStart();
    let delegate = false;
    let expr = null;

    this.readKeyword('yield');

    if (!this.peekExpressionEnd()) {
      if (this.peek() === '*') {
        this.read();
        delegate = true;
      }

      expr = this.AssignmentExpression(noIn);
    }

    this.context.hasYieldAwait = true;

    return new AST.YieldExpression(
      expr,
      delegate,
      start,
      this.nodeEnd());
  }

  ConditionalExpression(noIn) {
    // Bypass the expression grammar if this is a single token expression
    if (this.peekTrivialExpression())
      return this.PrimaryExpression();

    let start = this.nodeStart();
    let left = this.BinaryExpression(noIn);
    let middle;
    let right;

    if (this.peek('div') !== '?')
      return left;

    this.read('?');
    middle = this.AssignmentExpression();
    this.read(':');
    right = this.AssignmentExpression(noIn);

    return new AST.ConditionalExpression(left, middle, right, start, this.nodeEnd());
  }

  BinaryExpression(noIn) {
    return this.PartialBinaryExpression(this.UnaryExpression(), 0, noIn);
  }

  PartialBinaryExpression(lhs, minPrec, noIn) {
    let prec = 0;
    let next = '';
    let max = 0;
    let op = '';
    let rhs;

    while (next = this.peek('div')) {
      // Exit if operator is 'in' and in is not allowed
      if (next === 'in' && noIn)
        break;

      // Unary expression not allowed on LHS of exponetiation operator
      if (next === '**' && lhs.type === 'UnaryExpression')
        this.fail();

      prec = getPrecedence(next);

      // Exit if not a binary operator or lower precendence
      if (prec === 0 || prec < minPrec)
        break;

      this.read();

      op = next;
      max = prec;
      rhs = this.UnaryExpression();

      while (next = this.peek('div')) {
        prec = getPrecedence(next);

        // Exit if not a binary operator or equal or higher precendence
        if (prec === 0 || prec <= max)
          break;

        rhs = this.PartialBinaryExpression(rhs, prec, noIn);
      }

      lhs = new AST.BinaryExpression(op, lhs, rhs, lhs.start, rhs.end);
    }

    return lhs;
  }

  UnaryExpression() {
    let start = this.nodeStart();
    let type = this.peek();
    let token;
    let expr;

    if (isIncrement(type)) {
      this.read();
      expr = this.MemberExpression(true);
      this.checkAssignmentTarget(this.unwrapParens(expr), true);

      return new AST.UpdateExpression(type, expr, true, start, this.nodeEnd());
    }

    if (this.peekAwait()) {
      type = 'await';
      this.context.hasYieldAwait = true;
    }

    if (isUnary(type)) {
      this.read();
      expr = this.UnaryExpression();

      if (type === 'delete')
        this.checkDelete(expr);

      return new AST.UnaryExpression(type, expr, start, this.nodeEnd());
    }

    expr = this.MemberExpression(true);
    token = this.peekToken('div');
    type = token.type;

    // Check for postfix operator
    if (isIncrement(type) && !token.newlineBefore) {
      this.read();
      this.checkAssignmentTarget(this.unwrapParens(expr), true);

      return new AST.UpdateExpression(type, expr, false, start, this.nodeEnd());
    }

    return expr;
  }

  MemberExpression(allowCall) {
    let token = this.peekToken();
    let start = token.start;
    let isSuper = false;
    let exit = false;
    let expr;

    switch (token.type) {
      case 'super':
        expr = this.SuperKeyword();
        isSuper = true;
        break;
      case 'new':
        expr = this.peekAt('', 1) === '.' ? this.MetaProperty() : this.NewExpression();
        break;
      case 'import':
        expr = this.peekAt('', 1) === '.' ? this.MetaProperty() : this.ImportCall();
        break;
      default:
        expr = this.PrimaryExpression();
        break;
    }

    while (!exit) {
      token = this.peekToken('div');
      switch (token.type) {
        case '.': {
          this.read();
          let prop = this.IdentifierName();
          expr = new AST.MemberExpression(
            expr,
            prop,
            false,
            start,
            this.nodeEnd());
          break;
        }

        case '[': {
          this.read();
          let prop = this.Expression();
          this.read(']');
          expr = new AST.MemberExpression(
            expr,
            prop,
            true,
            start,
            this.nodeEnd());
          break;
        }

        case '(': {
          if (!allowCall) {
            exit = true;
            break;
          }

          if (isSuper && !this.context.allowSuperCall)
            this.fail('Invalid super call');

          let arrowType = '';

          if (keywordFromNode(expr) === 'async' && !token.newlineBefore) {
            arrowType = 'async';
            this.pushMaybeContext();
          }

          this.read('(');

          let args = this.ArgumentList();
          let trailingComma = false;

          if (this.peek() === ',') {
            this.read();
            trailingComma = true;
          }

          this.read(')');

          expr = new AST.CallExpression(expr, args, trailingComma, start, this.nodeEnd());

          if (arrowType) {
            token = this.peekToken('div');
            if (token.type === '=>' && !token.newlineBefore) {
              expr = this.ArrowFunctionHead(arrowType, expr, start);
              exit = true;
            } else {
              this.popContext(true);
            }
          }
          break;
        }

        case 'TEMPLATE':
          if (isSuper)
            this.fail();

          expr = new AST.TaggedTemplateExpression(
            expr,
            this.TemplateExpression(),
            start,
            this.nodeEnd());

          break;

        default:
          if (isSuper)
            this.fail();

          exit = true;
          break;
      }

      isSuper = false;
    }

    return expr;
  }

  NewExpression() {
    let start = this.nodeStart();

    this.read('new');

    let expr = this.MemberExpression(false);
    let args = null;
    let trailingComma = false;

    if (this.peek('div') === '(') {
      this.read('(');
      args = this.ArgumentList();
      if (this.peek() === ',') {
        this.read();
        trailingComma = true;
      }
      this.read(')');
    }

    if (expr.type === 'SuperKeyword')
      this.fail('Invalid super keyword', expr);

    return new AST.NewExpression(expr, args, trailingComma, start, this.nodeEnd());
  }

  MetaProperty() {
    let token = this.readToken();
    let start = token.start;
    let left = token.type === 'IDENTIFIER' ? token.value : token.type;
    let right;

    if (left === 'import' && !this.isModule)
      this.fail('Invalid meta property', token);

    this.read('.');

    token = this.readToken('IDENTIFIER', 'name');
    right = token.value;

    if (!isValidMeta(left, right))
      this.fail('Invalid meta property', token);

    return new AST.MetaProperty(left, right, start, this.nodeEnd());
  }

  SuperKeyword() {
    let token = this.readToken('super');
    let node = new AST.SuperKeyword(token.start, token.end);

    if (!this.context.isMethod)
      this.fail('Super keyword outside of method', node);

    return node;
  }

  ArgumentList() {
    let list = [];

    while (this.peekUntil(')')) {
      list.push(this.AssignmentExpression(false, true));

      if (this.peek() === ',') {
        if (this.peekAt('', 1) === ')')
          break;

        this.read();
      }
    }

    return list;
  }

  PrimaryExpression() {
    let token = this.peekToken();
    let type = token.type;
    let start = this.nodeStart();
    let next;
    let value;

    switch (type) {
      case 'function':
        return this.FunctionExpression();
      case 'class':
        return this.ClassExpression();
      case 'TEMPLATE':
        return this.TemplateExpression();
      case 'NUMBER':
        return this.NumberLiteral();
      case 'STRING':
        return this.StringLiteral();
      case '{':
        return this.ObjectLiteral();
      case '(':
        return this.ParenExpression();
      case '[':
        return this.ArrayLiteral();

      case 'IDENTIFIER':
        value = keywordFromToken(token);
        next = this.peekTokenAt('div', 1);

        if (!next.newlineBefore) {

          if (next.type === '=>') {

            this.pushContext(true);
            return this.ArrowFunctionHead('', this.BindingIdentifier(), start);

          } else if (next.type === 'function') {

            return this.FunctionExpression();

          } else if (next.type === 'IDENTIFIER' && value === 'async') {

            this.read();
            this.pushContext(true);

            let ident = this.BindingIdentifier();

            next = this.peekToken();

            if (next.type !== '=>' || next.newlineBefore)
              this.fail();

            return this.ArrowFunctionHead(value, ident, start);
          }
        }

        return this.Identifier(true);

      case 'REGEX':
        return this.RegularExpression();

      case 'null':
        this.read();
        return new AST.NullLiteral(token.start, token.end);

      case 'true':
      case 'false':
        this.read();
        return new AST.BooleanLiteral(type === 'true', token.start, token.end);

      case 'this':
        this.read();
        return new AST.ThisExpression(token.start, token.end);
    }

    this.unexpected(token);
  }

  Identifier(isVar) {
    let token = this.readToken('IDENTIFIER');
    let node = new AST.Identifier(token.value, isVar ? 'variable' : '', token.start, token.end);

    this.checkIdentifier(node);
    return node;
  }

  IdentifierName() {
    let token = this.readToken('IDENTIFIER', 'name');
    return new AST.Identifier(token.value, '', token.start, token.end);
  }

  StringLiteral() {
    let token = this.readToken('STRING');
    let node = new AST.StringLiteral(token.value, token.start, token.end);

    if (token.strictError)
      this.addStrictError(token.strictError, node);

    return node;
  }

  NumberLiteral() {
    let token = this.readToken('NUMBER');
    let node = new AST.NumberLiteral(token.number, token.numberSuffix, token.start, token.end);

    if (token.strictError)
      this.addStrictError(token.strictError, node);

    return node;
  }

  TemplatePart() {
    let token = this.readToken('TEMPLATE', 'template');
    let end = token.templateEnd;
    let node;

    node = new AST.TemplatePart(
      token.value,
      this.scanner.rawValue(token.start + 1, token.end - (end ? 1 : 2)),
      end,
      token.start,
      token.end);

    if (token.strictError)
      this.addStrictError(token.strictError, node);

    return node;
  }

  RegularExpression() {
    let token = this.readToken('REGEX');
    return new AST.RegularExpression(
      token.value,
      token.regexFlags,
      token.start,
      token.end);
  }

  BindingIdentifier() {
    let token = this.readToken('IDENTIFIER');
    let node = new AST.Identifier(token.value, '', token.start, token.end);

    this.checkBindingTarget(node);
    return node;
  }

  BindingPattern() {
    let node;

    switch (this.peek()) {
      case '{':
        node = this.ObjectLiteral();
        break;

      case '[':
        node = this.ArrayLiteral();
        break;

      default:
        return this.BindingIdentifier();
    }

    this.checkBindingTarget(node);
    return node;
  }

  ParenExpression() {
    let start = this.nodeStart();
    let next = null;

    // Push a new context in case we are parsing an arrow function
    this.pushMaybeContext();

    this.read('(');

    if (this.peek() === ')') {
      next = this.peekTokenAt('', 1);

      if (next.newlineBefore || next.type !== '=>')
        this.fail();

      this.read(')');

      return this.ArrowFunctionHead('', null, start);
    }

    let expr = this.Expression();

    this.read(')');
    next = this.peekToken('div');

    if (!next.newlineBefore && next.type === '=>')
      return this.ArrowFunctionHead('', expr, start);

    // Collapse this context into its parent
    this.popContext(true);

    return new AST.ParenExpression(expr, start, this.nodeEnd());
  }

  ObjectLiteral() {
    let start = this.nodeStart();
    let comma = false;
    let list = [];
    let node;

    this.read('{');

    while (this.peekUntil('}', 'name')) {
      if (this.parseAnnotation('name')) continue;
      if (!comma && node) {
        this.read(',');
        comma = true;
      } else {
        comma = false;
        list.push(node = this.PropertyDefinition());
      }
    }

    this.read('}');

    return new AST.ObjectLiteral(list, comma, start, this.nodeEnd());
  }

  PropertyDefinition() {
    if (this.peek('name') === '*')
      return this.MethodDefinition(null, '');

    let start = this.nodeStart();
    let node;
    let name;

    if (this.peek('name') === '...') {
      this.read();
      return new AST.SpreadExpression(
        this.AssignmentExpression(),
        start,
        this.nodeEnd());
    }

    switch (this.peekAt('name', 1)) {
      case '=':
        // Re-read token as an identifier
        this.unpeek();

        node = new AST.PatternProperty(
          this.Identifier(true),
          null,
          (this.read(), this.AssignmentExpression()),
          start,
          this.nodeEnd());

        this.addInvalidNode('Invalid property definition in object literal', node);
        return node;

      case ',':
      case '}':
        // Re-read token as an identifier
        this.unpeek();

        return new AST.PropertyDefinition(
          this.Identifier(true),
          null,
          start,
          this.nodeEnd());
    }

    name = this.PropertyName();

    if (this.peek('name') === ':') {
      return new AST.PropertyDefinition(
        name,
        (this.read(), this.AssignmentExpression()),
        start,
        this.nodeEnd());
    }

    return this.MethodDefinition(name, '');
  }

  PropertyName() {
    let token = this.peekToken('name');

    switch (token.type) {
      case 'IDENTIFIER':
        return this.IdentifierName();
      case 'STRING':
        return this.StringLiteral();
      case 'NUMBER':
        return this.NumberLiteral();
      case '[':
        return this.ComputedPropertyName();
    }

    this.unexpected(token);
  }

  ComputedPropertyName() {
    let start = this.nodeStart();

    this.read('[');
    let expr = this.AssignmentExpression();
    this.read(']');

    return new AST.ComputedPropertyName(expr, start, this.nodeEnd());
  }

  ArrayLiteral() {
    let start = this.nodeStart();
    let comma = false;
    let list = [];
    let type;

    this.read('[');

    while (type = this.peekUntil(']')) {
      if (type === ',') {
        this.read();
        comma = true;
        list.push(null);
      } else {
        list.push(this.AssignmentExpression(false, true));
        comma = false;
        if (this.peek() !== ']') {
          this.read(',');
          comma = true;
        }
      }
    }

    this.read(']');

    return new AST.ArrayLiteral(list, comma, start, this.nodeEnd());
  }

  TemplateExpression() {
    let atom = this.TemplatePart();
    let start = atom.start;
    let parts = [atom];

    while (!atom.templateEnd) {
      parts.push(this.Expression());

      // Discard any tokens that have been scanned using a different context
      this.unpeek();

      parts.push(atom = this.TemplatePart());
    }

    return new AST.TemplateExpression(parts, start, this.nodeEnd());
  }

  // === Statements ===

  Statement(label) {
    switch (this.peek()) {
      case 'IDENTIFIER':
        if (this.peekAt('div', 1) === ':')
          return this.LabelledStatement();

        return this.ExpressionStatement();

      case '{':
        return this.Block();
      case ';':
        return this.EmptyStatement();
      case 'var':
        return this.VariableStatement();
      case 'return':
        return this.ReturnStatement();
      case 'break':
        return this.BreakStatement();
      case 'continue':
        return this.ContinueStatement();
      case 'throw':
        return this.ThrowStatement();
      case 'debugger':
        return this.DebuggerStatement();
      case 'if':
        return this.IfStatement();
      case 'do':
        return this.DoWhileStatement(label);
      case 'while':
        return this.WhileStatement(label);
      case 'for':
        return this.ForStatement(label);
      case 'with':
        return this.WithStatement();
      case 'switch':
        return this.SwitchStatement();
      case 'try':
        return this.TryStatement();

      default:
        return this.ExpressionStatement();
    }
  }

  Block() {
    let start = this.nodeStart();

    this.read('{');
    let list = this.StatementList(false);
    this.read('}');

    return new AST.Block(list, start, this.nodeEnd());
  }

  Semicolon() {
    let token = this.peekToken();
    let type = token.type;

    if (type === ';') {

      this.read();

    } else if (type === '}' || type === 'EOF' || token.newlineBefore) {

      if (this.onASI && !this.onASI(token))
        this.unexpected(token);

    } else {

      this.unexpected(token);
    }
  }

  LabelledStatement() {
    let start = this.nodeStart();
    let label = this.Identifier();
    let name = label.value;

    if (this.getLabel(name) > 0)
      this.fail('Invalid label', label);

    this.read(':');

    this.setLabel(name, 1);

    // Annex B allows a function declaration in non-strict mode
    let statement;

    if (this.peek() === 'function') {
      statement = this.FunctionDeclaration();
      this.addStrictError('Labeled FunctionDeclarations are disallowed in strict mode', statement);
    } else {
      statement = this.Statement(name);
    }

    this.setLabel(name, 0);

    return new AST.LabelledStatement(
      label,
      statement,
      start,
      this.nodeEnd());
  }

  ExpressionStatement() {
    let start = this.nodeStart();
    let expr = this.Expression();

    this.Semicolon();

    return new AST.ExpressionStatement(expr, start, this.nodeEnd());
  }

  EmptyStatement() {
    let start = this.nodeStart();
    this.Semicolon();
    return new AST.EmptyStatement(start, this.nodeEnd());
  }

  VariableStatement() {
    let node = this.VariableDeclaration(false);

    this.Semicolon();
    node.end = this.nodeEnd();

    return node;
  }

  VariableDeclaration(noIn) {
    let start = this.nodeStart();
    let token = this.peekToken();
    let kind = token.type;
    let list = [];

    if (kind === 'IDENTIFIER' && token.value === 'let') {
      kind = 'let';
    }

    switch (kind) {
      case 'var':
      case 'const':
      case 'let':
        break;

      default:
        this.fail('Expected var, const, or let');
    }

    this.read();

    while (true) {
      list.push(this.VariableDeclarator(noIn, kind));
      if (this.peek() === ',') this.read();
      else break;
    }

    return new AST.VariableDeclaration(kind, list, start, this.nodeEnd());
  }

  VariableDeclarator(noIn, kind) {
    let start = this.nodeStart();
    let pattern = this.BindingPattern();
    let init = null;

    if ((!noIn && pattern.type !== 'Identifier') || this.peek() === '=') {
      // Patterns must have initializers when not in declaration section
      // of a for statement
      this.read();
      init = this.AssignmentExpression(noIn);
    } else if (!noIn && kind === 'const') {
      this.fail('Missing const initializer', pattern);
    }

    return new AST.VariableDeclarator(pattern, init, start, this.nodeEnd());
  }

  ReturnStatement() {
    if (!this.context.isFunction)
      this.fail('Return statement outside of function');

    let start = this.nodeStart();

    this.read('return');
    let value = this.peekExpressionEnd() ? null : this.Expression();

    this.Semicolon();

    return new AST.ReturnStatement(value, start, this.nodeEnd());
  }

  BreakStatement() {
    let start = this.nodeStart();
    let context = this.context;

    this.read('break');
    let label = this.peekExpressionEnd() ? null : this.Identifier();
    this.Semicolon();

    let node = new AST.BreakStatement(label, start, this.nodeEnd());

    if (label) {
      if (this.getLabel(label.value) === 0)
        this.fail('Invalid label', label);
    } else if (context.loopDepth === 0 && context.switchDepth === 0) {
      this.fail('Break not contained within a switch or loop', node);
    }

    return node;
  }

  ContinueStatement() {
    let start = this.nodeStart();
    let context = this.context;

    this.read('continue');
    let label = this.peekExpressionEnd() ? null : this.Identifier();
    this.Semicolon();

    let node = new AST.ContinueStatement(label, start, this.nodeEnd());

    if (label) {

      if (this.getLabel(label.value) !== 2)
        this.fail('Invalid label', label);

    } else if (context.loopDepth === 0) {

      this.fail('Continue not contained within a loop', node);
    }

    return node;
  }

  ThrowStatement() {
    let start = this.nodeStart();

    this.read('throw');

    let expr = this.peekExpressionEnd() ? null : this.Expression();

    if (expr === null)
      this.fail('Missing throw expression');

    this.Semicolon();

    return new AST.ThrowStatement(expr, start, this.nodeEnd());
  }

  DebuggerStatement() {
    let start = this.nodeStart();

    this.read('debugger');
    this.Semicolon();

    return new AST.DebuggerStatement(start, this.nodeEnd());
  }

  IfStatement() {
    let start = this.nodeStart();

    this.read('if');
    this.read('(');

    let test = this.Expression();
    let body = null;
    let elseBody = null;

    this.read(')');
    body = this.Statement();

    if (this.peek() === 'else') {
      this.read();
      elseBody = this.Statement();
    }

    return new AST.IfStatement(test, body, elseBody, start, this.nodeEnd());
  }

  DoWhileStatement(label) {
    let start = this.nodeStart();
    let body;
    let test;

    if (label)
      this.setLabel(label, 2);

    this.read('do');

    this.context.loopDepth += 1;
    body = this.Statement();
    this.context.loopDepth -= 1;

    this.read('while');
    this.read('(');

    test = this.Expression();

    this.read(')');

    return new AST.DoWhileStatement(body, test, start, this.nodeEnd());
  }

  WhileStatement(label) {
    let start = this.nodeStart();

    if (label)
      this.setLabel(label, 2);

    this.read('while');
    this.read('(');
    let expr = this.Expression();
    this.read(')');

    this.context.loopDepth += 1;
    let statement = this.Statement();
    this.context.loopDepth -= 1;

    return new AST.WhileStatement(
      expr,
      statement,
      start,
      this.nodeEnd());
  }

  ForStatement(label) {
    let start = this.nodeStart();
    let init = null;
    let async = false;
    let test;
    let step;

    if (label)
      this.setLabel(label, 2);

    this.read('for');

    if (this.peekAwait()) {
      this.read();
      async = true;
    }

    this.read('(');

    // Get loop initializer
    switch (this.peek()) {
      case ';':
        break;

      case 'var':
      case 'const':
        init = this.VariableDeclaration(true);
        break;

      case 'IDENTIFIER':
        init = this.peekLet() ? this.VariableDeclaration(true) : this.Expression(true);
        break;

      default:
        init = this.Expression(true);
        break;
    }

    if (async || init && this.peekKeyword('of'))
      return this.ForOfStatement(async, init, start);

    if (init && this.peek() === 'in')
      return this.ForInStatement(init, start);

    this.checkForInit(init, '');

    this.read(';');
    test = this.peek() === ';' ? null : this.Expression();

    this.read(';');
    step = this.peek() === ')' ? null : this.Expression();

    this.read(')');

    this.context.loopDepth += 1;
    let statement = this.Statement();
    this.context.loopDepth -= 1;

    return new AST.ForStatement(
      init,
      test,
      step,
      statement,
      start,
      this.nodeEnd());
  }

  ForInStatement(init, start) {
    this.checkForInit(init, 'in');

    this.read('in');
    let expr = this.Expression();
    this.read(')');

    this.context.loopDepth += 1;
    let statement = this.Statement();
    this.context.loopDepth -= 1;

    return new AST.ForInStatement(
      init,
      expr,
      statement,
      start,
      this.nodeEnd());
  }

  ForOfStatement(async, init, start) {
    this.checkForInit(init, 'of');

    this.readKeyword('of');
    let expr = this.AssignmentExpression();
    this.read(')');

    this.context.loopDepth += 1;
    let statement = this.Statement();
    this.context.loopDepth -= 1;

    return new AST.ForOfStatement(
      async,
      init,
      expr,
      statement,
      start,
      this.nodeEnd());
  }

  WithStatement() {
    let start = this.nodeStart();

    this.read('with');
    this.read('(');

    let node = new AST.WithStatement(
      this.Expression(),
      (this.read(')'), this.Statement()),
      start,
      this.nodeEnd());

    this.addStrictError('With statement is not allowed in strict mode', node);

    return node;
  }

  SwitchStatement() {
    let start = this.nodeStart();

    this.read('switch');
    this.read('(');

    let head = this.Expression();
    let hasDefault = false;
    let cases = [];
    let node;

    this.read(')');
    this.read('{');
    this.context.switchDepth += 1;

    while (this.peekUntil('}')) {
      node = this.SwitchCase();

      if (node.test === null) {
        if (hasDefault)
          this.fail('Switch statement cannot have more than one default', node);

        hasDefault = true;
      }

      cases.push(node);
    }

    this.context.switchDepth -= 1;
    this.read('}');

    return new AST.SwitchStatement(head, cases, start, this.nodeEnd());
  }

  SwitchCase() {
    let start = this.nodeStart();
    let expr = null;
    let list = [];
    let type;

    if (this.peek() === 'default') {
      this.read();
    } else {
      this.read('case');
      expr = this.Expression();
    }

    this.read(':');

    while (type = this.peekUntil('}')) {
      if (type === 'case' || type === 'default')
        break;

      list.push(this.StatementListItem());
    }

    return new AST.SwitchCase(expr, list, start, this.nodeEnd());
  }

  TryStatement() {
    let start = this.nodeStart();

    this.read('try');

    let tryBlock = this.Block();
    let handler = null;
    let fin = null;

    if (this.peek() === 'catch')
      handler = this.CatchClause();

    if (this.peek() === 'finally') {
      this.read('finally');
      fin = this.Block();
    }

    return new AST.TryStatement(tryBlock, handler, fin, start, this.nodeEnd());
  }

  CatchClause() {
    let start = this.nodeStart();
    let param = null;

    this.read('catch');

    if (this.peek() === '(') {
      this.read('(');
      param = this.BindingPattern();
      this.read(')');
    }

    return new AST.CatchClause(param, this.Block(), start, this.nodeEnd());
  }

  // === Declarations ===

  StatementList(prologue) {
    let list = [];
    let node;
    let expr;
    let dir;

    // TODO: is this wrong for braceless statement lists?
    while (this.peekUntil('}')) {
      if (this.parseAnnotation()) continue;

      node = this.StatementListItem();

      // Check for directives
      if (prologue) {
        if (
          node.type === 'ExpressionStatement' &&
          node.expression.type === 'StringLiteral'
        ) {

          // Get the non-escaped literal text of the string
          expr = node.expression;
          dir = this.input.slice(expr.start + 1, expr.end - 1);

          if (isDirective(dir)) {
            node = new AST.Directive(dir, expr, node.start, node.end);

            // Check for strict mode
            if (dir === 'use strict') {
              if (!this.context.allowUseStrict)
                this.fail('Invalid "use strict" directive', node);

              this.setStrict(true);
            }
          }
        } else {
          prologue = false;
        }
      }

      list.push(node);
    }

    return list;
  }

  StatementListItem() {
    switch (this.peek()) {
      case 'function':
        return this.FunctionDeclaration();
      case 'class':
        return this.ClassDeclaration();
      case 'const':
        return this.LexicalDeclaration();

      case 'IDENTIFIER':
        if (this.peekLet())
          return this.LexicalDeclaration();

        if (this.peekAsync() === 'function')
          return this.FunctionDeclaration();

        break;
    }

    return this.Statement();
  }

  LexicalDeclaration() {
    let node = this.VariableDeclaration(false);
    this.Semicolon();
    node.end = this.nodeEnd();
    return node;
  }

  // === Functions ===

  FunctionDeclaration() {
    let start = this.nodeStart();
    let kind = '';
    let token = this.peekToken();

    if (keywordFromToken(token) === 'async') {
      this.read();
      kind = 'async';
    }

    this.read('function');

    if (this.peek() === '*') {
      this.read();
      kind = kind ? kind + '-generator' : 'generator';
    }

    this.pushContext();
    this.setFunctionType(kind);

    let ident = this.BindingIdentifier();
    let params = this.FormalParameters();
    let body = this.FunctionBody();
    this.popContext();

    return new AST.FunctionDeclaration(
      kind,
      ident,
      params,
      body,
      start,
      this.nodeEnd());
  }

  FunctionExpression() {
    let start = this.nodeStart();
    let ident = null;
    let kind = '';
    let token;

    token = this.peekToken();

    if (keywordFromToken(token) === 'async') {
      this.read();
      kind = 'async';
    }

    this.read('function');

    if (this.peek() === '*') {
      this.read();
      kind = kind ? kind + '-generator' : 'generator';
    }

    this.pushContext();
    this.setFunctionType(kind);

    if (this.peek() !== '(')
      ident = this.BindingIdentifier();

    let params = this.FormalParameters();
    let body = this.FunctionBody();
    this.popContext();

    return new AST.FunctionExpression(
      kind,
      ident,
      params,
      body,
      start,
      this.nodeEnd());
  }

  MethodDefinition(name, kind, classKind) {
    let start = name ? name.start : this.nodeStart();

    if (!name && this.peek('name') === '*') {
      this.read();

      kind = 'generator';
      name = this.PropertyName();
    } else {
      if (!name)
        name = this.PropertyName();

      let val = keywordFromNode(name);
      let next = this.peekToken('name');

      switch (next.type) {
        case ';':
        case '}':
        case '=':
          return this.ClassField(name);
      }

      if (next.type !== '(') {
        if (val === 'get' || val === 'set') {
          kind = name.value;
          name = this.PropertyName();
        } else if (val === 'async' && !next.newlineBefore) {
          if (next.type === '*') {
            this.read();
            kind = 'async-generator';
          } else {
            kind = 'async';
          }
          name = this.PropertyName();
        } else if (classKind && next.newlineBefore) {
          return this.ClassField(name);
        }
      }
    }

    this.pushContext();
    this.context.isMethod = true;
    this.setFunctionType(kind);

    if (kind === 'constructor' && classKind === 'derived')
      this.context.allowSuperCall = true;

    let params = kind === 'get' || kind === 'set' ?
      this.AccessorParameters(kind) :
      this.FormalParameters();

    let body = this.FunctionBody();
    this.popContext();

    return new AST.MethodDefinition(
      false,
      kind,
      name,
      params,
      body,
      start,
      this.nodeEnd());
  }

  AccessorParameters(kind) {
    let list = [];

    this.read('(');

    if (kind === 'set')
      list.push(this.FormalParameter(false));

    this.read(')');

    this.checkParameters(list);
    return list;
  }

  FormalParameters() {
    let list = [];

    this.read('(');

    while (this.peekUntil(')')) {
      // Parameter list may have a trailing rest parameter
      if (this.peek() === '...') {
        list.push(this.RestParameter());
        break;
      }

      list.push(this.FormalParameter(true));

      if (this.peek() !== ')')
        this.read(',');
    }

    this.read(')');

    this.checkParameters(list);
    return list;
  }

  FormalParameter(allowDefault) {
    let start = this.nodeStart();
    let pattern = this.BindingPattern();
    let init = null;

    if (allowDefault && this.peek() === '=') {
      this.read();
      init = this.AssignmentExpression();
    }

    return new AST.FormalParameter(pattern, init, start, this.nodeEnd());
  }

  RestParameter() {
    let start = this.nodeStart();
    this.read('...');
    return new AST.RestParameter(this.BindingIdentifier(), start, this.nodeEnd());
  }

  FunctionBody() {
    this.context.functionBody = true;

    let start = this.nodeStart();

    this.read('{');
    let statements = this.StatementList(true);
    this.read('}');

    return new AST.FunctionBody(statements, start, this.nodeEnd());
  }

  ArrowFunctionHead(kind, params, start) {
    // Context must have been pushed by caller
    this.setFunctionType(kind);

    if (this.context.hasYieldAwait)
      this.fail('Invalid yield or await within arrow function head');

    // Transform and validate formal parameters
    let formals = this.checkArrowParameters(params);

    return new AST.ArrowFunctionHead(formals, start, this.nodeEnd());
  }

  ArrowFunctionBody(head, noIn) {
    this.read('=>');

    let params = head.parameters;
    let start = head.start;
    let kind = this.context.isAsync ? 'async' : '';

    // Use function body context even if parsing expression body form
    this.context.functionBody = true;

    let body = this.peek() === '{' ?
      this.FunctionBody() :
      this.AssignmentExpression(noIn);

    this.popContext();

    return new AST.ArrowFunction(kind, params, body, start, this.nodeEnd());
  }

  // === Classes ===

  ClassDeclaration() {
    let start = this.nodeStart();
    let kind = 'base';
    let ident = null;
    let base = null;

    this.read('class');

    ident = this.BindingIdentifier();

    if (this.peek() === 'extends') {
      this.read();
      kind = 'derived';
      base = this.MemberExpression(true);
    }

    return new AST.ClassDeclaration(
      ident,
      base,
      this.ClassBody(kind),
      start,
      this.nodeEnd());
  }

  ClassExpression() {
    let start = this.nodeStart();
    let kind = 'base';
    let ident = null;
    let base = null;

    this.read('class');

    if (this.peek() === 'IDENTIFIER')
      ident = this.BindingIdentifier();

    if (this.peek() === 'extends') {
      this.read();
      kind = 'derived';
      base = this.MemberExpression(true);
    }

    return new AST.ClassExpression(
      ident,
      base,
      this.ClassBody(kind),
      start,
      this.nodeEnd());
  }

  ClassBody(classKind) {
    let start = this.nodeStart();
    let hasConstructor = false;
    let list = [];

    this.pushContext(true);
    this.setStrict(true);
    this.read('{');

    while (this.peekUntil('}', 'name')) {
      if (this.parseAnnotation('name')) continue;

      let elem = this.ClassElement(classKind);

      switch (elem.type) {
        case 'MethodDefinition':
          if (elem.kind === 'constructor') {
            if (hasConstructor)
              this.fail('Duplicate constructor definitions', elem.name);

            hasConstructor = true;
          }
          break;
      }

      list.push(elem);
    }

    this.read('}');
    this.popContext();

    return new AST.ClassBody(list, start, this.nodeEnd());
  }

  EmptyClassElement() {
    let start = this.nodeStart();
    this.read(';');
    return new AST.EmptyClassElement(start, this.nodeEnd());
  }

  ClassElement(classKind) {
    let token = this.peekToken('name');
    let start = token.start;
    let isStatic = false;

    if (token.type === ';')
      return this.EmptyClassElement();

    if (token.type === 'IDENTIFIER' && token.value === 'static') {
      switch (this.peekAt('name', 1)) {
        case 'IDENTIFIER':
        case '[':
          this.read();
          token = this.peekToken('name');
          isStatic = true;
          break;
      }
    }

    let kind = '';
    let name = null;

    if (token.type === 'IDENTIFIER' || token.type === '[') {
      name = this.PropertyName();
      if (!isStatic && name.type === 'Identifier' && name.value === 'constructor')
        kind = 'constructor';
    }

    let method = this.MethodDefinition(name, kind, classKind);
    name = method.name;

    if (name.type === 'Identifier') {
      let invalid;
      if (isStatic) {
        invalid =
          name.value === 'prototype' ||
          name.value === 'constructor' && method.type === 'ClassField';
      } else {
        invalid = name.value === 'constructor' && method.kind !== 'constructor';
      }
      if (invalid)
        this.fail('Invalid ' + name.value + ' property in class definition', name);
    }

    method.start = start;
    method.static = isStatic;

    return method;
  }

  ClassField(name) {
    let init = null;

    if (this.peek('name') === '=') {
      this.read();
      init = this.AssignmentExpression(false);
    }

    this.Semicolon();

    return new AST.ClassField(false, name, init, name.start, this.nodeEnd());
  }

  // === Modules ===

  ModuleItemList() {
    let list = [];

    while (true) {
      switch (this.peek()) {
        case 'EOF':
          return list;
        case '@':
          this.parseAnnotation();
          break;
        case 'import':
          switch (this.peekAt('', 1)) {
            case '(':
            case '.':
              list.push(this.StatementListItem());
              break;
            default:
              list.push(this.ImportDeclaration());
              break;
          }
          break;
        case 'export':
          list.push(this.ExportDeclaration());
          break;
        default:
          list.push(this.StatementListItem());
          break;
      }
    }
  }

  ImportCall() {
    let start = this.nodeStart();

    this.read('import');
    this.read('(');
    let argument = this.AssignmentExpression();
    this.read(')');

    return new AST.ImportCall(argument, start, this.nodeEnd());
  }

  ImportDeclaration() {
    let start = this.nodeStart();
    let imports = null;
    let from;

    this.read('import');

    switch (this.peek()) {
      case '*':
        imports = this.NamespaceImport();
        break;

      case '{':
        imports = this.NamedImports();
        break;

      case 'STRING':
        from = this.StringLiteral();
        break;

      default:
        imports = this.DefaultImport();
        break;
    }

    if (!from) {
      this.readKeyword('from');
      from = this.StringLiteral();
    }

    this.Semicolon();

    return new AST.ImportDeclaration(imports, from, start, this.nodeEnd());
  }

  DefaultImport() {
    let start = this.nodeStart();
    let ident = this.BindingIdentifier();
    let extra = null;

    if (this.peek() === ',') {
      this.read();

      switch (this.peek()) {
        case '*':
          extra = this.NamespaceImport();
          break;

        case '{':
          extra = this.NamedImports();
          break;

        default:
          this.fail();
      }
    }

    return new AST.DefaultImport(ident, extra, start, this.nodeEnd());
  }

  NamespaceImport() {
    let start = this.nodeStart();
    let ident;

    this.read('*');
    this.readKeyword('as');
    ident = this.BindingIdentifier();

    return new AST.NamespaceImport(ident, start, this.nodeEnd());
  }

  NamedImports() {
    let start = this.nodeStart();
    let list = [];

    this.read('{');

    while (this.peekUntil('}')) {
      list.push(this.ImportSpecifier());

      if (this.peek() === ',')
        this.read();
    }

    this.read('}');

    return new AST.NamedImports(list, start, this.nodeEnd());
  }

  ImportSpecifier() {
    let start = this.nodeStart();
    let hasLocal = false;
    let local = null;
    let remote;

    if (this.peek() !== 'IDENTIFIER') {
      // Re-scan token as an identifier name
      this.unpeek();
      remote = this.IdentifierName();
      hasLocal = true;
    } else {
      remote = this.Identifier();
      hasLocal = this.peekKeyword('as');
    }

    if (hasLocal) {
      this.readKeyword('as');
      local = this.BindingIdentifier();
    } else {
      this.checkBindingTarget(remote);
    }

    return new AST.ImportSpecifier(remote, local, start, this.nodeEnd());
  }

  ExportDeclaration() {
    let start = this.nodeStart();
    let decl;

    this.read('export');

    switch (this.peek()) {
      case 'default':
        return this.ExportDefault(start);

      case '*':
        return this.ExportNamespace(start);

      case '{':
        return this.ExportNameList(start);

      case 'var':
      case 'const':
        decl = this.LexicalDeclaration();
        break;

      case 'function':
        decl = this.FunctionDeclaration();
        break;

      case 'class':
        decl = this.ClassDeclaration();
        break;

      case 'IDENTIFIER':
        if (this.peekLet())
          decl = this.LexicalDeclaration();
        else if (this.peekAsync() === 'function')
          decl = this.FunctionDeclaration();
        else
          return this.ExportDefaultFrom(start);

        break;

      default:
        this.fail();
    }

    return new AST.ExportDeclaration(decl, start, this.nodeEnd());
  }

  ExportDefault(start) {
    let binding;

    this.read('default');

    switch (this.peek()) {
      case 'class':
        binding = this.ClassExpression();
        break;

      case 'function':
        binding = this.FunctionExpression();
        break;

      case 'IDENTIFIER':
        binding = this.peekAsync() === 'function' ?
          this.FunctionExpression() :
          this.AssignmentExpression();
        break;

      default:
        binding = this.AssignmentExpression();
        break;
    }

    let isDecl = this.transformDefaultExport(binding);

    if (!isDecl)
      this.Semicolon();

    return new AST.ExportDefault(binding, start, this.nodeEnd());
  }

  ExportNameList(start) {
    let list = [];
    let from = null;

    this.read('{');

    while (this.peekUntil('}', 'name')) {
      list.push(this.ExportSpecifier());

      if (this.peek() === ',')
        this.read();
    }

    this.read('}');

    if (this.peekKeyword('from')) {
      this.read();
      from = this.StringLiteral();
    } else {
      // Transform identifier names to identifiers
      list.forEach(node => this.transformIdentifier(node.local));
    }

    this.Semicolon();

    return new AST.ExportNameList(list, from, start, this.nodeEnd());
  }

  ExportDefaultFrom(start) {
    let name = this.Identifier();

    this.readKeyword('from');
    let from = this.StringLiteral();
    this.Semicolon();

    return new AST.ExportDefaultFrom(name, from, start, this.nodeEnd());
  }

  ExportNamespace(start) {
    let ident = null;

    this.read('*');

    if (this.peekKeyword('as')) {
      this.read();
      ident = this.BindingIdentifier();
    }

    this.readKeyword('from');
    let from = this.StringLiteral();
    this.Semicolon();

    return new AST.ExportNamespace(ident, from, start, this.nodeEnd());
  }

  ExportSpecifier() {
    let start = this.nodeStart();
    let local = this.IdentifierName();
    let remote = null;

    if (this.peekKeyword('as')) {
      this.read();
      remote = this.IdentifierName();
    }

    return new AST.ExportSpecifier(local, remote, start, this.nodeEnd());
  }

  Annotation() {
    let start = this.nodeStart();

    this.read('@');

    let path = [this.IdentifierName()];

    while (this.peek() === '.') {
      this.read();
      path.push(this.IdentifierName());
    }

    let args = null;

    if (this.peek() === '(') {
      this.read();
      args = this.ArgumentList();
      this.read(')');
    }

    return new AST.Annotation(path, args, start, this.nodeEnd());
  }

}

function mixin(target, ...sources) {
  target = target.prototype;

  let {
    getOwnPropertyNames: ownNames,
    getOwnPropertySymbols: ownSymbols,
    getOwnPropertyDescriptor: ownDesc,
    prototype: { hasOwnProperty: hasOwn },
  } = Object;

  sources
    .map(source => source.prototype)
    .forEach(source => ownNames(source)
      .concat(ownSymbols(source))
      .filter(key => !hasOwn.call(target, key))
      .forEach(key => Object.defineProperty(target, key, ownDesc(source, key))));
}

// Add externally defined methods
mixin(Parser, Transform, Validate);
