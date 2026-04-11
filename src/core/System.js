require("dotenv").config();

const os = require("os");
const path = require("path");
const fs = require("fs");
const terminalkit = require("terminal-kit");

const term = terminalkit.terminal;

/**
 * Core system runtime.
 *
 * Initializes:
 * - rendering
 * - file loading
 * - input handling
 * - and more :3
 *
 * @class System
 */

module.exports = class System {
  constructor(options = {}) {
    this.config = {
      commandsPath: "",
      subcommandsPath: "",
      pathsToLoad: [],
      customPaths: [],
      loadBlacklist: [],
      ...options,
    };

    this.dev = process.env.dev?.split(",").includes(os.userInfo().username);

    this.path = path;
    this.fs = fs;
    this.term = term;
  }

  //! Error checks will be better soon with own error handler and stuff

  bindFunctions(functions, destination = this) {
    for (const [name, func] of Object.entries(functions))
      destination[name] = func.bind(destination);
  }

  _createAllPaths() {
    const projectRoot = process.cwd();
    const frameworkRoot = this.path.resolve(__dirname, "../runtime/");

    this.config.commandsPath = this.path.join(projectRoot, "commands");
    this.config.subcommandsPath = this.path.join(projectRoot, "subcommands");

    this.config.pathsToLoad = [
      this.path.join(frameworkRoot, "core"),
      this.path.join(frameworkRoot, "handlers"),
      this.path.join(frameworkRoot, "modules"),
      this.path.join(frameworkRoot, "utils"),
      this.config.commandsPath,
      this.config.subcommandsPath,
    ];

    if (this.config.customPaths.length)
      this.config.pathsToLoad.push(...this.config.customPaths);
  }

  start() {
    this.term.clear();
    // this.term.grabInput();
    // this.term.grabInput({ mouse: "button" });
    // this.term.fullscreen(true);

    console.log("Booting...");

    const registry = require("./registry/Main.js");
    this.Registry = new registry();

    console.log(this.Registry);
  }
};
