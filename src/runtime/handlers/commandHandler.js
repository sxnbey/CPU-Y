module.exports = { dontLoad: true };

exports = (system) => {
  return;

  system.rl.addListener("line", async (msg) => {
    const args = msg.trim().split(/\s+/);
    const inputCmd = args.shift();
    const command = system.commands.find(
      (i) => i.config.name == inputCmd || i.config.aliases.includes(inputCmd),
    );

    // Runs the command if it exists and if the user is allowed to use it. If he's not, he will be gaslit into thinking the command doesn't exist.

    if (command && (system.dev || command.config.category != "Developer")) {
      await command.run(system, args);

      //? Still necessary? Soon check

      if (!["exit"].includes(inputCmd)) {
        system.other.lastCommand.name = command.name;
        system.other.lastCommand.args = args;
      }
    } else {
      console.log("\n");
      system.functions.log(
        (inputCmd.length
          ? `Command "${system.chalk.yellow(inputCmd)}" couldn't be found.`
          : "Please enter a command.") +
          `\nType "${system.chalk.cyan("help")}" for help.`,
      );
    }
  });

  // Triggers on CTRL + C.

  system.rl.addListener("close", () => {
    system.functions.log("Goodbye!", ["green", "underline"]);

    process.exit(0);
  });
};
