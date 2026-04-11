const BaseRegistry = require("./Base.js");

const ActorRegistry = require("./Actors.js");
const BlueprintRegistry = require("./Blueprints.js");
const ResourceRegistry = require("./Resources.js");

module.exports = class MainRegistry extends BaseRegistry {
  constructor() {
    super();

    this.register("actors", new ActorRegistry());
    this.register("blueprints", new BlueprintRegistry());
    this.register("resources", new ResourceRegistry());
  }

  get actors() {
    return this.get("actors");
  }

  get blueprints() {
    return this.get("blueprints");
  }

  get resources() {
    return this.get("resources");
  }
};
