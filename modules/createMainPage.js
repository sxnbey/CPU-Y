/************************************************************************************************\
*                                   DECLARATION, IM- & EXPORTS                                   *
\************************************************************************************************/

module.exports = createMainPage;

/************************************************************************************************\
*                                              MAIN                                              *
\************************************************************************************************/

// Creates the UI.

function createMainPage(system) {
  try {
    if (system.other.errorOnStartup) return;

    const home = system.commands.find((i) => i.config.name == "home");

    system.other.lastCommand = home;

    home.run(system, []);

    // To prevent a 2nd readline to be created.

    if (system.other.startingUp) {
      system.other.startingUp = false;
      system.handlers.commandHandler(system);
    }

    // system.functions.log("-------------------------------------");
    // system.functions.log("-----------------CPU-Y---------------");
    // system.functions.log("-------------------------------------");
    // system.functions.log(data.system());
    // console.log("\n");
    // system.functions.log("-------------------------------------");
    // system.functions.log("---------------Network---------------");
    // system.functions.log("-------------------------------------");
    // console.log("\n");
    // system.functions.log(data.network());
    // console.log("\n");
    // system.functions.log("-------------------------------------");
    // system.functions.log("-----------------CPU-----------------");
    // system.functions.log("-------------------------------------");
    // console.log("\n");
    // system.functions.log(data.cpu());
    // console.log("\n");
    // system.functions.log("-------------------------------------");
    // system.functions.log("-----------------RAM-----------------");
    // system.functions.log("-------------------------------------");
    // console.log("\n");
    // system.functions.log(data.ram());
    // console.log("\n");
    // system.functions.log("-------------------------------------");
    // system.functions.log("---------------Graphics--------------");
    // system.functions.log("-------------------------------------");
    // console.log("\n");
    // system.functions.log(data.graphics());
    // console.log("\n");
    // system.functions.log("-------------------------------------");
    // system.functions.log("---------------Display---------------");
    // system.functions.log("-------------------------------------");
    // console.log("\n");
    // system.functions.log(data.displays());
    // console.log("\n");
    // // If it's a desktop, this is not needed.
    // if (data.hasBattery) {
    //   system.functions.log("-------------------------------------");
    //   system.functions.log("-------------Battery-----------------");
    //   system.functions.log("-------------------------------------");
    //   console.log("\n");
    //   system.functions.log(data.battery());
    //   console.log("\n");
    // }
    // system.functions.log("-------------------------------------");
    // system.functions.log("-------------------------------------");
    // system.functions.log("-------------------------------------");
  } catch (e) {
    system.handlers.errorHandler(system, "01", "001", e.stack.split("\n"));
  }
}
