const fs = require("fs");
const path = require("path");

function loadAll(system) {
  const directories = ["modules", "handlers"];

  directories.forEach((dir) => {
    const key = dir;
    system[key] = {};

    const fullPath = path.join(__dirname, dir);

    fs.readdirSync(fullPath).forEach((file) => {
      const filePath = path.join(fullPath, file);

      if (file.endsWith(".js")) {
        const fileName = path.basename(file, ".js");

        // Lädt das Modul/Handler, aber führt es nicht aus
        const moduleFunction = require(filePath);

        // Speichert die Funktion oder Klasse im system-Objekt
        system[key][fileName] = moduleFunction;
      }
    });
  });
}

module.exports = loadAll;
