module.exports = function registerModule({ moduleName, module, options = {} }) {
  const { persistent = false, execute = false, instantiate = false } = options;

  // For error check in each function

  moduleName = moduleName || null;
  module = module || null;

  const types = {
    function: () =>
      this._registerRuntimeFunction({
        name: moduleName,
        value: module,
        options: { persistent, execute },
      }),
    class: () =>
      this._registerClass({
        name: moduleName,
        value: module,
        options: { persistent, instantiate },
      }),
    command: () =>
      this._registerCommand({
        value: module,
        options: { persistent },
      }),
    util: () =>
      this._registerUtil({
        name: moduleName,
        value: module,
        options: { persistent },
      }),
  };

  if (!types[module.type])
    throw new TypeError(
      'No file type - module.type "string" needed (function, class, command, util)\n' +
        module.filePath || "",
    );

  types[module.type]();

  return this;
};
