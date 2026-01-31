const BaseModule = require("./BaseModule");

module.exports = class FunctionModule extends BaseModule {
  constructor(system, file) {
    super(system, file);
  }

  register() {
    this.system._registerRuntimeFunction({
      name: this.name,
      value: this.value,
      options: {
        persistent: this.options.persistent || false,
        execute: this.options.execute || false,
      },
    });
  }
};
