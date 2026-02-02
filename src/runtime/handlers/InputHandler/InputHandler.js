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
      if (key == "CTRL_C") {
        this.system.term.processExit(0);
        this.system.term.fullscreen(false);

        return;
      }

      if (key == "ENTER")
        return this.system.handlers.commandHandler(
          this.system,
          this.system.RenderState.getInput(),
        );

      this.input.push(key);

      this.system.RenderState.setInput(this.input);

      return;
    }
  },
};
