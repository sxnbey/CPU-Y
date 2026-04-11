module.exports = class TerminalHandler {
  constructor(term) {
    this._term = term;
  }

  _executeTermActions(actions) {
    actions.forEach((action) => {
      const args = action.args || [];

      this._term[action.func](...args);
    });
  }

  initializeScene() {
    this._executeTermActions([
      { func: "clear" },
      { func: "grabInput" },
      { func: "grabInput", args: [{ mouse: "button" }] },
      { func: "fullscreen", args: [true] },
    ]);
  }

  closeScene() {
    this._executeTermActions([
      { func: "grabInput", args: [false] },
      { func: "fullscreen", args: [false] },
      { func: "hideCursor", args: [false] },
    ]);
  }
};
