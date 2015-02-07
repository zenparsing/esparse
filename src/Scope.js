/*

TODO:

- We need to know if the context is strict for parameter processing.  Should the
  parser output the strictness in the AST?  The issue is that the parser doesn't
  even really know the strictness when it's processing the relevant AST node.
  Sigh...

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
    }

    flushFree() {

        var map = this.top.names,
            free = this.top.free,
            next = this.stack[this.stack.length - 1];

        free.forEach(r => {

            var name = r.value;

            if (map[name]) map[name].references.push(r);
            else next.free.push(r);
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

    setStrict(node) {

        if (this.top.strict)
            return;

        var strict = false,
            list;

        switch (node.type) {

            case "Module":
            case "ClassExpression":
            case "ClassDeclaration":
                strict = true;
                break;

            case "FunctionExpression":
            case "FunctionDeclaration":
            case "MethodDefinition":
                list = node.body.statements;
                break;

            case "ArrowFunction":
                if (node.body.type === "FunctionBody")
                    list = node.body.statements;
                break;

            case "Script":
                list = node.statements;
                break;

        }

        if (list) {

            list.every(n => {

                if (n.type !== "Directive")
                    return false;

                if (n.value === "use strict") {

                    strict = true;
                    return false;
                }

                return true;
            });
        }

        this.top.strict = strict;
    }

    pushParams(params) {

        this.pushScope(this.top.strict ? "params" : "simple-params");

        params.forEach(n => {

            if (this.top.type === "simple-params" && (
                n.type !== "FormalParameter" ||
                n.initializer ||
                n.pattern.type !== "Identifier")) {

                this.top.type = "params";
            }

            this.visit(n, "param");
            this.flushFree();
        });
    }

    popParams(params) {

        var scope = this.top,
            duplicates = scope.type === "simple-params";

        this.popScope();

        var block = scope.children[0].children[0];

        Object.keys(scope.names).forEach(name => {

            if (block.names[name])
                this.fail("Duplicate block declaration");

            if (!duplicates && scope.names[name].declarations.length > 1)
                this.fail("Duplicate parameter names");
        });
    }

    varScope(node) {

        this.pushScope("var");
        this.pushScope();
        this.visit(node, "var");
        this.popScope();
        this.popScope();
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
        this.setStrict(node);
        node.children().forEach(n => this.visit(n, "var"));
        this.popScope();
    }

    Module(node) {

        this.Script(node);
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
        this.pushScope();
        this.setStrict(node);
        this.pushParams(node.params);
        this.varScope(node.body);
        this.popParams(node.params);
        this.popScope();
    }

    FunctionExpression(node) {

        this.pushScope();
        this.setStrict(node);
        this.visit(node.identifier);
        this.pushParams(node.params);
        this.varScope(node.body);
        this.popParams(node.params);
        this.popScope();
    }

    MethodDefinition(node) {

        this.pushParams(node.params);
        this.varScope(node.body);
        this.popParams(node.params);
    }

    ArrowFunction(node) {

        this.pushParams(node.params);
        this.varScope(node.body);
        this.popParams(node.params);
    }

    ClassDeclaration(node, kind) {

        this.visit(node.identifier);
        this.pushScope();
        this.setStrict(node);
        this.visit(node.base);
        this.visit(node.body);
        this.popScope();
    }

    ClassExpression(node) {

        this.pushScope();
        this.setStrict(node);
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
