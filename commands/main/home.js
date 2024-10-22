module.exports.config = {
  name: "home",
  aliases: [],
  desc: "The home screen of CPU-Y.",
  listed: false,
};

module.exports.run = (system, args) => {
  system.functions.cpuyBanner();

  console.log("Welcome to CPU-Y!");
  console.log("\n");
  console.log(
    'If it\'s your first time using CPU-Y, type "help" for more information on how to use this program.' +
      "\n" +
      "But if you already know how it works, ignore the sentence above and just type any command you need below."
  );
};
