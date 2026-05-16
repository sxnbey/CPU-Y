const System = require("./System.js");
const MainRegistry = require("./registry/Main.js");
const registries = {
  blueprint: require("./registry/Blueprints.js"),
  contract: require("./registry/Contracts.js"),
  resources: require("./registry/Resources.js"),
};
const TerminalHandler = require("../../engine/handlers/terminalhandler/TerminalHandler.js");

const path = require("path");
const fs = require("fs");
const term = require("terminal-kit").terminal;

require("dotenv").config();
const env = process.env;
const os = require("os");

module.exports = class CPUY extends System {
  constructor(options = {}) {
    super(options);

    this.registry = new MainRegistry();

    this._dev = env.dev?.split(",").includes(os.userInfo().username);
  }

  initialize() {
    const resources = { path, fs, term, system: this };

    Object.entries(resources).forEach(([name, resource]) => {
      this.registry.resources.register(name, resource);
    });

    const terminal = this.registry.resources.get("term");
    const terminalHandler = this.registry.resources.register(
      "terminalHandler",
      new TerminalHandler(terminal),
    );

    terminalHandler.initializeScene();

    // soon inputhandler back
    terminal.on("key", (name, matches, data) => {
      if (name == "CTRL_C") this.shutdown();
    });

    console.log("Booting...");

    this.start();
  }

  shutdown() {
    this.registry.resources.get("terminalHandler").closeScene();

    process.exit(0);
  }
};
