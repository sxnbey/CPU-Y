module.exports = { _changeSystemEntry, _addToSystemEntry, _pushToSystemArray };

function _changeSystemEntry(name, value = {}) {
  this[name] = value;

  return this;
}

function _addToSystemEntry({ name, key, value }) {
  if (!this[name]) this[name] = {};

  this[name][key] = value;

  return this;
}

function _pushToSystemArray(name, value) {
  this[name].push(value);

  return this;
}
