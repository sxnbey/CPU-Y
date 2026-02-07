const specialKeys = require("./specialKeys.js");

module.exports = {
  options: { instantiate: true },
  category: "ROOT",
  type: "class",
  value: class InputHandler {
    constructor(system) {
      this._system = system;
      this._term = system.term;

      this._input = [];
      this._inputString = "";

      this._cursorPosX = null;
      this._updateCursorPosX();

      this._specialKeys = specialKeys.value;

      this._term.on("key", (key) => {
        this._onKey(key);
      });
    }

    _onKey(key) {
      if (this._specialKeys.includes(key)) return;

      if (key == "CTRL_C") {
        this._term.processExit(0);
        this._term.fullscreen(false);

        return;
      }

      if (key == "ENTER") {
        this._system.handlers.commandHandler(this._system, this._inputString);

        this._clearInput();
      } else this._addInput(key);

      this._system.RenderState.setInput(this._inputString);

      // this._term.moveTo(this._cursorPosX, this._term.height - 1);

      return;
    }

    _addInput(key) {
      this._input.push(key);
      this._inputString = this._input.join("");
    }

    _clearInput() {
      this._input = [];
      this._inputString = "";
    }

    _updateCursorPosX() {
      this._cursorPosX = Math.max(this._input.length + 5, 5);
    }

    getInput() {
      return this._inputString;
    }

    getCursorPosX() {
      return this._cursorPosX;
    }
  },
};
