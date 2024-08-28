const fs = require("fs");

function loadAll(system) {
  const dirs = ["modules", "handlers", "commands"];

  dirs.forEach((dir) => {
    const key = dir;
    const dirPath = `./${dir}/`;

    system[key] = dir == "commands" ? [] : {};

    if (dir == "commands") loadCommands(system[key], dirPath);
    else
      fs.readdirSync(dirPath).forEach((i) => {
        system[key][i.split(".")[0]] = require(dirPath + i);
      });

    console.log(`${key.charAt(0).toUpperCase() + key.slice(1)} loaded.`);
  });
}

function loadCommands(arr, dirPath) {
  fs.readdirSync(dirPath).forEach((i) => {
    if (!i.endsWith(".js")) return loadCommands(arr, dirPath + i + "/");

    const command = require(dirPath + i);

    arr.push({
      config: command.config,
      run: command.run,
    });
  });
}

module.exports = loadAll;
