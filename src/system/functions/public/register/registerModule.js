const { validate } = require("../../../contracts/moduleContract.js");

const FunctionModule = require("../../../BaseModules/FunctionModule.js");

module.exports = function registerModule(module) {
  console.log("triggered");

  validate(module);

  switch (module.type) {
    case "function":
      new FunctionModule(this, module).register();
  }

  return this;
};
