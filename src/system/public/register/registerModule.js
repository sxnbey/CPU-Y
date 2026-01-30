module.exports = function registerModule({ moduleName, module, options = {} }) {
  const { persistent = false, execute = false, instantiate = false } = options;

  // For error check in each function

  moduleName = moduleName || null;
  module = module || null;

  const types = {
    function: () =>
      this.registerRuntimeFunction({
        name: moduleName,
        value: module,
        options: { persistent, execute },
      }),
    class: () =>
      this.registerClass({
        name: moduleName,
        value: module,
        options: { persistent, instantiate },
      }),
    command: () =>
      this.registerCommand({
        value: module,
        options: { persistent },
      }),
    util: () =>
      this.registerUtil({
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
