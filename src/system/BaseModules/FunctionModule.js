const BaseModule = require("./BaseModule.js");

module.exports = class FunctionModule extends BaseModule {
  constructor(system, file) {
    super(system, file);
  }

  register() {
    this.system.registerRuntimeFunction(this);
  }
};
