/************************************************************************************************\
*                                     DECLARATION & IMPORTS                                      *
\************************************************************************************************/

const system = {
  functions: {},
  sysinf: {},
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

  // Runs the program.
  run();
})();

/************************************************************************************************\
*                                           FUNCTIONS                                            *
\************************************************************************************************/

// Creates the overlay with the imported data.

async function run() {
  system.modules.createUi(system);
}
