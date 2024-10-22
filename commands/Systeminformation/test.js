module.exports.config = {
  name: "test",
  aliases: [],
  desc: "test",
  listed: true,
};

module.exports.run = (system, args) => {
  system.functions.cpuyBanner();

  system.functions.log("Hello and thank you for using CPU-Y!");
  console.log("\n");
  system.functions.log(
    "To get you started, there are a few things you need to know first:"
  );
  console.log("\n");
  system.functions.log(
    "- Keep this window at least 47 characters (the width of the CPU-Y banner) wide." +
      "\n" +
      "  But it's recommended to always keep it as wide as the visible text for CPU-Y to work as intended." +
      "\n" +
      '- All commands can be viewed with "commands".' +
      "\n" +
      '- To properly close CPU-Y, use CTRL + C or type "exit".' +
      "\n" +
      "- Commands have to be used like this:" +
      "\n" +
      "  {COMMAND} [ARGUMENTS]" +
      "\n" +
      "  {} => necessary - [] => optional"
  );
};
