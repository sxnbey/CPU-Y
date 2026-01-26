/************************************************************************************************\
*                                   DECLARATION, IM- & EXPORTS                                   *
\************************************************************************************************/

const fs = require("fs");
const dirs = ["modules", "handlers"];
const commandDirs = ["commands", "subcommands"];
const blacklist = ["loader.js"];

module.exports = loadAll;

/************************************************************************************************\
*                                              MAIN                                              *
\************************************************************************************************/

function loadAll(system) {
  commandDirs.forEach((dir) => {
    system[dir] = [];

    loadCommands(system, system[dir], `./${dir}/`);

    loadLog(system, dir, system[dir].length);
  });

  dirs.forEach((dir) => {
    let count = 0;

    system[dir] = {};

    fs.readdirSync(`./${dir}/`).forEach((i) => {
      if (blacklist.includes(i)) return;

      count++;

      // Deletes the cache of the file (for hot reloading).

      delete require.cache[require.resolve(`../${dir}/${i}`)];

      // After iterating through the directory, it runs the file and saves it.

      const file = require(`../${dir}/${i}`);

      file(system);

      system[dir][i.split(".")[0]] = file;
    });

    loadLog(system, dir.charAt(0).toUpperCase() + dir.slice(1), count);
  });
}

function loadLog(system, text, count) {
  let label = text.charAt(0).toUpperCase() + text.slice(1);

  if (count == 1) label = label.slice(0, -1);

  system.other.bootLog.push(
    `${system.chalk.green(count)} ${
      label
    } loaded. ${system.chalk.green("[+]")}`,
  );
}

function loadCommands(system, arr, dirPath) {
  // Iterates through the directory and if there is a folder, it iterates through said folder.

  fs.readdirSync(dirPath).forEach((i) => {
    if (!i.endsWith(".js"))
      return loadCommands(system, arr, `${dirPath}/${i}/`);

    delete require.cache[require.resolve(`../${dirPath}${i}`)];

    // If it's a file, it will be pushed into the commands array.

    const command = require(`../${dirPath}${i}`);
    const folder = dirPath
      .split("/")
      .slice(2)
      .join("/")
      .replace(/^\/+|\/+$/g, "");

    arr.push({
      config: {
        ...command.config,
        category: folder,
      },
      run: command.run,
    });
  });
}
