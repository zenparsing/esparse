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

        this.stack.push(this.top);
        this.top = new Scope(type);
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

        // TODO: collapse to children if names map is empty?

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
        this.pushParams(node.params);
        this.varScope(node.body);
        this.popParams(node.params);
    }

    FunctionExpression(node) {

        this.pushScope();
        this.visit(node.identifier);
        this.pushParams(node.params);
        this.varScope(node.body);
        this.popParams(node.params);
        this.popScope();
    }

    MethodDefinition(node) {

        this.visit(node.identifier);
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
        this.visit(node.base);
        this.visit(node.body);
    }

    ClassExpression(node) {

        this.pushScope();
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
