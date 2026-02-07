module.exports = function registerRuntimeFunction(module) {
  if (
    module.category &&
    typeof module.category == "string" &&
    module.category != "ROOT"
  )
    this._addToSystemEntry({
      name: module.category,
      key: module.name,
      value: module.value,
    });
  else this._changeSystemEntry(module.name, module.value);

  // this._persistentCheck({
  //   source: "runtime",
  //   type: "function",
  //   name: name,
  //   module: module.value,
  //   options,
  // });

  if (module.options.execute) module.value.call(this);

  return this;
};
