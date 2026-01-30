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
      const files = this.system.scanDirectoryRecursive(path);

      let didLoadSomething = false;

      files.forEach((filePath) => {
        const fileName = this.system.path.basename(filePath, ".js");

        delete require.cache[require.resolve(filePath)];

        const file = require(filePath);

        if (this.blacklist.includes(fileName)) return;

        if (!file.type)
          throw new TypeError(
            'No file type - module.type "string" needed (function, class, command)\n' +
              filePath,
          );

        if (file.dontLoad) return;

        if (!didLoadSomething) {
          this.system.changeSystemEntry(folderName, {});

          didLoadSomething = true;
        }

        switch (file.type) {
          case "function":
            this.system.addModule(fileName, folderName, file);
            break;
          case "command":
            this.loadCommand(file);
            break;
          case "class":
            this.loadClass(fileName, folderName, file);
            break;
          default:
            throw new TypeError(
              'Unknown file type - module.type "string" needed (function, class, command)\n' +
                filePath,
            );
        }
      });
    });
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
