module.exports = {
  dontLoad: true,
  value: { _moveHistory, _syncInputWithCommandHistory },
};

function _moveHistory(amount) {
  this._historyIndex = this._system.utils.clamp(
    this._historyIndex + amount,
    0,
    this._commandHistory.length - 1,
  );

  this._syncInputWithCommandHistory();
}

function _syncInputWithCommandHistory() {
  this._input = [...this._commandHistory[this._historyIndex]];
  this._syncInputString();

  this._cursorIndex = this._input.length;
}
