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

  rl.addListener("line", async (msg) => {
    const args = msg.trim().split(" ");
    const inputCmd = args.shift();
    const command = system.commands.find(
      (i) => i.config.name == inputCmd || i.config.aliases.includes(inputCmd),
    );

    // Runs the command if it exists and if the user is allowed to use it. If he's not, he will be gaslit into thinking the command doesn't exist.

    if (command && (system.dev || command.config.category != "Developer")) {
      await command.run(system, args);
      prompt();

      if (!["exit"].includes(inputCmd)) {
        system.other.lastCommand = command;
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
      prompt();
    }
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
