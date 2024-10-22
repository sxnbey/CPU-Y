module.exports.config = {
  name: "exit",
  aliases: [],
  desc: "Exits CPU-Y.",
  listed: true,
};

module.exports.run = async (system, args) => {
  console.log("\n");
  system.functions.log("Goodbye!", ["green", "underline"]);

  process.exit(0);
};
