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

    this.commandsPath = system.getConfigEntry("commandsPath");
    this.subcommandsPath = system.getConfigEntry("subcommandsPath");

    this.pathsToLoad = system.getConfigEntry("pathsToLoad");
    this.customPaths = system.getConfigEntry("customPaths") ?? null;

    this.blacklist = system.getConfigEntry("loadBlacklist");
  }

  start() {
    this.load();
  }

  load() {
    this.pathsToLoad.forEach((path) => {
      const folderName = this.system.path.basename(path);

      this.system.changeSystemEntry(folderName, {});

      const files = this.system.scanDirectoryRecursive(path);

      files.forEach((filePath) => {
        const fileName = this.system.path.basename(filePath, ".js");

        if (this.blacklist.includes(fileName)) return;

        delete require.cache[require.resolve(filePath)];

        const file = require(filePath);

        switch (file.type) {
          case "function":
            this.loadAndRunFunction(fileName, folderName, file);
            break;
          case "command":
            this.loadCommand(fileName, folderName, file);
            break;
          case "class":
            this.loadClass(fileName, folderName, file);
        }
      });
    });
  }

  loadAndRunFunction(functionName, category, func) {
    this.system.addToSystemEntry(category, functionName, func);

    func.execute(this.system);
  }

  loadCommand(commandName, command) {}

  loadClass(className, category, classFile) {
    this.system.addToSystemEntry(category, className, classFile.class);
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
