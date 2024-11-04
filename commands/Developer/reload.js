module.exports.config = {
  name: "reload",
  aliases: ["rl"],
  desc: "Reloads all modules and commands.",
  listed: false,
};

module.exports.run = async (system, args) => {
  system.functions.cmdHeader("Reload");

  system.modules = {};
  system.handlers = {};
  system.commands = {};

  require("../../modules/loader.js")(system);

  console.log("\n");

  system.functions.log("Reloading...", ["yellow"]);

  await system.functions.wait(1500);

  system.modules.createMainPage(system);

  system.functions.reload();
};
