// TODO:  How we deal with the insanity that is with statements?
// TODO:  Param scopes have empty free lists, which is strange

class Scope {

    constructor(type) {

        this.type = type || "block";
        this.names = Object.create(null);
        this.free = [];
        this.strict = false;
        this.parent = null;
        this.children = [];
        this.varNames = [];
    }

    resolveName(name) {

        if (this.names[name])
            return this.names[name];

        if (this.parent)
            return this.parent.resolveName(name);

        return null;
    }
}

export class ScopeResolver {

    resolve(parseResult) {

        this.parseResult = parseResult;
        this.stack = [];
        this.top = new Scope("var");

        this.visit(parseResult.ast);
        this.flushFree();

        parseResult.scopeTree = this.top;
    }

   fail(msg, node) {

        throw this.parseResult.createSyntaxError(msg, node);
    }

    pushScope(type) {

        let strict = this.top.strict;
        this.stack.push(this.top);
        this.top = new Scope(type);
        this.top.strict = strict;

        return this.top;
    }

    flushFree() {

        let map = this.top.names,
            free = this.top.free,
            next = null,
            freeList = [];

        if (this.stack.length > 0)
            next = this.stack[this.stack.length - 1];

        this.top.free = freeList;

        free.forEach(r => {

            let name = r.value;

            if (map[name]) {

                map[name].references.push(r);

            } else {

                freeList.push(r);

                if (next)
                    next.free.push(r);
            }
        });
    }

    linkScope(child) {

        let p = this.top;
        child.parent = p;
        p.children.push(child);
    }

    popScope() {

        let scope = this.top,
            varNames = scope.varNames,
            free = scope.free;

        scope.varNames = null;

        this.flushFree();
        this.top = this.stack.pop();
        this.linkScope(scope);

        varNames.forEach(n => {

            if (scope.names[n.value])
                this.fail("Cannot shadow lexical declaration with var", n);
            else if (this.top.type === "var")
                this.addName(n, "var");
            else
                this.top.varNames.push(n);
        });
    }

    visit(node, kind) {

        if (!node)
            return;

        let f = this[node.type];

        if (typeof f === "function")
            f.call(this, node, kind);
        else
            node.children().forEach(n => this.visit(n, kind));
    }

    hasStrictDirective(statements) {

        for (let i = 0; i < statements.length; ++i) {

            let n = statements[i];

            if (n.type !== "Directive")
                break;

            if (n.value === "use strict")
                return true;
        }

        return false;
    }

    visitFunction(params, body, strictParams) {

        let paramScope = this.pushScope("param");

        if (!this.top.strict &&
            body.statements &&
            this.hasStrictDirective(body.statements)) {

            this.top.strict = true;
        }

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
            this.top.free.length = 0;
        });

        this.pushScope("var");
        let blockScope = this.pushScope("block");
        this.visit(body, "var");
        this.popScope();
        this.popScope();

        this.popScope();

        Object.keys(paramScope.names).forEach(name => {

            if (blockScope.names[name])
                this.fail("Duplicate block declaration", blockScope.names[name].declarations[0]);

            if (strictParams && paramScope.names[name].declarations.length > 1)
                this.fail("Duplicate parameter names", paramScope.names[name].declarations[1]);
        });
    }

    addReference(node) {

        let name = node.value,
            map = this.top.names,
            next = this.stack[this.stack.length - 1];

        if (map[name]) map[name].references.push(node);
        else top.free.push(node);
    }

    addName(node, kind) {

        let name = node.value,
            map = this.top.names,
            record = map[name];

        if (record) {

            if (kind !== "var" && kind !== "param")
                this.fail("Duplicate variable declaration", node);

        } else {

            if (name === "let" && (kind === "let" || kind === "const"))
                this.fail("Invalid binding identifier", node);

            map[name] = record = { declarations: [], references: [] };
        }

        record.declarations.push(node);
    }

    Script(node) {

        this.pushScope("block");

        if (this.hasStrictDirective(node.statements))
            this.top.strict = true;

        node.children().forEach(n => this.visit(n, "var"));

        this.popScope();
    }

    Module(node) {

        this.pushScope("block");
        this.top.strict = true;
        node.children().forEach(n => this.visit(n, "var"));
        this.popScope();
    }

    Block(node) {

        this.pushScope("block");
        node.children().forEach(n => this.visit(n));
        this.popScope();
    }

    SwitchStatement(node) {

        this.Block(node);
    }

    ForOfStatement(node) {

        this.ForStatement(node);
    }

    ForInStatement(node) {

        this.ForStatement(node);
    }

    ForStatement(node) {

        this.pushScope("for");
        node.children().forEach(n => this.visit(n));
        this.popScope();
    }

    CatchClause(node) {

        this.pushScope("catch");
        this.visit(node.param);
        node.body.children().forEach(n => this.visit(n));
        this.popScope();
    }

    VariableDeclaration(node) {

        node.children().forEach(n => this.visit(n, node.kind));
    }

    FunctionDeclaration(node, kind) {

        this.visit(node.identifier, kind);
        this.pushScope("function");
        this.visitFunction(node.params, node.body, false);
        this.popScope();
    }

    FunctionExpression(node) {

        this.pushScope("function");
        this.visit(node.identifier);
        this.visitFunction(node.params, node.body, false);
        this.popScope();
    }

    MethodDefinition(node) {

        this.pushScope("function");
        this.visitFunction(node.params, node.body, true);
        this.popScope();
    }

    ArrowFunction(node) {

        this.pushScope("function");
        this.visitFunction(node.params, node.body, true);
        this.popScope();
    }

    ClassDeclaration(node) {

        this.visit(node.identifier, "let");
        this.pushScope("class");
        this.top.strict = true;
        this.visit(node.base);
        this.visit(node.body);
        this.popScope();
    }

    ClassExpression(node) {

        this.pushScope("class");
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
