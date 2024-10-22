module.exports.config = {
  name: "help",
  aliases: [],
  desc: "A few important things you need to know before using CPU-Y.",
  listed: true,
  category: "Main",
};

module.exports.run = (system, args) => {
  system.functions.cpuyBanner();

  console.log("Hello and thank you for using CPU-Y!");
  console.log("\n");
  console.log(
    "To get you started, there are a few things you need to know first:"
  );
  console.log("\n");
  console.log(
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
