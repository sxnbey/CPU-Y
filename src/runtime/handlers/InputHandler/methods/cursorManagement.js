module.exports = {
  dontLoad: true,
  value: { _moveCursor, _recalculateCursorPosX, _resetCursorToEnd },
};

function _moveCursor(amount) {
  this._cursorIndex = this._system.utils.clamp(
    this._cursorIndex + amount,
    0,
    this._input.length,
  );
}

function _recalculateCursorPosX() {
  this._cursorPosX = Math.max(this._cursorIndex + 5, 5);
}

function _resetCursorToEnd() {
  this._cursorIndex = this._input.length;
}
