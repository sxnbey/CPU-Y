const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

module.exports = commandHandler;

function commandHandler(system, promptOnly = false) {
  prompt();

  if (promptOnly) return;

  rl.addListener("line", (msg) => {
    const args = msg.trim().split(" ");
    const inputCmd = args.shift();
    const command = system.commands.find(
      (i) => i.config.name == inputCmd || i.config.aliases.includes(inputCmd)
    );

    if (command) {
      command.run(system, args);

      if (!["exit"].includes(inputCmd)) {
        system.other.lastCommand = command;
        system.other.lastCommand.args = args;
      }

      system.other.onMainPage = false;
    } else {
      console.log("\n");
      console.log(
        `Command "${inputCmd}" couldn't be found.` +
          "\n" +
          'Type "help" for help.'
      );
    }

    prompt();
  });

  rl.addListener("close", () => {
    console.log("Goodbye!");

    process.exit(0);
  });
}

function prompt() {
  console.log("\n");
  rl.prompt();
}
