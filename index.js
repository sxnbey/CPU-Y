/************************************************************************************************\
*                                     DECLARATION & IMPORTS                                      *
\************************************************************************************************/

const system = {
  functions: {},
};
const loader = require("./loader.js");

require("./scripts/functions.js")(system);

/************************************************************************************************\
*                                              MAIN                                              *
\************************************************************************************************/

// Loads all modules, handlers etc.

loader(system);

// Creates the banner.

system.functions.cpuyBanner();

console.log("Please wait while CPU-Y is fetching your system information...");

// Runs the program.

run();

/************************************************************************************************\
*                                           FUNCTIONS                                            *
\************************************************************************************************/

// Creates the overlay with the imported data.

async function run() {
  const data = await system.modules.createData(system);

  system.modules.createUi(system, data);
}
