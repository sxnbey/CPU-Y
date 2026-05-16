const EventEmitter = require("events");

module.exports = {
  options: { instantiate: true },
  category: "ROOT",
  type: "class",
  value: class RenderState extends EventEmitter {
    constructor() {
      super();

      this._needsRender = false;

      this._elements = [];
    }

    _initializeScene() {}

    addElement(element) {
      this._elements.push(element);

      this._needsRender = true;

      this.emit("elementAdded", element);
    }
  },
};
