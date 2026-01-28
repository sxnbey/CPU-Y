require("dotenv").config();

const os = require("os");
const path = require("path");
const fs = require("fs");
const terminalkit = require("terminal-kit");
const term = terminalkit.terminal;
const ScreenBuffer = terminalkit.ScreenBuffer;

const Renderer = require("./Renderer.js");
const RenderState = require("./RenderState.js");
const Loader = require("../modules/Loader.js");

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
      loadBlacklist: ["Loader.js"],
      ...options,
    };

    this.dev = process.env.dev?.split(",").includes(os.userInfo().username);

    this.path = path;
    this.fs = fs;
    this.term = term;
    this.ScreenBuffer = ScreenBuffer;

    this.Loader = Loader;
    this.Renderer = Renderer;
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

  getConfigEntry(name) {
    return this.config[name];
  }

  scanDirectoryRecursive(path, files = []) {
    this.fs.readdirSync(path, { withFileTypes: true }).forEach((entry) => {
      const fullPath = this.path.join(path, entry.name);

      if (entry.isDirectory()) this.scanDirectoryRecursive(fullPath, files);
      else if (entry.isFile() && entry.name.endsWith(".js"))
        files.push(fullPath);
    });

    return files;
  }

  createAllPaths() {
    const projectRoot = process.cwd();
    const frameworkRoot = this.path.resolve(__dirname, "..");

    this.config.commandsPath = this.path.join(projectRoot, "commands");
    this.config.subcommandsPath = this.path.join(projectRoot, "subcommands");

    this.config.pathsToLoad = [
      this.path.join(frameworkRoot, "handlers"),
      this.path.join(frameworkRoot, "modules"),
      this.config.commandsPath,
      this.config.subcommandsPath,
    ];

    if (this.config.customPaths)
      this.config.pathsToLoad.push(...this.config.customPaths);
  }

  start() {
    this.createAllPaths();

    new this.Loader(this).start();

    console.log(this.functions);

    this.term.on("key", (name) => {
      if (name === "CTRL_C") {
        term.processExit(0);
        term.fullscreen(false);
      }
    });

    // this.term.clear();
    // this.term.grabInput();
    // this.term.grabInput({ mouse: "button" });
    // this.term.fullscreen(true);

    // this.Renderer = new this.Renderer(this);
    // this.Renderer.render();
  }
};
