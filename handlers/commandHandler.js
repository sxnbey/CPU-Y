/************************************************************************************************\
*                                   DECLARATION, IM- & EXPORTS                                   *
\************************************************************************************************/

// Imports readline and creates a readline interface so I can interact with responses in the console.

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

module.exports = commandHandler;

/************************************************************************************************\
*                                              MAIN                                              *
\************************************************************************************************/

function commandHandler(system, promptOnly = false) {
  prompt();

  if (promptOnly) return;

  // Triggers whenever a line has been entered in the console.

  rl.addListener("line", (msg) => {
    const args = msg.trim().split(" ");
    const inputCmd = args.shift();
    const command = system.commands.find(
      (i) => i.config.name == inputCmd || i.config.aliases.includes(inputCmd)
    );

    if (!system.other.commandsBlockedByError.includes(command.name))
      if (command && (system.dev || command.config.category != "Developer")) {
        command.run(system, args);

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
            `\nType "${system.chalk.cyan("help")}" for help.`
        );
      }
    else {
      system.functions.log(
        `Command "${system.chalk.yellow(
          inputCmd
        )}" couldn't be executed because of an error.`
      );
    }

    prompt();
  });

  // Triggers on CTRL + C.

  rl.addListener("close", () => {
    system.functions.log("Goodbye!", ["green", "underline"]);

    process.exit(0);
  });
}

// This function creates the "> " in the console.

function prompt() {
  console.log("\n");
  rl.prompt();
}
