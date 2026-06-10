module.exports = { dontLoad: true };

module.exports.config = {
  name: "eval",
  aliases: ["e"],
  desc: "Evaluates JavaScript-Code.",
  listed: false,
};

module.exports.run = (system, args) => {
  system.functions.cmdHeader("Evaluate JavaScript code");

  if (!args.length)
    return system.functions.log(
      `Please enter JavaScript code to be evaluated behind "${system.chalk.cyan(
        this.config.name,
      )}"!`,
      ["yellow"],
    );

  system.functions.log(
    [
      `Code to be evaluated:`,
      system.chalk.yellow(args.join(" ")),
      "Evaluation:\n",
    ].join("\n\n"),
  );

  try {
    system.functions.log(eval(args.join(" ")) || "", ["green"]);
  } catch (e) {
    system.functions.log("There was an error executing your JavaScript code:");
    console.log("\n");
    system.functions.log(e, ["red"]);
  }
};
