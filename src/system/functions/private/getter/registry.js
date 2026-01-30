module.exports = { _getSystemEntry };

function _getSystemEntry(name) {
  return this[name];
}
