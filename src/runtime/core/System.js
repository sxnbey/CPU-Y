require("dotenv").config();

const os = require("os");
const terminalkit = require("terminal-kit");
const term = terminalkit.terminal;
const ScreenBuffer = terminalkit.ScreenBuffer;

module.exports = class System {
  constructor(options = {}) {
    this.config = {
      commandDirectory: "commands",
      subcommandDirectory: "subcommands",
      toLoad: ["handlers", "modules"],
      ...options,
    };

    this.dev = process.env.dev?.split(",").includes(os.userInfo().username);

    this.term = term;
    this.ScreenBuffer = ScreenBuffer;

    this.functions = {};
    this.lastCommand = {};
    this.bootLog = [];
  }

  setCommandDirectory(directory) {
    this.config.commandDirectory = directory;

    return this;
  }

  setSubcommandDirectory(directory) {
    this.config.subcommandDirectory = directory;

    return this;
  }

  setCustomLoad(pathArray) {
    this.config.customLoad = pathArray;

    return this;
  }

  addCustomLoad(path) {
    if (!this.config.customLoad) this.config.customLoad = [];

    this.config.customLoad.push(path);

    return this;
  }

  // const system = {
  //   dev: process.env.dev?.split(",").includes(os.userInfo().username),
  //   apikey: process.env.apikey,
  //   term: term,
  //   screenBuffer: ScreenBuffer,
  //   chalk: require("chalk"),
  //   functions: {},
  //   other: {
  //     lastCommand: {},
  //     bootLog: ["", "Boot log:", ""],
  //   },
  // };

  // const RenderState = require("./runtime/core/renderState.js");
  // system.toRender = new RenderState();
  // const Renderer = require("./runtime/core/renderer.js")(system);
  // const renderling = new Renderer();

  // require("./runtime/modules/loader.js")(system);
};
