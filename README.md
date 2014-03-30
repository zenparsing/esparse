# esparse #

**esparse** is a parser for the ECMAScript programming language, written in 
JavaScript. Given a string representing a JavaScript program, it will output 
an abstract syntax tree representing that program.

## Project Goals ##

The primary goal of this project is to implement an ECMAScript parser:

- Whose source code is clear, easy to follow, and aesthetically pleasing.
- That is easy to extend or modify for language experimentation purposes.
- That provides an AST structure which is easy to traverse, easy to 
  manipulate, and is convenient for a wide variety of code transformation 
  use cases.
- Whose performance is comparable to other modern ECMAScript parsers 
  which are written in JavaScript.

AST compatibility with other parsers is not a project goal, because an 
AST is a complex protocol which must be allowed to evolve as the language
itself evolves.

## Roadmap ##

The primary focus in the coming months will be preparing the library 
for production readiness, including:

- Creating documentation describing the library API and the AST structure.
- Widening the scope of the test suite.
- Resolving any divergences from the emerging ECMAScript 6 specification.
