module.exports = (system) => {
  //! SOON GONE OR IMPLEMENTED DIFFERENTLY
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
                                                       `),
    );
  };

  // This functions waits.

  system.functions.wait = function (ms) {
    return new Promise((res) => setTimeout(() => res(true), ms));
  };

  // My logging functions with chalk.
  //! SOON GONE

  system.functions.log = function (text, styles = ["gray"]) {
    styles.forEach((i) => {
      text = system.chalk[i](text);
    });

    console.log(text);
  };

  // My header for every command.
  //! SOON GONE

  system.functions.cmdHeader = function (text) {
    system.functions.cpuyBanner();
    system.functions.log(`${text} - CPU-Y`, ["green", "underline"]);
    console.log("\n");
  };

  // RNG function.

  system.functions.rng = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
};
