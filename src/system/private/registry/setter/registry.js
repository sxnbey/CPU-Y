module.exports = { changeSystemEntry, addToSystemEntry, pushToSystemArray };

function changeSystemEntry(name, value = {}) {
  this[name] = value;

  return this;
}

function addToSystemEntry({ name, key, value }) {
  if (!this[name]) this[name] = {};

  this[name][key] = value;

  return this;
}

function pushToSystemArray(name, value) {
  this[name].push(value);

  return this;
}
