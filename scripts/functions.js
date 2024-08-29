module.exports = (system) => {
  system.functions.cpuyBanner = function () {
    // This functions creates the CPU-Y banner.

    console.clear();
    console.log(`
  ______   _______   __    __       __      __ 
 /      \\ |       \\ |  \\  |  \\     |  \\    /  \\
|  $$$$$$\\| $$$$$$$\\| $$  | $$      \\$$\\  /  $$
| $$   \\$$| $$__/ $$| $$  | $$ ______\\$$\\/  $$ 
| $$      | $$    $$| $$  | $$|      \\$$  $$  
| $$   __ | $$$$$$$ | $$  | $$ \\$$$$$$ \\$$$$   
| $$__/  \\| $$      | $$__/ $$         | $$    
 \\$$    $$| $$       \\$$    $$         | $$    
  \\$$$$$$  \\$$        \\$$$$$$           \\$$       
                                                   
-----------------------------------------------
                                                       `);
  };

  system.functions.reload = function () {
    if (process.stdout.columns < 47) return system.functions.winTooSmall();

    if (system.other.lastCommand.run)
      system.other.lastCommand.run(system, system.other.lastCommand.args);
    else system.functions.run();

    if (!system.other.onMainPage) system.handlers.commandHandler(system, true);
  };

  system.functions.run = function () {
    system.modules.createUi(system);
  };

  // The function to display the text when the window width is below 47.

  system.functions.winTooSmall = function () {
    system.other.winTooSmall = true;

    console.clear();

    console.log("The window is too small!");
    console.log("\n");
    console.log("Please make the window wider!");
    console.log("\n");
    console.log(
      "When the window is wide enough," +
        "\n" +
        "you automatically return to where you were before."
    );
    console.log("\n");
    console.log('For more information, type "help".');
  };

  // The function to make you return to wherever you where before the window has become too small.

  system.functions.winReturn = function () {
    system.other.winTooSmall = false;

    system.functions.reload();
  };
};
