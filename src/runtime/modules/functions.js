module.exports = { type: "function", execute: execute };

function execute(system) {
  system.functions.banner = function () {
    return system.chalk.cyan(`
  ______   _______   __    __       __      __ 
 /      \\ |       \\ |  \\  |  \\     |  \\    /  \\
|  $$$$$$\\| $$$$$$$\\| $$  | $$      \\$$\\  /  $$
| $$   \\$$| $$__/ $$| $$  | $$ ______\\$$\\/  $$ 
| $$      | $$    $$| $$  | $$|      \\$$  $$  
| $$   __ | $$$$$$$ | $$  | $$ \\$$$$$$ \\$$$$   
| $$__/  \\| $$      | $$__/ $$         | $$    
 \\$$    $$| $$       \\$$    $$         | $$    
  \\$$$$$$  \\$$        \\$$$$$$           \\$$`);
  };

  // This functions waits.

  system.functions.wait = function (ms) {
    return new Promise((res) => setTimeout(() => res(true), ms));
  };

  // My logging function with chalk.
  //! SOON GONE OR IMPLEMENTED DIFFERENTLY

  system.functions.log = function (text, styles = ["gray"]) {
    styles.forEach((i) => {
      text = system.chalk[i](text);
    });

    console.log(text);
  };

  // My header for every command.
  //! SOON GONE OR IMPLEMENTED DIFFERENTLY

  system.functions.cmdHeader = function (text) {
    system.functions.banner();
    system.functions.log(`${text} - CPU-Y`, ["green", "underline"]);
    console.log("\n");
  };

  // RNG function.

  system.functions.rng = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // This function creates the "> " in the console.

  system.functions.prompt = function () {
    console.log("\n");
    system.rl.prompt();
  };
}
