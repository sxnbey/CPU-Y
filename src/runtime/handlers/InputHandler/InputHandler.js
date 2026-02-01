const specialKeys = require("./specialKeys.js");

module.exports = {
  options: { instantiate: true },
  type: "class",
  value: class InputHandler {
    constructor(system) {
      this.system = system;

      this.input = [];

      this.system.term.on("key", (e) => {
        this._onKey(e);
      });
    }

    _onKey(key) {
      this.input.push(key);

      console.log(this.input.join(""));

      return;
    }
  },
};
