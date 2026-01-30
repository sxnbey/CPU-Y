module.exports = function registerClass({ name, value, options = {} }) {
  const { persistent = false, instantiate = false } = options;

  // if (typeof name != "string")
  //   throw new TypeError(`Expected string got ${typeof name} instead`);

  // if (typeof value != "function")
  //   throw new TypeError(`Expected function got ${typeof value} instead`);

  const instance = instantiate ? new value.export(this) : value.export;

  if (instance.category && typeof instance.category == "string")
    this.addToSystemEntry({
      name: instance.category,
      key: name,
      value: instance,
    });
  else this.changeSystemEntry(name, instance);

  this.persistentCheck({
    source: "runtime",
    type: "class",
    name: name,
    value: value.export,
    options,
  });

  return this;
};
