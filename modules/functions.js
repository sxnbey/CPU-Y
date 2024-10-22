module.exports = (system) => {
  system.functions.cpuyBanner = function () {
    console.clear();
    system.functions.log(
      system.chalk.cyan(`
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
                                                       `)
    );
  };

  // This functions reloads the window.

  system.functions.reload = function () {
    // Checks whether the width is too small, as the window has to be reloaded after resizing.

    if (process.stdout.columns < 47) return system.functions.winTooSmall();

    // Runs the last command or returns back to the main page/command/wtv.

    if (system.other.lastCommand.run)
      system.other.lastCommand.run(system, system.other.lastCommand.args);
    else system.commands.find((i) => i.config.name == "home").run(system, []);

    system.handlers.commandHandler(system, true);
  };

  // The function to display the please-make-the-window-wider-text when the window width is below 47.

  system.functions.winTooSmall = function () {
    system.other.winTooSmall = true;

    console.clear();
    system.functions.log("The window is too small!", ["red"]);
    console.log("\n");
    system.functions.log("Please make the window wider!", ["red"]);
    console.log("\n");
    system.functions.log(
      "When the window is wide enough," +
        "\n" +
        "you automatically return to where you were before."
    );
    console.log("\n");
    system.functions.log('For more information, type "help".');
  };

  // The counterpart to the function above (makes you go back to where you were before).

  system.functions.winReturn = function () {
    system.other.winTooSmall = false;

    system.functions.reload();
  };

  // This functions waits.

  system.functions.wait = function (ms) {
    return new Promise((res) => setTimeout(() => res(true), ms));
  };

  // My logging functions with chalk.

  system.functions.log = function (text, styles = ["gray"]) {
    styles.forEach((i) => {
      text = system.chalk[i](text);
    });

    console.log(text);
  };

  // My header for every command.

  system.functions.cmdHeader = function (text) {
    system.functions.cpuyBanner();
    system.functions.log(`${text} - CPU-Y`, ["green", "underline"]);
    console.log("\n");
  };
};
