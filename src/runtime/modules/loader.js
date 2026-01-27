const fs = require("fs");
const dirs = ["modules", "handlers", "commands", "subcommands"];
// const commandDirs = ["commands", "subcommands"];
const blacklist = ["loader.js"];

module.exports = loadAll;

//! WIP

class Loader {
  constructor(system) {
    this.system = system;

    this.commandsPath = system.config.commandsPath;
    this.subcommandsPath = system.config.subcommandsPath;
    this.pathsToLoad = system.config.pathsToLoad;
    this.customPaths = system.config.customPaths || null;
    this.allPaths = [];
    this.blacklist = system.blacklist;
  }

  start() {
    this.createAllPaths();
  }

  loadModulesAndHandler() {
    this.pathsToLoad.forEach((path) => {
      const folderName = this.system.path.split("/")[1];

      this.system.changeSystemEntry(folderName, {});

      this.system.fs.readdirSync(path).forEach((file) => {
        if (this.blacklist.includes(file)) return;

        const fileName = file.split(".js")[0];

        file = require(this.system.path.join(path, file));

        this.system.addToSystemEntry(folderName, fileName, file);

        if (typeof file == "function") {
        }
      });
    });
  }

  loadAndRunFunction(file) {
    file(this.system)();
  }

  createAllPaths() {
    this.allPaths = [
      this.commandsPath,
      this.subcommandsPath,
      ...this.pathsToLoad,
    ];

    if (this.customPaths)
      this.customPaths.forEach((path) => this.allPaths.push(path));
  }

  loadRecursive() {
    this.allPaths.forEach((directory) => {});
  }
}

function loadAll(system) {
  commandDirs.forEach((dir) => {
    system[dir] = [];

    loadCommands(system, system[dir], `./${dir}/`);

    loadLog(system, dir, system[dir].length);
  });

  dirs.forEach((dir) => {
    let count = 0;

    system[dir] = {};

    fs.readdirSync(`./${dir}/`).forEach((i) => {
      if (blacklist.includes(i)) return;

      count++;

      // Deletes the cache of the file (for hot reloading).

      delete require.cache[require.resolve(`../${dir}/${i}`)];

      // After iterating through the directory, it runs the file and saves it.

      const file = require(`../${dir}/${i}`);

      file(system);

      system[dir][i.split(".")[0]] = file;
    });

    loadLog(system, dir.charAt(0).toUpperCase() + dir.slice(1), count);
  });
}

function loadLog(system, text, count) {
  let label = text.charAt(0).toUpperCase() + text.slice(1);

  if (count == 1) label = label.slice(0, -1);

  system.other.bootLog.push(
    `${system.chalk.green(count)} ${
      label
    } loaded. ${system.chalk.green("[+]")}`,
  );
}

function loadCommands(system, arr, dirPath) {
  // Iterates through the directory and if there is a folder, it iterates through said folder.

  fs.readdirSync(dirPath).forEach((i) => {
    if (!i.endsWith(".js"))
      return loadCommands(system, arr, `${dirPath}/${i}/`);

    delete require.cache[require.resolve(`../${dirPath}${i}`)];

    // If it's a file, it will be pushed into the commands array.

    const command = require(`../${dirPath}${i}`);
    const folder = dirPath
      .split("/")
      .slice(2)
      .join("/")
      .replace(/^\/+|\/+$/g, "");

    arr.push({
      config: {
        ...command.config,
        category: folder,
      },
      run: command.run,
    });
  });
}
