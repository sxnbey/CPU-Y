const cursorManagement = require("./methods/cursorManagement.js").value;
const commandHistory = require("./methods/commandHistory.js").value;
const keyHandling = require("./methods/keyHandling.js").value;
const synchronisation = require("./methods/synchronisation.js").value;

module.exports = {
  options: { instantiate: true },
  category: "ROOT",
  type: "class",
  value: class InputHandler {
    constructor(system) {
      this._system = system;
      this._term = system.term;

      this._system.bindFunctions(
        {
          ...cursorManagement,
          ...commandHistory,
          ...keyHandling,
          ...synchronisation,
        },
        this,
      );

      this._input = [];
      this._inputString = "";

      this._commandHistory = [""];
      this._historyIndex = 0;

      this._cursorIndex = 0;
      this._cursorPosX = null;
      this._recalculateCursorPosX();

      this._term.on("key", (key, matches, data) => {
        this._onKey(key, data);
      });
    }

    _onKey(key, data) {
      const keys = {
        CTRL_C: () => this._onExit(),
        ENTER: () => this._onEnter(),
        BACKSPACE: () => this._onBackspace(),
        UP: () => this._moveHistory(1),
        DOWN: () => this._moveHistory(-1),
        LEFT: () => this._moveCursor(-1),
        RIGHT: () => this._moveCursor(1),
      };

      if (keys[key]) keys[key]();
      else if (data.isCharacter) this._addInput(key);
      else return;

      this._recalculateCursorPosX();

      this._system.RenderState.setInput(this._inputString);

      this._term.moveTo(this._cursorPosX, this._term.height - 1);
    }

    getInput() {
      return this._inputString;
    }

    getCursorPosX() {
      return this._cursorPosX;
    }
  },
};
