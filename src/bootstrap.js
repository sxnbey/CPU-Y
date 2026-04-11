const System = require("./core/System");
const MainRegistry = require("./core/registry/Main.js");

const path = require("path");
const fs = require("fs");
const term = require("terminal-kit").terminal;

require("dotenv").config();
const env = process.env;
const os = require("os");

class CPUY extends System {
  constructor(options = {}) {
    super(options);

    this.Registry = new MainRegistry();

    this._dev = env.dev?.split(",").includes(os.userInfo().username);
  }

  initialize() {
    const resources = { path, fs, term, system: this };

    Object.entries(resources).forEach(([name, resource]) => {
      this.Registry.resources.register(name, resource);
    });

    const terminal = this.Registry.resources.get("term");

    [
      { func: "clear" },
      { func: "grabInput" },
      { func: "grabInput", args: [{ mouse: "button" }] },
      { func: "fullscreen", args: [true] },
    ].forEach((action) => {
      const args = action.args || [];

      terminal[action.func](...args);
    });

    console.log("Booting...");
  }
}

module.exports = CPUY;
