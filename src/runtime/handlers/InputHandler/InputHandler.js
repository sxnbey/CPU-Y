const specialKeys = require("./specialKeys.js");

module.exports = {
  options: { instantiate: true },
  type: "class",
  value: class InputHandler {
    constructor(system) {
      this.system = system;

      this.input = [];
      this.inputString = "";

      this.specialKeys = specialKeys.value;

      this.system.term.on("key", (key) => {
        this._onKey(key);
      });
    }

    _onKey(key) {
      if (this.specialKeys.includes(key)) return;

      if (key == "CTRL_C") {
        this.system.term.processExit(0);
        this.system.term.fullscreen(false);

        return;
      }

      if (key == "ENTER") {
        this.system.handlers.commandHandler(this.system, this.inputString);

        this._clearInput();
      } else this.input.push(key);

      this.system.RenderState.setInput(this.input);

      return;
    }

    _addInput(key) {}

    _clearInput() {
      this.input = [];
      this.inputString = "";
    }
  },
};
