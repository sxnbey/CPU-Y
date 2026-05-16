module.exports = { type: "function", value: handle };

async function handle(system, msg) {
  const args = msg.trim().split(/\s+/);
  const inputCmd = args.shift();
  const command = system.commands.find(
    (i) => i.name == inputCmd || i.config.aliases.includes(inputCmd),
  );

  if (!command)
    return system.RenderState.setBody([`Command ${inputCmd} not found`]);

  await command.value(system, args);
}
