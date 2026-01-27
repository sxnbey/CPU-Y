require("dotenv").config();

const os = require("os");
const path = require("path");
const fs = require("fs");
const terminalkit = require("terminal-kit");
const term = terminalkit.terminal;
const ScreenBuffer = terminalkit.ScreenBuffer;

const RenderState = require("./RenderState.js");

module.exports = class System {
  constructor(options = {}) {
    this.config = {
      commandsPath: "",
      subcommandsPath: "",
      pathsToLoad: ["../handlers", "../modules"],
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
    this.config.commandsPath = path;

    return this;
  }

  setSubcommandsPath(path) {
    this.config.subcommandsPath = path;

    return this;
  }

  setCustomPaths(pathArray) {
    this.config.customPaths = pathArray;

    return this;
  }

  addCustomPath(path) {
    if (!this.config.customPaths) this.config.customPaths = [];

    this.config.customPaths.push(path);

    return this;
  }

  createSystemEntry(name, value) {
    this.system[name] = value;

    return this;
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
