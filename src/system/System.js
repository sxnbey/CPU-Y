require("dotenv").config();

const os = require("os");
const path = require("path");
const fs = require("fs");
const terminalkit = require("terminal-kit");

const term = terminalkit.terminal;

const Loader = require("./Loader/Loader.js");

const privateAPI = require("./functions/private/index.js");
const publicAPI = require("./functions/public/index.js");

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

    this._bindFunctions(privateAPI);
    this._bindFunctions(publicAPI);

    this.Loader = Loader;
    this.Renderer;
    this.RenderState;
    this.InputHandler;

    this.commands = [];
    this.subcommands = [];
    this.core = {};
    this.handlers = {};
    this.modules = {};
    this.utils = {};

    this.allRegisteredModules = [];
    this.allModuleIds = [];

    this.survivesHotReload = [];

    this.lastCommand = {};
    this.bootLog = [];
  }

  //! Error checks will be better soon with own error handler and stuff

  _bindFunctions(functions) {
    for (const [name, func] of Object.entries(functions))
      this[name] = func.bind(this);
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
      this.config.commandsPath,
      this.config.subcommandsPath,
    ];

    if (this.config.customPaths.length)
      this.config.pathsToLoad.push(...this.config.customPaths);
  }

  _instantiateLoading() {
    this._createAllPaths();

    this._changeSystemEntry("Loader", new this.Loader(this));

    this.Loader.start();
  }

  start() {
    this.term.clear();
    this.term.grabInput();
    this.term.grabInput({ mouse: "button" });
    this.term.fullscreen(true);

    this._instantiateLoading();

    // Soon load priority. Cant instantiate Renderer on loading cuz RenderState has to exist first
    this.Renderer = new this.Renderer(this);

    this.RenderState.on("changed", () => this.Renderer.render());
    this.term.on("resize", () => this.Renderer.render({ resetCursor: true }));

    this.Renderer.render({ initialRender: true });
  }
};
