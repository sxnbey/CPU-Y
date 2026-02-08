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
      this._recalculateCursorPosX();

      this._specialKeys = specialKeys.value;

      this._term.on("key", (key) => {
        this._onKey(key);
      });
    }

    // FÜr die history: history array erstellen, array[0] leerer string. pfeil hoch runter index +- 1, beim tippen array[0] = array[index] und clampen. ez

    _onKey(key) {
      if (this._specialKeys.includes(key)) return;

      switch (key) {
        case "CTRL_C":
          return this._onExit();

        case "ENTER":
          this._onEnter();
          break;

        case "BACKSPACE":
          this._onBackspace();
          break;

        default:
          this._addInput(key);
      }

      this._recalculateCursorPosX();

      this._system.RenderState.setInput(this._inputString);

      this._term.moveTo(this._cursorPosX, this._term.height - 1);

      return;
    }

    _onExit() {
      this._term.processExit(0);
      this._term.fullscreen(false);
    }

    _onEnter() {
      this._system.handlers.commandHandler(this._system, this._inputString);

      this._clearInput();
    }

    _onBackspace() {
      this._input.pop();
      this._syncInputString();
    }

    _addInput(key) {
      this._input.push(key);
      this._syncInputString();
    }

    _clearInput() {
      this._input = [];
      this._syncInputString();
    }

    _syncInputString() {
      this._inputString = this._input.join("");
    }

    _recalculateCursorPosX() {
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
