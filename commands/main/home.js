module.exports.config = {
  name: "home",
  aliases: [],
  desc: "The home screen of CPU-Y.",
  listed: true,
};

module.exports.run = (system, args) => {
  system.functions.cmdHeader("Welcome!");
  system.functions.log(
    `If it\`s your first time using CPU-Y, type "${system.chalk.cyan(
      "help"
    )}" for more information on how to use this program.`
  );
  system.functions.log(
    "But if you already know how it works, ignore the sentence above and just type any command you need below."
  );
};
