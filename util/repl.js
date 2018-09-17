const path = require('path');
const childProcess = require('child_process');

childProcess.spawn('node', ['-r', 'annotated', '-r', path.resolve(__dirname, './repl-init')], {
  stdio: 'inherit',
  env: process.env,
});
