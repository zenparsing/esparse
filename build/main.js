require("child_process").spawn(
    "es6now", 
    "- ../src/main.js esparse.js -b -r -g esparse".split(/ /g), 
    { stdio: "inherit", cwd: __dirname });
