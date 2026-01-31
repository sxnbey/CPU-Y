const BaseModule = require("./BaseModule.js");

module.exports = class FunctionModule extends BaseModule {
  constructor(system, file) {
    super(system, file);

    this.options = {
      persistent: file.options.persistent ?? false,
      execute: file.options.execute ?? false,
    };
  }

  register() {
    this.system._registerRuntimeFunction(this);
  }
};
