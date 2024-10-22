/************************************************************************************************\
*                                   DECLARATION, IM- & EXPORTS                                   *
\************************************************************************************************/

const fs = require("fs");

module.exports = loadAll;

/************************************************************************************************\
*                                              MAIN                                              *
\************************************************************************************************/

function loadAll(system) {
  // The directories in which the files to be loaded are located.

  const dirs = ["modules", "handlers", "commands"];

  dirs.forEach((dir) => {
    const key = dir;
    const dirPath = `./${dir}/`;

    // The commands are stored in an array not in an object.

    system[key] = dir == "commands" ? [] : {};

    if (dir == "commands") loadCommands(system[key], `./${dir}/`);
    else
      fs.readdirSync(`./${dir}/`).forEach((i) => {
        // After iterating through the directory, it loads the file.

        system[key][i.split(".")[0]] = require("../" + `./${dir}/` + i);
      });

    console.log(`${key.charAt(0).toUpperCase() + key.slice(1)} loaded.`);
  });
}

function loadCommands(arr, dirPath) {
  // Iterates through the directory and if there is a folder, it iterates through said folder.

  fs.readdirSync(dirPath).forEach((i) => {
    if (!i.endsWith(".js")) return loadCommands(arr, `./${dirPath}/${i}/`);

    // If it's a file, it will be pushed into the commands array.

    const command = require(`../${dirPath}${i}`);

    arr.push({
      config: command.config,
      run: command.run,
    });
  });
}
