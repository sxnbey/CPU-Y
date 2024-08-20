/************************************************************************************************\
*                                     DECLARATION & IMPORTS                                      *
\************************************************************************************************/

const functions = require("./functions.js");

/************************************************************************************************\
*                                            EXPORTS                                             *
\************************************************************************************************/

// Exports the createMenu function so it can be used in ../index.js.

module.exports = createMenu;

/************************************************************************************************\
*                                          FUNCTIONS                                             *
\************************************************************************************************/

// Creates the menu with the data from ./data.js.

function createMenu(data) {
  return console.log("afj");
  try {
    console.log("-------------------------------------");
    console.log("-----------------CPU-Y---------------");
    console.log("-------------------------------------");
    console.log(data.system());
    console.log("\n");
    console.log("-------------------------------------");
    console.log("---------------Netzwerk--------------");
    console.log("-------------------------------------");
    console.log("\n");
    console.log(data.network());
    console.log("\n");
    console.log("-------------------------------------");
    console.log("------------------CPU----------------");
    console.log("-------------------------------------");
    console.log("\n");
    console.log(data.cpu());
    console.log("\n");
    console.log("-------------------------------------");
    console.log("-----------------RAM-----------------");
    console.log("-------------------------------------");
    console.log("\n");
    console.log(data.ram());
    console.log("\n");
    console.log("-------------------------------------");
    console.log("-------------Anzeigeräte-------------");
    console.log("-------------------------------------");
    console.log("\n");
    console.log(data.graphics());
    console.log("\n");
    console.log("-------------------------------------");
    console.log("-------------Bildschirme-------------");
    console.log("-------------------------------------");
    console.log("\n");
    console.log(data.displays());
    console.log("\n");

    // If it's a desktop, this is not needed.

    if (data.hasBattery) {
      console.log("-------------------------------------");
      console.log("----------------Akku-----------------");
      console.log("-------------------------------------");
      console.log("\n");
      console.log(data.battery());
      console.log("\n");
    }
    console.log("-------------------------------------");
    console.log("-------------------------------------");
    console.log("-------------------------------------");
  } catch (e) {
    functions.handleError("02", "001", e.stack.split("\n"));

    process.exit();
  }
}
