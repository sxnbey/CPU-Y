const EventEmitter = require("events");

module.exports = class BaseRegistry extends EventEmitter {
  constructor() {
    super();

    this._storage = new Map();
  }

  register(id, value) {
    this._storage.set(id, value);

    this.emit("register", id, value);

    return value;
  }

  delete(id) {
    this._storage.delete(id);

    this.emit("delete", id);

    return this;
  }

  get(id) {
    return this._storage.get(id);
  }

  has(id) {
    return this._storage.has(id);
  }
};
