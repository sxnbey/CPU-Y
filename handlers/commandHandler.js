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

    let command = args.shift();
    command = system.commands.find(
      (i) => i.config.name == command || i.config.aliases.includes(command)
    );
    command.run(system, args);

    prompt();
  });

  rl.addListener("close", () => {
    console.log("Exiting...");
    process.exit(0);
  });
}

function prompt() {
  console.log("\n");
  rl.prompt();
}
