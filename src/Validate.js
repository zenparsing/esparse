import { isStrictReservedWord } from './Scanner.js';

// Returns true if the specified name is a restricted identifier in strict mode
function isPoisonIdent(name) {
  return name === 'eval' || name === 'arguments';
}

export class Validate {

  // Validates an assignment target
  checkAssignmentTarget(node, simple) {
    if (!simple && node.type === 'ParenExpression') {
      node = this.unwrapParens(node);
      simple = true;
    }

    switch (node.type) {
      case 'Identifier':
        if (isPoisonIdent(node.value))
          this.addStrictError('Cannot modify ' + node.value + ' in strict mode', node);

        return;

      case 'MemberExpression':
        return;

      case 'ObjectPattern':
      case 'ArrayPattern':
        if (!simple) return;
        break;

      case 'ObjectLiteral':
        if (!simple) {
          this.transformObjectPattern(node, false);
          return;
        }
        break;

      case 'ArrayLiteral':
        if (!simple) {
          this.transformArrayPattern(node, false);
          return;
        }
        break;
    }

    this.fail('Invalid left-hand side in assignment', node);
  }

  // Validates a binding target
  checkBindingTarget(node) {
    switch (node.type) {
      case 'Identifier': {
        // Perform basic identifier validation
        this.checkIdentifier(node);

        // Mark identifier node as a declaration
        node.context = 'declaration';

        let name = node.value;

        if (isPoisonIdent(name))
          this.addStrictError(`Binding cannot be created for '${ name }' in strict mode`, node);

        return;
      }

      case 'ArrayLiteral':
      case 'ArrayPattern':
        this.transformArrayPattern(node, true);
        return;

      case 'ObjectLiteral':
      case 'ObjectPattern':
        this.transformObjectPattern(node, true);
        return;
    }

    this.fail('Invalid binding target', node);
  }

  // Validates a target in a binding or assignment pattern
  checkPatternTarget(node, binding) {
    return binding ? this.checkBindingTarget(node) : this.checkAssignmentTarget(node, false);
  }

  // Checks an identifier for strict mode reserved words
  checkIdentifier(node) {
    let ident = node.value;

    if (ident === 'yield' && this.context.isGenerator)
      this.fail('yield cannot be an identifier inside of a generator function', node);
    else if (ident === 'await' && this.context.isAsync)
      this.fail('await cannot be an identifier inside of an async function', node);
    else if (isStrictReservedWord(ident))
      this.addStrictError(ident + ' cannot be used as an identifier in strict mode', node);
  }

  // Checks function formal parameters for strict mode restrictions
  checkParameters(params) {
    for (let i = 0; i < params.length; ++i) {
      let node = params[i];

      if (node.type !== 'FormalParameter' || node.pattern.type !== 'Identifier') {
        this.context.allowUseStrict = false;
        continue;
      }

      if (node.initializer)
        this.context.allowUseStrict = false;

      let name = node.pattern.value;
      if (isPoisonIdent(name))
        this.addStrictError('Parameter name ' + name + ' is not allowed in strict mode', node);
    }
  }

  // Performs validation on transformed arrow formal parameters
  checkArrowParameters(params) {
    params = this.transformFormals(params);
    this.checkParameters(params);
    return params;
  }

  // Performs validation on the init portion of a for-in or for-of statement
  checkForInit(init, iterationType) {
    if (!init)
      return;

    if (!iterationType) {
      if (init.type !== 'VariableDeclaration')
        return;

      init.declarations.forEach(decl => {
        if (decl.initializer)
          return;

        // Enforce const intilization in for(;;)
        if (init.kind === 'const')
          this.fail('Missing const initializer', decl.pattern);

        // Enforce pattern initialization in for(;;)
        if (decl.pattern.type !== 'Identifier')
          this.fail('Missing pattern initializer', decl.pattern);
      });

      return;
    }

    if (init.type === 'VariableDeclaration') {

      // For-in/of may only have one variable declaration
      if (init.declarations.length !== 1) {
        this.fail('for-' + iterationType + ' statement may not have more than ' +
          'one variable declaration', init);
      }

      let decl = init.declarations[0];

      // Initializers are not allowed in for in and for of
      if (decl.initializer) {
        let msg = 'Invalid initializer in for-' + iterationType + ' statement';
        if (iterationType === 'in') this.addStrictError(msg, init);
        else this.fail(msg);
      }

    } else {

      this.checkAssignmentTarget(this.unwrapParens(init));
    }
  }

  checkInvalidNodes() {
    let context = this.context;
    let list = context.invalidNodes;

    for (let i = 0; i < list.length; ++i) {
      let item = list[i];
      let node = item.node;
      let error = node.error;

      // Skip if error has been resolved
      if (!error)
        continue;

      // Skip if this is a strict-mode-only error in sloppy mode
      if (item.strict && !context.strict)
        continue;

      this.fail(error, node);
    }

  }

  checkDelete(node) {
    node = this.unwrapParens(node);

    if (node.type === 'Identifier')
      this.addStrictError('Cannot delete unqualified property in strict mode', node);
  }

}
