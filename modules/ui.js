/************************************************************************************************\
*                                     DECLARATION & IMPORTS                                      *
\************************************************************************************************/

// Imports the needed module and the client.

const readline = require("readline");
const functions = require("../scripts/functions.js");
const handlers = require("../handlers/handler.js");

/************************************************************************************************\
*                                            EXPORTS                                             *
\************************************************************************************************/

// Exports the createUi function so it can be used in ../index.js.

module.exports = createUi;

/************************************************************************************************\
*                                          FUNCTIONS                                             *
\************************************************************************************************/

// Creates the UI.

function createUi(data) {
  try {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    functions.cpuyBanner();

    console.log("Welcome to CPU-Y!");
    console.log("\n");
    console.log(
      'If it\'s your first time using CPU-Y, type "help" for more information on how to use this program.'
    );

    rl.question(
      `But if you already know how it works, ignore the sentence above and just type any command you need below:\n\n`,
      (res) => {
        if (res == "help") {
          console.log("\n");
          console.log("Höhö hier gibts keine Hilfe gerade hehehhehehehehe");
        } else console.log("digga du hast nicht help eingegeben");
      }
    );

    // console.log("-------------------------------------");
    // console.log("-----------------CPU-Y---------------");
    // console.log("-------------------------------------");
    // console.log(data.system());
    // console.log("\n");
    // console.log("-------------------------------------");
    // console.log("---------------Network---------------");
    // console.log("-------------------------------------");
    // console.log("\n");
    // console.log(data.network());
    // console.log("\n");
    // console.log("-------------------------------------");
    // console.log("-----------------CPU-----------------");
    // console.log("-------------------------------------");
    // console.log("\n");
    // console.log(data.cpu());
    // console.log("\n");
    // console.log("-------------------------------------");
    // console.log("-----------------RAM-----------------");
    // console.log("-------------------------------------");
    // console.log("\n");
    // console.log(data.ram());
    // console.log("\n");
    // console.log("-------------------------------------");
    // console.log("---------------Graphics--------------");
    // console.log("-------------------------------------");
    // console.log("\n");
    // console.log(data.graphics());
    // console.log("\n");
    // console.log("-------------------------------------");
    // console.log("---------------Display---------------");
    // console.log("-------------------------------------");
    // console.log("\n");
    // console.log(data.displays());
    // console.log("\n");
    // // If it's a desktop, this is not needed.
    // if (data.hasBattery) {
    //   console.log("-------------------------------------");
    //   console.log("-------------Battery-----------------");
    //   console.log("-------------------------------------");
    //   console.log("\n");
    //   console.log(data.battery());
    //   console.log("\n");
    // }
    // console.log("-------------------------------------");
    // console.log("-------------------------------------");
    // console.log("-------------------------------------");
  } catch (e) {
    handlers.errorHandler("02", "001", e.stack.split("\n"));

    process.exit();
  }
}
