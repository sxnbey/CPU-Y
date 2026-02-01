module.exports = class BaseModule {
  constructor(system, file) {
    this.system = system;

    this.file = file;

    this.name = file.name;
    this.category = file.category || null;
    this.type = file.type;
    this.value = file.value;
    this.filePath = file.path || null;
    this.Id = "FFgAAOe";

    this.options = this._normalizeOptions(file.options);
  }

  _normalizeOptions(options) {
    return {
      persistent: options?.persistent || false,
      execute: options?.execute || false,
      instantiate: options?.instantiate || false,
    };
  }
};
