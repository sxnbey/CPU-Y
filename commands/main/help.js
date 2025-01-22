module.exports.config = {
  name: "help",
  aliases: ["h"],
  desc: "A few important things you need to know before using CPU-Y.",
  listed: true,
};

module.exports.run = (system, args) => {
  system.functions.cmdHeader("Hello and thank you for using me!");
  system.functions.log(
    "To get you started, there are a few things you need to know first:"
  );
  console.log("\n");
  system.functions.log(
    [
      `- Keep this window at least ${system.chalk.yellow(
        "47"
      )} characters (the width of the CPU-Y banner) wide.`,
      "  But it's recommended to always keep it as wide as the visible text for CPU-Y to work as intended.",
      `- All commands can be viewed with "${system.chalk.cyan("commands")}".`,
      `- To properly close CPU-Y, use CTRL + C or type "${system.chalk.cyan(
        "bye"
      )}".`,
      "- Commands have to be used like this:",
      `  > ${system.chalk.cyan("COMMAND")} ${system.chalk.blue("ARGUMENTS")}`,
      "       ^        ^",
      "   necessary optional",
    ].join("\n")
  );
};
