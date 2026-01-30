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
      customPaths: [],
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
    if (typeof name != "string")
      throw new TypeError(`Expected string got ${typeof name} instead`);

    if (typeof value != "object")
      throw new TypeError(`Expected object got ${typeof value} instead`);

    this[name] = value;

    return this;
  }

  addToSystemEntry({ name, key, value }) {
    if (typeof name != "string")
      throw new TypeError(`Expected string got ${typeof name} instead`);

    if (typeof key != "string")
      throw new TypeError(`Expected string got ${typeof key} instead`);

    if (typeof value != "object")
      throw new TypeError(`Expected object got ${typeof value} instead`);

    if (!this[name]) this[name] = {};

    this[name][key] = value;

    return this;
  }

  registerModule({
    moduleName,
    module,
    options: { persistent = false, execute = false, instantiate = false },
  }) {
    const category = module.category || null;

    // For error check in each function

    moduleName = moduleName || null;
    module = module || null;

    const types = {
      function: () =>
        this.registerRuntimeFunction({
          name: moduleName,
          category: category,
          value: module,
          options: { persistent, execute },
        }),
      class: () =>
        this.registerClass({
          name: moduleName,
          category: module.category,
          value: module,
          options: { persistent, instantiate },
        }),
      command: () =>
        this.registerCommand({
          category: module.config?.category,
          value: module,
          options: { persistent },
        }),
      util: () =>
        this.registerUtil({
          name: moduleName,
          value: module,
          options: { persistent },
        }),
    };

    if (!types[module.type])
      throw new TypeError(
        'No file type - module.type "string" needed (function, class, command, util)\n' +
          module.filePath || "",
      );

    types[module.type]();

    return this;
  }

  registerRuntimeFunction({
    name,
    value,
    options: { persistent = false, execute = false },
  }) {
    if (typeof name != "string")
      throw new TypeError(`Expected string got ${typeof name} instead`);

    if (typeof value != "function")
      throw new TypeError(`Expected function got ${typeof value} instead`);

    if (value.category && typeof value.category == "string")
      this.addToSystemEntry({ name: value.category, key: name, value });
    else this.changeSystemEntry(name, value);

    this.persistentCheck({
      source: "runtime",
      type: "function",
      name: name,
      category: value.category || null,
      value,
      options,
    });

    if (execute) value.call(this);

    return this;
  }

  registerClass({
    name,
    value,
    options: { persistent = false, instantiate = false },
  }) {
    if (typeof name != "string")
      throw new TypeError(`Expected string got ${typeof name} instead`);

    if (typeof value != "function")
      throw new TypeError(`Expected function got ${typeof value} instead`);

    const instance = instantiate ? new value(this) : value;

    if (instance.category && typeof instance.category == "string")
      this.addToSystemEntry({
        name: instance.category,
        key: name,
        value: instance,
      });
    else this.changeSystemEntry(name, instance);

    this.persistentCheck({
      source: "runtime",
      type: "class",
      name: name,
      category: value.category || null,
      value,
      options,
    });

    return this;
  }

  persistentCheck(value) {
    // ID gen and check soon cuz not every value has a category

    const exists = this.survivesHotReload.some(
      (i) => i.name == value.name && i.category == value.category,
    );

    if (!exists) this.survivesHotReload.push(value);

    return exists;
  }

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

  addCommand() {}

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

    if (this.config.customPaths.length)
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
