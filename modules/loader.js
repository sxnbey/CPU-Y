/************************************************************************************************\
*                                   DECLARATION, IM- & EXPORTS                                   *
\************************************************************************************************/

const fs = require("fs");

module.exports = loadAll;

/************************************************************************************************\
*                                              MAIN                                              *
\************************************************************************************************/

function loadAll(system) {
  const dirs = ["modules", "handlers"];
  const commandDirs = ["commands", "subcommands"];

  commandDirs.forEach((dir) => {
    system[dir] = [];

    loadCommands(system, system[dir], `./${dir}/`);

    loadLog(system, dir, system[dir].length);
  });

  dirs.forEach((dir) => {
    const key = dir;
    let count = 0;

    system[key] = {};

    fs.readdirSync(`./${dir}/`).forEach((i) => {
      count++;

      // Deletes the cache of the file (for hot reloading).

      delete require.cache[require.resolve(`../${dir}/${i}`)];

      // After iterating through the directory, it loads the file.

      system[key][i.split(".")[0]] = require(`../${dir}/${i}`);
    });

    loadLog(system, key.charAt(0).toUpperCase() + key.slice(1), count);
  });
}

// The function that logs everything that has been loaded.
//! SOON GONE OR IMPLEMENTED DIFFERENTLY

function loadLog(system, text, count) {
  system.functions.log(
    `${system.chalk.green(count)} ${text.charAt(0).toUpperCase()} loaded. ${system.chalk.green("[+]")}`,
  );
}

// This right here will load all commands.

function loadCommands(system, arr, dirPath) {
  // Iterates through the directory and if there is a folder, it iterates through said folder.

  fs.readdirSync(dirPath).forEach((i) => {
    if (!i.endsWith(".js"))
      return loadCommands(system, arr, `${dirPath}/${i}/`);

    // Deletes the cache of the file (Very important for hot-reloading).

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
