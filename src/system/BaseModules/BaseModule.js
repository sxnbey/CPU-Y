class BaseModule {
  constructor(system, file) {
    this.system = system;

    this.file = file;

    this.name = file.name;
    this.category = file.category || null;
    this.type = file.type;
    this.value = file.value;
    this.options = file.options || {};
    this.filePath = file.path || null;
    this.id = null;
  }
}
