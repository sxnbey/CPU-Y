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

      this._commandHistory = ["", "history1", "history2"];
      this._historyIndex = 0;

      this._cursorPosX = null;
      this._recalculateCursorPosX();

      this._specialKeys = specialKeys.value;

      this._term.on("key", (key) => {
        this._onKey(key);
      });
    }

    _onKey(key) {
      switch (key) {
        case "CTRL_C":
          return this._onExit();

        case "ENTER":
          this._onEnter();
          break;

        case "BACKSPACE":
          this._onBackspace();
          break;

        case "UP":
          this._historyIndex++;

          this._syncInputAndCommandHistory();
          break;

        case "DOWN":
          this._historyIndex--;

          this._syncInputAndCommandHistory();
          break;

        default:
          if (!this._specialKeys.includes(key)) this._addInput(key);
      }

      this._recalculateCursorPosX();

      this._system.RenderState.setInput(this._inputString);

      this._term.moveTo(this._cursorPosX, this._term.height - 1);

      return;
    }

    // Alles hier drunter wird ausgelagert

    _onExit() {
      this._term.processExit(0);
      this._term.fullscreen(false);
    }

    _onEnter() {
      this._system.handlers.commandHandler(this._system, this._inputString);

      if (this._inputString.trim() != "")
        this._commandHistory.push(this._inputString);

      this._clearInput();
    }

    _onBackspace() {
      this._input.pop();
      this._syncInputString();
    }

    _addInput(key) {
      this._historyIndex = 0;

      this._input.push(key);
      this._syncInputString();
    }

    _clearInput() {
      this._input = [];
      this._syncInputString();
    }

    _syncInputAndCommandHistory() {
      this._input = [...this._commandHistory[this._historyIndex]];
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
