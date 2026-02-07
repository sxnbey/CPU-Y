const BaseModule = require("./BaseModule.js");

module.exports = class CommandModule extends BaseModule {
  constructor(system, file) {
    super(system, file);
  }

  register() {
    this.system.registerCommand(this);
  }
};
