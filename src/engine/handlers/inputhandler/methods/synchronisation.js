module.exports = { dontLoad: true, value: { _clearInput, _syncInputString } };

function _clearInput() {
  this._input = [];
  this._syncInputString();

  this._cursorIndex = 0;
}

function _syncInputString() {
  this._inputString = this._input.join("");
}
