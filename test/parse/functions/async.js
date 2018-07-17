({

/** async function f() {} **/
"async declaration": {
    type: "Script",
    statements: [

    {   type: "FunctionDeclaration",
        kind: "async",

        identifier:
        {   type: "Identifier",
            value: "f"
        },

        params: [],

        body:
        {   type: "FunctionBody",
            statements: []
        }
    }]
},

/** async
function f() {}
**/
"async declaration has newline restriction": {
    type: "Script",
    statements: [
    {   type: "ExpressionStatement",
        expression:
        {   type: "Identifier",
            value: "async"
        }
    },
    {   type: "FunctionDeclaration",
        kind: "",
        identifier:
        {   type: "Identifier",
            value: "f"
        },
        params: [],
        body:
        {   type: "FunctionBody",
            statements: []
        }
    }]
},

/** x = async
function() {}
**/
'async expression has newline restriction': {},

/** (async function f() {}); **/
"async expression": {
    type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:
        {   type: "ParenExpression",
            expression:
            {   type: "FunctionExpression",
                kind: "async",
                identifier:
                {   type: "Identifier",
                    value: "f"
                },
                params: [],
                body:
                {   type: "FunctionBody",
                    statements: []
                }
            }
        }
    }]
},

/** async function f() { await 0; } **/
"await expression": {
    type: "Script",
    statements: [
    {   type: "FunctionDeclaration",
        kind: "async",
        identifier:
        {   type: "Identifier",
            value: "f"
        },
        params: [],
        body:
        {   type: "FunctionBody",
            statements: [
            {   type: "ExpressionStatement",
                expression:
                {   type: "UnaryExpression",
                    operator: "await",
                    expression:
                    {   type: "NumberLiteral",
                        value: 0
                    }
                }
            }]
        }
    }]
},

/** async function f() { (await 0); } **/
"await expression inside of paren": {
    type: "Script",
    statements: [
    {   type: "FunctionDeclaration",
        kind: "async",
        identifier:
        {   type: "Identifier",
            value: "f"
        },
        params: [],
        body:
        {   type: "FunctionBody",
            statements: [
            {   type: "ExpressionStatement",
                expression:
                {   type: "ParenExpression",
                    expression:
                    {   type: "UnaryExpression",
                        operator: "await",
                        expression:
                        {   type: "NumberLiteral",
                            value: 0
                        }
                    }
                }
            }]
        }
    }]
},


/** async function f() { await
0; } **/
"empty await expression with newline": {
    type: "Script",
    statements: [
    {   type: "FunctionDeclaration",
        kind: "async",
        identifier:
        {   type: "Identifier",
            value: "f"
        },
        params: [],
        body:
        {   type: "FunctionBody",
            statements: [
            {   type: "ExpressionStatement",
                expression:
                {   type: "UnaryExpression",
                    operator: "await",
                    expression:
                    {   type: "NumberLiteral",
                        value: 0
                    }
                }
            }]
        }
    }]
},

/** await 0; **/
"await not allowed outside of async": {},

/** async function f() { await } **/
"empty await not allowed": {},

/** ({ async f() {} }); **/
"async object methods":
{ type: 'Script',
  start: 0,
  end: 19,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 19,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 18,
          expression:
           { type: 'ObjectLiteral',
             start: 1,
             end: 17,
             properties:
              [ { type: 'MethodDefinition',
                  start: 3,
                  end: 15,
                  static: false,
                  kind: 'async',
                  name: { type: 'Identifier', start: 9, end: 10, value: 'f', context: '' },
                  params: [],
                  body: { type: 'FunctionBody', start: 13, end: 15, statements: [] } } ],
             trailingComma: false } } } ] },

/** async x => { await 0 } **/
"async arrows with function body":
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:

        {   type: "ArrowFunction",
            kind: "async",
            params: [
            {   type: "FormalParameter",
                pattern:
                {   type: "Identifier",
                    value: "x"
                },
                initializer: null
            }],

            body:
            {   type: "FunctionBody",
                statements: [

                {   type: "ExpressionStatement",
                    expression:
                    {   type: "UnaryExpression",
                        operator: "await",
                        expression:
                        {   type: "NumberLiteral",
                            value: 0
                        }
                    }
                }]
            }
        }
    }]
},

/** async x => await 0 **/
"async arrows with expression body":
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:

        {   type: "ArrowFunction",
            kind: "async",
            params: [
            {   type: "FormalParameter",
                pattern:
                {   type: "Identifier",
                    value: "x"
                },
                initializer: null
            }],

            body:
            {   type: "UnaryExpression",
                operator: "await",
                expression:
                {   type: "NumberLiteral",
                    value: 0
                }
            }
        }
    }]
},

/** async x => f(await g) **/
"async arrows with expression body and nested await":
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:

        {   type: "ArrowFunction",
            kind: "async",
            params: [
            {   type: "FormalParameter",
                pattern:
                {   type: "Identifier",
                    value: "x"
                },
                initializer: null
            }],

            body:
            {   type: "CallExpression",
                callee:
                {   type: "Identifier",
                    value: "f"
                },
                arguments: [
                {   type: "UnaryExpression",
                    operator: "await",
                    expression:
                    {   type: "Identifier",
                        value: "g"
                    }
                }],
                trailingComma: false
            }
        }
    }]
},

/** async (x) => null **/
"async arrow with parenthesized argument list":
{   type: "Script",
    statements: [

    {   type: "ExpressionStatement",
        expression:

        {   type: "ArrowFunction",
            kind: "async",
            params: [
            {   type: "FormalParameter",
                pattern:
                {   type: "Identifier",
                    value: "x"
                },
                initializer: null
            }],

            body:
            {   type: "NullLiteral"
            }
        }
    }]
},

/** x => await null **/
"await not allowed in a non-async arrow": {},

/** async (x, ...args, y) => null **/
"rest parameter can only appear as the last formal parameter": {},

/** async ()
=> 0 **/
'newline restriction between right paren and arrow': {},

/** async x
=> 0 **/
'newline restriction between identifier and arrow': {},

/** async
x => 0 **/
'newline restriction between async and identifier in arrows':
{ type: 'Script',
  start: 0,
  end: 12,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 5,
       expression:
        { type: 'Identifier',
          start: 0,
          end: 5,
          value: 'async',
          context: 'variable' } },
     { type: 'ExpressionStatement',
       start: 6,
       end: 12,
       expression:
        { type: 'ArrowFunction',
          start: 6,
          end: 12,
          kind: '',
          params:
           [ { type: 'FormalParameter',
               start: 6,
               end: 7,
               pattern:
                { type: 'Identifier',
                  start: 6,
                  end: 7,
                  value: 'x',
                  context: 'declaration' },
               initializer: null } ],
          body: { type: 'NumberLiteral', start: 11, end: 12, value: 0 } } } ] },

/** async foo + bar **/
'async arrow head cannot appear without body': {},

/** async
() => 0 **/
'newline restriction between async and argument list': {},

/** (async x => 0) **/
'no newline restriction before async keyword in arrow':
{ type: 'Script',
  start: 0,
  end: 14,
  statements:
   [ { type: 'ExpressionStatement',
       start: 0,
       end: 14,
       expression:
        { type: 'ParenExpression',
          start: 0,
          end: 14,
          expression:
           { type: 'ArrowFunction',
             start: 1,
             end: 13,
             kind: 'async',
             params:
              [ { type: 'FormalParameter',
                  start: 7,
                  end: 8,
                  pattern:
                   { type: 'Identifier',
                     start: 7,
                     end: 8,
                     value: 'x',
                     context: 'declaration' },
                  initializer: null } ],
             body: { type: 'NumberLiteral', start: 12, end: 13, value: 0 } } } } ] },

/*** export default async function() {} ***/
'export default async function':
{ type: 'Module',
  start: 0,
  end: 34,
  statements:
   [ { type: 'ExportDefault',
       binding:
        { type: 'FunctionDeclaration',
          start: 15,
          end: 34,
          kind: 'async',
          identifier: null,
          params: [],
          body: { type: 'FunctionBody', start: 32, end: 34, statements: [] } },
       start: 0,
       end: 34 } ] },

/** async function f() { (await ) => {} } **/
'await not allowed in arrow function parameter list - 1': {},

/** async function f() { (a = await 1) => {} } **/
'await not allowed in arrow function parameter list - 2': {},

/** ({ async
x() {} }); **/
'Line terminator must not follow async in methods': {},

})
