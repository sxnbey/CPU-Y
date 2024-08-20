/************************************************************************************************\
*                                     DECLARATION & IMPORTS                                      *
\************************************************************************************************/

// Imports all needed modules to run the program.

const createData = require("./modules/data.js");
const createUi = require("./modules/ui.js");
const functions = require("./scripts/functions.js");
const handlers = require("./handlers/handler.js");

/************************************************************************************************\
*                                              MAIN                                              *
\************************************************************************************************/

// Clears the console.

functions.cpuyBanner();

console.log("Please wait while CPU-Y is fetching your system information...");

// Runs the program.

run();

/************************************************************************************************\
*                                           FUNCTIONS                                            *
\************************************************************************************************/

// Creates the overlay with the imported data.

async function run() {
  // const data = await createData();

  createUi(await createData());
}
