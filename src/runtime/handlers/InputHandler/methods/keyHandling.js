module.exports = {
  dontLoad: true,
  value: { _onExit, _onEnter, _onBackspace, _addInput },
};

function _onExit() {
  this._term.processExit(0);
  this._term.fullscreen(false);
}

function _onEnter() {
  this._system.handlers.commandHandler(this._system, this._inputString);

  if (this._inputString.trim() != "")
    this._commandHistory.push(this._inputString);

  this._clearInput();
}

function _onBackspace() {
  if (this._cursorIndex > 0) {
    this._input.splice(this._cursorIndex - 1, 1);
    this._cursorIndex--;

    this._syncInputString();
  }
}

function _addInput(key) {
  this._historyIndex = 0;

  this._input.splice(this._cursorIndex, 0, key);
  this._syncInputString();

  this._cursorIndex++;
}
