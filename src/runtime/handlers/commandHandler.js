module.exports = { type: "function", value: handle };

async function handle(system, msg) {
  const args = msg.trim().split(/\s+/);
  const inputCmd = args.shift();
  const command = system.commands.find(
    (i) => i.name == inputCmd || i.config.aliases.includes(inputCmd),
  );

  // Runs the command if it exists and if the user is allowed to use it. If he's not, he will be gaslit into thinking the command doesn't exist.

  if (command && (system.dev || command.config.category != "Developer")) {
    await command.value(system, args);

    //   if (!["exit"].includes(inputCmd)) {
    //     system.other.lastCommand.name = command.name;
    //     system.other.lastCommand.args = args;
    //   }
    // } else {
  }
}
