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
  }

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

  _createAliases() {}

  start() {
    console.log("hello!");
  }
};
