const { validate } = require("../../../contracts/moduleContract.js");

const FunctionModule = require("../../../BaseModules/FunctionModule.js");
const ClassModule = require("../../../BaseModules/ClassModule.js");
const CommandModule = require("../../../BaseModules/CommandModule.js");

module.exports = function registerModule(module) {
  validate(module);

  switch (module.type) {
    case "function":
      new FunctionModule(this, module).register();
      break;
    case "class":
      new ClassModule(this, module).register();
      break;
    case "command":
      new CommandModule(this, module).register();
      break;
    default:
      throw new TypeError(
        `Unknown file type: ${module.type}${module.path ? `\n${module.path}` : ""}`,
      );
  }
};
