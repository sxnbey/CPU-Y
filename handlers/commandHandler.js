const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

module.exports = commandHandler;

function commandHandler(system) {
  prompt();

  rl.addListener("line", (msg) => {
    const args = msg.trim().split(" ");
    const inputCmd = args.shift();
    const command = system.commands.find(
      (i) => i.config.name == inputCmd || i.config.aliases.includes(inputCmd)
    );

    if (command) command.run(system, args);
    else {
      system.functions.cpuyBanner();

      console.log(
        `Command "${inputCmd}" couldn't be found.` +
          "\n" +
          'Type "help" for help.'
      );
    }

    if (!["exit", "reload"].includes(inputCmd)) {
      system.other.lastCommand = command ? command : null;
      system.other.lastCommand.args = args;
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
