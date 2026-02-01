const BaseModule = require("./BaseModule");

module.exports = class ClassModule extends BaseModule {
  constructor(system, file) {
    super(system, file);
  }

  register() {
    this.system._registerClass(this);
  }
};
