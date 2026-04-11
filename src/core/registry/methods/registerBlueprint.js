const { validate } = require("../../../contracts/roleContract.js");

const FunctionRole = require("../../../blueprints/roles/Function.js");
const ClassRole = require("../../../blueprints/roles/Class.js");
const CommandRole = require("../../../blueprints/roles/Command.js");

module.exports = function registerBlueprint(blueprint) {
  validate(blueprint);

  const handlers = {
    function: () => new FunctionRole(this, blueprint).register(),
    class: () => new ClassRole(this, blueprint).register(),
    command: () => new CommandRole(this, blueprint).register(),
  };

  const run = handlers[blueprint.type];

  if (!run) {
    throw new TypeError(
      `Unknown file type: ${blueprint.type}${blueprint.path ? `\n${blueprint.path}` : ""}`,
    );
  }

  run();
};
