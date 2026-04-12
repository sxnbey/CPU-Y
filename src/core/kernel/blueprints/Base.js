class BaseBlueprint {
  constructor(data = {}) {
    this.id = data.id || null;
    this.type = data.type || null;
  }

  onRegister() {
    return false;
  }
}
