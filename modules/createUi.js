/************************************************************************************************\
*                                   DECLARATION, IM- & EXPORTS                                   *
\************************************************************************************************/

// Imports the module to respond to console inputs.

module.exports = createUi;

/************************************************************************************************\
*                                              MAIN                                              *
\************************************************************************************************/

// Creates the UI.

function createUi(system) {
  try {
    system.functions.cpuyBanner();

    console.log("Welcome to CPU-Y!");
    console.log("\n");
    console.log(
      'If it\'s your first time using CPU-Y, type "help" for more information on how to use this program.' +
        "\n" +
        "But if you already know how it works, ignore the sentence above and just type any command you need below."
    );

    return system.handlers.commandHandler(system);

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
    system.handlers.errorHandler("02", "001", e.stack.split("\n"));

    process.exit();
  }
}
