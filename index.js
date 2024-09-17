/************************************************************************************************\
*                                   DECLARATION, IM- & EXPORTS                                   *
\************************************************************************************************/

const system = {
  functions: {},
  sysinf: {},
  other: {
    lastCommand: {},
    winTooSmall: false,
    startingUp: true,
  },
};
const loader = require("./loader.js");

require("./scripts/functions.js")(system);

/************************************************************************************************\
*                                              MAIN                                              *
\************************************************************************************************/

// Creates the banner.

system.functions.cpuyBanner();

// Loads all modules, handlers and commands.

loader(system);

console.log("\n");
console.log("Please wait while CPU-Y is fetching your system information...");

// Fetches the system information in an async function because I don't like then(). You'll never catch me using then(), that's a PROMISE!!!! AHAHHAHHAHahha

(async () => {
  await system.modules.createData(system);

  if (process.stdout.columns < 47) return system.functions.winTooSmall();

  // Runs CPU-Y.

  system.modules.createMainPage(system);
})();

// This event is triggered when the size of the console window is changed.

process.stdout.addListener("resize", () => {
  // Just so nothing gets messed up while CPU-Y is starting up.

  if (system.other.startingUp) return;

  // A quick reload because text can look "distorted" after resizing.

  system.functions.reload();

  if (process.stdout.columns < 47 && !system.other.winTooSmall)
    system.functions.winTooSmall();

  if (process.stdout.columns >= 47 && system.other.winTooSmall)
    system.functions.winReturn();
});
