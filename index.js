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
    onMainPage: true,
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

// Fetches the system information in an async function because I don't like then(). You'll never catch me using then(), that's a promise AHAHHAHHAHahha

(async () => {
  await system.modules.createData(system);

  system.other.startingUp = false;

  if (process.stdout.columns < 47) return system.functions.winTooSmall();

  // Runs the program.
  system.functions.run();
})();

process.stdout.addListener("resize", () => {
  if (system.other.startingUp) return;

  system.functions.reload();

  if (process.stdout.columns < 47 && !system.other.winTooSmall)
    system.functions.winTooSmall();

  if (process.stdout.columns >= 47 && system.other.winTooSmall)
    system.functions.winReturn();
});
