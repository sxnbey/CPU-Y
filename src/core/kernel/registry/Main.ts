const BaseRegistry = require("../blueprints/registry/Registry.js");

module.exports = class MainRegistry extends BaseRegistry {
  constructor() {
    super();

    this._initialize();
  }

  _initialize() {
    Object.entries(kernelRegistries).forEach(([key, Registry]) => {
      const instance = new Registry();

      this.register(key, instance);

      Object.defineProperty(this, key, {
        get: function () {
          return this.get(key);
        },
        enumerable: true,
        configurable: false,
      });
    });
  }
};
