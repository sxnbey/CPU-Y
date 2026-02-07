/**
 * @typedef {import("../System.js")} System
 */

const { validate } = require("../contracts/moduleContract.js");

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

    return this;
  }

  load() {
    this.pathsToLoad.forEach((path) => {
      const files = this.system.scanDirectoryRecursive(path);

      let file;

      files.forEach((filePath) => {
        // "runtime" as source means it's protected from reload (persistent)
        // and not a path but an object instead.

        if (path.source != "runtime") {
          const fileName = this.system.path.basename(filePath, ".js");

          if (this.blacklist.includes(fileName)) return;

          // So I don't kill running instances with deleting the cache.

          const tempFile = require(filePath);

          if (tempFile.dontLoad) return;

          delete require.cache[require.resolve(filePath)];

          file = require(filePath);

          file.name ??= fileName;
          file.category ??= this.system.path.basename(path);
          file.path = filePath;

          validate(file);
        } else file = path;

        this.system.registerModule(file);
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
