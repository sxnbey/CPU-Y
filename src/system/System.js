require("dotenv").config();

const os = require("os");
const path = require("path");
const fs = require("fs");
const terminalkit = require("terminal-kit");
const term = terminalkit.terminal;
const ScreenBuffer = terminalkit.ScreenBuffer;

const Renderer = require("../runtime/core/Renderer.js");
const RenderState = require("../runtime/core/RenderState.js");
const Loader = require("../runtime/modules/Loader.js");

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
      loadBlacklist: ["Loader"],
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

    this.commands = null;
    this.subCommands = null;
    this.handlers = {};
    this.modules = {};
    this.utils = {};

    this.survivesHotReload = [];

    this.lastCommand = {};
    this.bootLog = [];
  }

  //! Error checks will be better soon with own error handler and stuff

  // addUtil(name, func, survivesHotreload = false) {
  //   this.addToSystemEntry(name, "functions", func);

  //   if (survivesHotreload)

  //   return this;
  // }

  // arr.push({
  //   config: {
  //     ...command.config,
  //     category: folder,
  //   },
  //   run: command.run,
  // });

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

    if (this.config.customPaths.length)
      this.config.pathsToLoad.push(...this.config.customPaths);
  }

  start() {
    this.createAllPaths();

    new this.Loader(this).start();

    console.log(this.modules.functions);

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
