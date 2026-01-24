module.exports.config = {
  name: "reload",
  aliases: ["rl"],
  desc: "Reloads all modules and commands.",
  listed: false,
};

module.exports.run = async (system, args) => {
  let rngLoadingTimer = system.functions.rng(200, 1500);

  system.functions.cmdHeader("Reload");

  system.modules = {};
  system.handlers = {};
  system.commands = {};

  require("../../modules/loader.js")(system);

  console.log();

  system.functions.log(
    [
      `RNG loading timer: ${system.chalk.cyan(`${rngLoadingTimer}ms`)}`,
      system.chalk.yellow("Reloading..."),
    ].join("\n\n"),
  );

  console.log("\n");

  await system.functions.wait(rngLoadingTimer);

  system.functions.log("Reloaded all modules and commands.", ["green"]);
};
