/**
 * @typedef {import("../core/System.js")} System
 */

/**
 * Loader is responsible for loading:
 * - Commands
 * - Modules
 * - Handler
 *
 * @class Loader
 */

module.exports = class Loader {
  /**
   * @param {System} system
   */

  constructor(system) {
    this.system = system;

    this.commandsPath = system.config.commandsPath;
    this.subcommandsPath = system.config.subcommandsPath;

    this.pathsToLoad = system.config.pathsToLoad;
    this.customPaths = system.config.customPaths ?? null;

    this.allPaths = [];

    this.blacklist = system.config.loadBlacklist;
  }

  start() {
    this.createAllPaths();
    this.load();
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

  load() {
    this.pathsToLoad.forEach((path) => {
      const folderName = this.system.path.basename(path);

      this.system.changeSystemEntry(folderName, {});

      const files = this.loadRecursive(path);

      files.forEach((filePath) => {
        const fileName = this.system.path.basename(filePath, ".js");

        if (this.blacklist.includes(fileName)) return;

        delete require.cache[require.resolve(filePath)];

        const file = require(filePath);

        switch (file.type) {
          case "function":
            this.loadAndRunFunction(fileName, file);
            break;
          case "command":
            this.loadCommand(fileName, file);
            break;
          case "class":
            this.loadClass(fileName, file);
        }
      });
    });
  }

  loadRecursive(path, files = []) {
    this.system.fs
      .readdirSync(path, { withFileTypes: true })
      .forEach((entry) => {
        const fullPath = this.system.path.join(path, entry.name);

        if (entry.isDirectory()) this.loadRecursive(fullPath, files);
        else if (entry.isFile() && entry.name.endsWith(".js"))
          files.push(fullPath);
      });

    return files;
  }

  loadAndRunFunction(functionName, func) {
    this.system.changeSystemEntry(functionName, func);

    func.execute(this.system);
  }

  loadCommand(commandName, command) {}

  loadClass(className, classFile) {
    this.system.changeSystemEntry(className, classFile.class);
  }
};

// function loadLog(system, text, count) {
//   let label = text.charAt(0).toUpperCase() + text.slice(1);

//   if (count == 1) label = label.slice(0, -1);

//   system.other.bootLog.push(
//     `${system.chalk.green(count)} ${
//       label
//     } loaded. ${system.chalk.green("[+]")}`,
//   );
// }
