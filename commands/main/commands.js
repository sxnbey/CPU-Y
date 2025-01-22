module.exports.config = {
  name: "commands",
  aliases: ["cmds"],
  desc: "Shows you all commands.",
  listed: true,
};

module.exports.run = (system, args) => {
  system.functions.cmdHeader("Commands");

  system.functions.log(
    `To get more information on a command, type the name of it behind "${system.chalk.cyan(
      "commands"
    )}".\n`
  );

  const toSort = system.commands.filter((i) => i.config.listed);
  const sorted = toSort.reduce((acc, cmd) => {
    const cat = cmd.config.category;
    if (!acc[cat]) acc[cat] = [];

    acc[cat].push(cmd.config.name);

    return acc;
  }, {});
  const sortedString = Object.entries(sorted)
    .map(([cat, cmds]) =>
      [
        `${cat.charAt(0).toUpperCase() + cat.slice(1)}:`,
        `- ${cmds.join("\n- ")}`,
      ].join("\n")
    )
    .join("\n\n");

  console.log(sortedString);
};
