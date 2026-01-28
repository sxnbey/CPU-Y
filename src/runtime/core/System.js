require("dotenv").config();

const os = require("os");
const path = require("path");
const fs = require("fs");
const terminalkit = require("terminal-kit");
const term = terminalkit.terminal;
const ScreenBuffer = terminalkit.ScreenBuffer;

const RenderState = require("./RenderState.js");

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
      pathsToLoad: ["../handlers", "../modules"],
      loadBlacklist: ["loader.js"],
      ...options,
    };

    this.dev = process.env.dev?.split(",").includes(os.userInfo().username);

    this.path = path;
    this.fs = fs;
    this.term = term;
    this.ScreenBuffer = ScreenBuffer;

    this.renderer = null;
    this.toRender = new RenderState();

    this.functions = {};
    this.lastCommand = {};
    this.bootLog = [];
  }

  setCommandsPath(path) {
    if (typeof path != "string")
      throw new TypeError(`Expected string got ${typeof path} instead`);

    this.config.commandsPath = path;

    return this;
  }

  setSubcommandsPath(path) {
    if (typeof path != "string")
      throw new TypeError(`Expected string got ${typeof path} instead`);

    this.config.subcommandsPath = path;

    return this;
  }

  setCustomPaths(pathArray) {
    if (!Array.isArray(pathArray))
      throw new TypeError(`Expected array got ${typeof pathArray} instead`);

    this.config.customPaths = pathArray;

    return this;
  }

  addCustomPath(path) {
    if (typeof path != "string")
      throw new TypeError(`Expected string got ${typeof path} instead`);

    if (!this.config.customPaths) this.config.customPaths = [];

    this.config.customPaths.push(path);

    return this;
  }

  changeSystemEntry(name, value = {}) {
    if (typeof value != "object")
      throw new TypeError(`Expected object got ${typeof value} instead`);

    this[name] = value;

    return this;
  }

  addToSystemEntry(name, key, value) {
    if (!this[name]) this[name] = {};

    this[name][key] = value;

    return this;
  }

  getSystemEntry(name) {
    return this[name];
  }

  createAllCommandPaths() {
    const rootDirectory = this.findRootDirectory(__dirname);

    ["commands", "subcommands"].forEach(
      (folder) =>
        (this.config[folder + "Path"] = this.path.join(rootDirectory, folder)),
    );
  }

  findRootDirectory(startDirectory) {
    let directory = startDirectory;

    while (!fs.existsSync(this.path.join(directory, "package.json"))) {
      const parentDirectory = this.path.dirname(directory);

      if (parentDirectory == directory) throw new Error("Root not found");

      directory = parentDirectory;
    }

    return directory;
  }

  start() {
    this.createAllCommandPaths();

    this.setCustomPaths("");

    return console.log(this.config);

    this.term.on("key", (name) => {
      if (name === "CTRL_C") {
        term.processExit(0);
        term.fullscreen(false);
      }
    });

    this.term.clear();
    this.term.grabInput();
    this.term.grabInput({ mouse: "button" });
    this.term.fullscreen(true);

    const Renderer = require("./Renderer.js");

    this.renderer = new Renderer(this);
    this.renderer.render();
  }
};
