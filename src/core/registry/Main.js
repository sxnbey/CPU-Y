const BaseRegistry = require("./Base.js");

const registries = {
  actors: require("./Actors.js"),
  blueprints: require("./Blueprints.js"),
  resources: require("./Resources.js"),
  config: require("./Config.js"),
};

module.exports = class MainRegistry extends BaseRegistry {
  constructor() {
    super();

    this._initialize();
  }

  _initialize() {
    Object.entries(registries).forEach(([key, Registry]) => {
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
