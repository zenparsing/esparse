const Path = require('path');
const FS = require('fs');
const { inspect } = require('util');

const TEST_COMMENT = /\/\*\*[\s\S]+?\*\*\//g;
const COMMENT_TRIM = /^\/\*+\s+|\s+\*+\/$/g;
const HOP = {}.hasOwnProperty;

let testsPassed = 0;
let testsFailed = 0;

// Returns a stat object for a path
function statPath(path) {
  try {
    return FS.statSync(path);
  } catch (ex) {}
  return null;
}

// Executes a function for each file in a directory
function walkDirectory(dir, fn) {
  FS
    .readdirSync(dir)
    .filter(name => name.charAt(0) !== '.')
    .map(name => Path.resolve(dir, name))
    .map(path => ({
      path: path,
      stat: statPath(path)
    }))
    .forEach(entry => {
      if (!entry.stat)
        return;

      if (entry.stat.isDirectory())
        return walkDirectory(entry.path, fn);

      if (entry.stat.isFile())
        fn(entry.path);
    });
}

let Style = new class {

  green(msg) {
    return `[32m${ msg }[39m`;
  }

  red(msg) {
    return `[31m${ msg }[39m`;
  }

  gray(msg) {
    return `[90m${ msg }[39m`;
  }

  bold(msg) {
    return `[1m${ msg }[22m`;
  }

};

// Prints an application message to the console
function printMessage(msg) {
  console.log(Style.gray(msg));
}

// Prints a group header to the console
function printHeader(msg) {
  console.log(`\n${ Style.bold('== ' + msg + ' ==') }\n`);
}

// Prints a test result
function printResult(msg, pass) {
  console.log(msg + ' ' + (pass ? Style.green('OK') : Style.bold(Style.red('FAIL'))));
  if (pass) testsPassed++;
  else testsFailed++;
}

// Read a javascript or json file
function readFile(filename) {
  let text = FS.readFileSync(filename, 'utf8');

  // From node/lib/module.js/Module.prototype._compile
  text = text.replace(/^\#\!.*/, '');

  // From node/lib/module.js/stripBOM
  if (text.charCodeAt(0) === 0xFEFF)
    text = text.slice(1);

  return text;
}

// Parses a list of test inputs from comments
function parseTestComments(text) {
  let list = text.match(TEST_COMMENT) || [];

  return list.map(source => {
    return {
      module: source.startsWith('/***'),
      source: source.replace(COMMENT_TRIM, ''),
    };
  });
}

// Returns true if the argument is an object
function isObject(obj) {
  return obj && typeof obj === 'object';
}

// Returns true if the specified object is 'like' another object
function objectLike(a, b, skipKeys) {
  if (a === b)
    return true;

  if (!isObject(a) || !isObject(b))
    return a === b;

  // Each key in control must be in test
  for (let keys = Object.keys(b), i = 0; i < keys.length; ++i)
    if (!HOP.call(a, keys[i]))
      return false;

  for (let keys = Object.keys(a), i = 0; i < keys.length; ++i) {
    // Control must have same own property
    if (!HOP.call(b, keys[i])) {
      if (skipKeys && skipKeys.indexOf(keys[i]) >= 0) continue;
      else return false;
    }

    // Values of own properties must be equal
    if (!objectLike(a[keys[i]], b[keys[i]], skipKeys))
      return false;
  }

  return true;
}

function defaultRender(obj) {
  return inspect(obj, { depth: 20, colors: true });
}

function runTests(options) {
  let dirname = options.dir;
  let process = options.process;
  let compare = options.compare;
  let render = options.render || defaultRender;

  // Returns the group name for a test file
  function groupName(path) {
    path = Path.dirname(path);

    if (path.indexOf(__dirname) === 0)
      path = path.slice(dirname.length);

    return path.replace(/[\/\\]/g, '.').replace(/^\./, '');
  }

  function run() {
    let currentGroup = null;

    printMessage('\nStarting tests...');

    walkDirectory(dirname, path => {
      let group = groupName(path);
      let name = Path.basename(path, '.js');
      let tree;

      // Only javascript files in nested directories
      if (!group || Path.extname(path) !== '.js')
        return;

      // Print a group header
      if (group !== currentGroup)
        printHeader(currentGroup = group);

      let text = readFile(path);
      let programs = parseTestComments(text);
      let outputs = (new Function('return ' + text))();
      let keys = Object.keys(outputs);

      for (let i = 0; i < programs.length; ++i) {
        let program = programs[i];

        try {
          tree = process(program.source, {
            module: program.module
          });
        } catch (err) {
          if (err instanceof SyntaxError)
            tree = { message: err.message };
          else
            throw err;
        }

        let pass = compare(tree, outputs[keys[i]]);
        printResult(name + ' - ' + keys[i], pass);

        if (!pass) {
          printMessage('\nGenerated tree:\n');
          console.log(render(tree));
          throw 'stop';
        }
      }
    });
  }

  try {
    run();
    printMessage('\nSuccessfully completed ' + testsPassed + ' tests - looks good to me!');
  } catch (err) {
    if (err !== 'stop') {
      printMessage('\nSnap! An error has occurred.');
      throw err;
    }
  } finally {
    console.log('');
  }
}

exports.objectLike = objectLike;
exports.runTests = runTests;
