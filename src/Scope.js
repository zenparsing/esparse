/*

TODO:

- What should the output of this program be?  A scope tree, as we currently have it?
  Or should it annotate the AST instead?  What do we need for our let-conversion?

*/

export function resolveBindings(root) {

    return new Visitor().resolve(root);
}

class Scope {

    constructor(type) {

        this.type = type || "block";
        this.names = Object.create(null);
        this.free = [];
        this.strict = false;
        this.children = [];
        this.varNames = [];
    }
}

class Visitor {

    resolve(root) {

        this.stack = [];
        this.top = new Scope("var");

        this.visit(root);
        this.flushFree();

        return this.top;
    }

    pushScope(type) {

        var strict = this.top.strict;
        this.stack.push(this.top);
        this.top = new Scope(type);
        this.top.strict = strict;

        return this.top;
    }

    flushFree() {

        var map = this.top.names,
            free = this.top.free,
            next = null;

        if (this.stack.length > 0)
            next = this.stack[this.stack.length - 1];

        free.forEach(r => {

            var name = r.value;

            if (map[name]) map[name].references.push(r);
            else if (next) next.free.push(r);
        });

        free.length = 0;
    }

    popScope() {

        var scope = this.top,
            varNames = scope.varNames,
            free = scope.free;

        this.flushFree();

        scope.free = null;
        scope.varNames = null;

        this.top = this.stack.pop();

        if (Object.keys(scope.names).length === 0)
            scope.children.forEach(c => this.top.children.push(c));
        else
            this.top.children.push(scope);

        varNames.forEach(n => {

            if (scope.names[n.value])
                this.fail("Cannot shadow lexical declaration with var");
            else if (this.top.type === "var")
                this.addName(n, "var");
            else
                this.top.varNames.push(n);
        });
    }

    visit(node, kind) {

        if (!node)
            return;

        var f = this[node.type];

        if (typeof f === "function")
            f.call(this, node, kind);
        else
            node.children().forEach(n => this.visit(n, kind));
    }

    fail(msg) {

        throw new SyntaxError(msg);
    }

    hasStrictDirective(statements) {

        var n, i;

        for (i = 0; i < statements.length; ++i) {

            n = statements[i];

            if (n.type !== "Directive")
                break;

            if (n.value === "use strict")
                return true;
        }

        return false;
    }

    visitFunction(params, body, strictParams) {

        var paramScope = this.pushScope("params");

        if (!this.top.strict && this.hasStrictDirective(body.statements))
            this.top.strict = true;

        strictParams = strictParams || this.top.strict;

        params.forEach(n => {

            if (!strictParams && (
                n.type !== "FormalParameter" ||
                n.initializer ||
                n.pattern.type !== "Identifier")) {

                strictParams = true;
            }

            this.visit(n, "param");
            this.flushFree();
        });

        this.pushScope("var");
        var blockScope = this.pushScope();
        this.visit(body, "var");
        this.popScope();
        this.popScope();

        this.popScope();

        Object.keys(paramScope.names).forEach(name => {

            if (blockScope.names[name])
                this.fail("Duplicate block declaration");

            if (strictParams && paramScope.names[name].declarations.length > 1)
                this.fail("Duplicate parameter names");
        });
    }

    addReference(node) {

        var name = node.value,
            map = this.top.names,
            next = this.stack[this.stack.length - 1];

        if (map[name]) map[name].references.push(node);
        else top.free.push(node);
    }

    addName(node, kind) {

        var name = node.value,
            map = this.top.names,
            record = map[name];

        if (record) {

            if (kind !== "var" && kind !== "param")
                this.fail("Duplicate variable declaration");

        } else {

            if (name === "let" && (kind === "let" || kind === "const"))
                this.fail("Invalid binding identifier");

            map[name] = record = { declarations: [], references: [] };
        }

        record.declarations.push(node);
    }

    Script(node) {

        this.pushScope();

        if (this.hasStrictDirective(node.statements))
            this.top.strict = true;

        node.children().forEach(n => this.visit(n, "var"));

        this.popScope();
    }

    Module(node) {

        this.pushScope();
        this.top.strict = true;
        node.children().forEach(n => this.visit(n, "var"));
        this.popScope();
    }

    Block(node) {

        this.pushScope();
        node.children().forEach(n => this.visit(n));
        this.popScope();
    }

    SwitchStatement(node) {

        this.Block(node);
    }

    ForOfStatement(node) {

        this.Block(node);
    }

    ForInStatement(node) {

        this.Block(node);
    }

    ForStatement(node) {

        this.Block(node);
    }

    CatchClause(node) {

        this.pushScope();
        this.visit(node.param);
        node.body.children().forEach(n => this.visit(n));
        this.popScope();
    }

    VariableDeclaration(node) {

        node.children().forEach(n => this.visit(n, node.kind));
    }

    FunctionDeclaration(node, kind) {

        this.visit(node.identifier, kind);
        this.visitFunction(node.params, node.body, false);
    }

    FunctionExpression(node) {

        this.pushScope();
        this.visit(node.identifier);
        this.visitFunction(node.params, node.body, false);
        this.popScope();
    }

    MethodDefinition(node) {

        this.visitFunction(node.params, node.body, true);
    }

    ArrowFunction(node) {

        this.visitFunction(node.params, node.body, true);
    }

    ClassDeclaration(node, kind) {

        this.visit(node.identifier);
        this.pushScope();
        this.top.strict = true;
        this.visit(node.base);
        this.visit(node.body);
        this.popScope();
    }

    ClassExpression(node) {

        this.pushScope();
        this.top.strict = true;
        this.visit(node.identifier);
        this.visit(node.base);
        this.visit(node.body);
        this.popScope();
    }

    Identifier(node, kind) {

        switch (node.context) {

            case "variable":
                this.top.free.push(node);
                break;

            case "declaration":
                if (kind === "var" && this.top.type !== "var")
                    this.top.varNames.push(node);
                else
                    this.addName(node, kind);
                break;
        }
    }

}
