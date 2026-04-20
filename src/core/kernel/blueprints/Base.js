module.exports = class BaseBlueprint {
  static id = "baseblueprint";
  static type = "blueprint";
  static contract = "basecontract";
  static registry = "blueprints";

  static system = null;

  constructor(data = {}) {
    this.id = data.id || null;
    this.type = data.type || null;
    this.contract = data.contract || null;
    this.registry = data.registry || null;

    this._registerMyself();
  }

  _registerMyself() {
    // this.constructor.system.registry.blueprints.register(
    //   this.constructor.id,
    //   this.constructor,
    // );

    this.onRegister();
  }

  onRegister() {
    return false;
  }
};
