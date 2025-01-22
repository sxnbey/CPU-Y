/************************************************************************************************\
*                                   DECLARATION, IM- & EXPORTS                                   *
\************************************************************************************************/

module.exports = commandHandler;

/************************************************************************************************\
*                                              MAIN                                              *
\************************************************************************************************/

function commandHandler(system, promptOnly = false) {
  // Imports readline and creates a readline interface so I can interact with responses in the console.

  const readline = require("readline");

  system.rl =
    system.rl ??
    readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "> ",
    });

  prompt();

  if (promptOnly) return;

  // Triggers whenever a line has been entered in the console.

  system.rl.addListener("line", (msg) => {
    const args = msg.trim().split(" ");
    const inputCmd = args.shift();
    const command = system.commands.find(
      (i) => i.config.name == inputCmd || i.config.aliases.includes(inputCmd)
    );

    if (
      command &&
      (system.dev || command.config.category != "Developer") &&
      !system.other.catsBlockedByError.includes(command.config.category)
    ) {
      try {
        command.run(system, args);
      } catch (e) {
        // error catch (soon)
      }

      if (!["exit"].includes(inputCmd)) {
        system.other.lastCommand = command;
        system.other.lastCommand.args = args;
      }
    } else {
      console.log("\n");
      system.functions.log(
        (!inputCmd.length
          ? "Please enter a command."
          : system.other.catsBlockedByError.includes(command?.config.category)
          ? `Command "${system.chalk.yellow(
              command.config.name
            )}" couldn't be executed because of an error.`
          : `Command "${system.chalk.yellow(inputCmd)}" couldn't be found.`) +
          `\nType "${system.chalk.cyan("help")}" for help.`
      );
    }

    prompt();
  });

  // Triggers on CTRL + C.

  system.rl.addListener("close", () => {
    system.functions.log("Goodbye!", ["green", "underline"]);

    process.exit(0);
  });

  // This function creates the "> " in the console.

  function prompt() {
    console.log("\n");
    system.rl.prompt();
  }
}
