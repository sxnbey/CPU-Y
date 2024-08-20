/************************************************************************************************\
*                                     DECLARATION & IMPORTS                                      *
\************************************************************************************************/

// Imports all needed modules to run the program.

const createData = require("./modules/data.js");
const createMenu = require("./modules/menu.js");
const functions = require("./modules/functions.js");
const errors = require("./data/errors.json");
const system = { functions: { functions }, errors: errors };

/************************************************************************************************\
*                                              MAIN                                              *
\************************************************************************************************/

// Clears the console.

console.clear();

// Runs the program.

run();

/************************************************************************************************\
*                                            EXPORTS                                             *
\************************************************************************************************/

// Exports the system object so I can use it in other files.

module.exports = system;

/************************************************************************************************\
*                                           FUNCTIONS                                            *
\************************************************************************************************/

// Creates the overlay with the imported data.

async function run() {
  // const data = await createData();

  createMenu(await createData());
}
