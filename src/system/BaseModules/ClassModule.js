const BaseModule = require("./BaseModule");

module.exports = class ClassModule extends BaseModule {
  constructor(system, file) {
    super(system, file);

    this.options = {
      persistent: file.options.persistent ?? false,
      instantiate: file.options.execute ?? false,
    };
  }

  register() {
    this.system._registerClass(this);
  }
};
