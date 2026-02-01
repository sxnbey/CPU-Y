module.exports = function _registerClass(module) {
  // if (typeof name != "string")
  //   throw new TypeError(`Expected string got ${typeof name} instead`);

  // if (typeof value != "function")
  //   throw new TypeError(`Expected function got ${typeof value} instead`);

  const instance = module.options.instantiate
    ? new module.value(this)
    : module.value;

  if (module.category && typeof module.category == "string")
    this._addToSystemEntry({
      name: module.category,
      key: module.name,
      value: instance,
    });
  else this._changeSystemEntry(module.name, instance);

  // this._persistentCheck({
  //   source: "runtime",
  //   type: "class",
  //   name: name,
  //   value: value.value,
  //   options,
  // });

  return this;
};
