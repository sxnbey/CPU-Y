class BaseBlueprint {
  static id = "baseblueprint";
  static type = "blueprint";
  static contract = "basecontract";
  static registry = "blueprints";

  static system = null;

  constructor(data = {}) {
    Object.assign(this, data);

    this.id = data.id || null;
    this.type = data.type || null;
    this.contract = data.contract || null;
    this.registry = data.registry || null;
  }

  onRegister() {
    return false;
  }
}
