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

AST compatibility with other parsers is not a project goal.  However, it
is expected that any future changes to the AST protocol will be backward
compatible with previous versions.


## Hacking ##

*This is a work-in-progress.  If you run into any problems getting started,
please file an issue so that we can get it resolved as soon as possible.*

For now, the development workflow depends on [esdown](https://github.com/zenparsing/esdown),
a minimal and transparent ES6+-to-ES5 compiler.


### Getting Started ###

1.  Install [esdown](https://github.com/zenparsing/esdown), either manually
    or using npm.  Take a look at the `esdown` README to get a feel for the
    command syntax.

        npm install -g esdown

2.  Fork this repository.

3.  From within the project root folder, run:

        esdown test

    This will execute the test runner located at `test/default.js`.

4.  Start hacking the source code and have fun!


### Adding Tests ###

All tests are located in subject-specific directories under the `test` folder.
Adding a new file to any folder within `test` will automatically add it to
the test suite.


### Building ###

Run the following command from the project root to translate and bundle
the library into a single ES5-compatible script:

    esdown build

This will execute a simple build script located at `build/default.js`.
