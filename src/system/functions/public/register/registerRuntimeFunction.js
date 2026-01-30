module.exports = function registerRuntimeFunction({
  name,
  value,
  options = {},
}) {
  const { persistent = false, execute = false } = options;

  // if (typeof name != "string")
  //   throw new TypeError(`Expected string got ${typeof name} instead`);

  // if (typeof value != "function")
  //   throw new TypeError(`Expected function got ${typeof value} instead`);

  if (value.category && typeof value.category == "string")
    this.addToSystemEntry({
      name: value.category,
      key: name,
      value: value.export,
    });
  else this.changeSystemEntry(name, value.export);

  if (!options) options = { persistent: false, execute: false };

  this.persistentCheck({
    source: "runtime",
    type: "function",
    name: name,
    value: value.export,
    options,
  });

  if (execute) value.export.call(this);

  return this;
};
