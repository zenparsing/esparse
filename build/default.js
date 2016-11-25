require("child_process").spawn(
    "esdown",
    "-- ../src/default.js esparse.js -b -r -g esparse".split(/ /g),
    { stdio: "inherit", cwd: __dirname });
