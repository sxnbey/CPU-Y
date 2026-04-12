class BaseBlueprint {
  constructor(data = {}) {
    this.id = data.id || null;
    this.type = data.type || null;

    Object.assign(this, data);
  }

  onRegister() {
    return false;
  }
}
