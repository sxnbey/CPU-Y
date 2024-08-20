/************************************************************************************************\
*                                     DECLARATION & IMPORTS                                      *
\************************************************************************************************/

// Creates the functions object which is to be exported later.

const functions = {};

/************************************************************************************************\
*                                            EXPORTS                                             *
\************************************************************************************************/

// Exports the functions object.

module.exports = functions;

/************************************************************************************************\
*                                           FUNCTIONS                                            *
\************************************************************************************************/

// This function handles all error.

functions.handleError = function (layer, error, stack) {
  // Imports all errors.

  const errors = require("../data/errors.json");

  // Searches the error in the imported object.

  error = errors[layer].find((i) => i.code == error);

  // The error message.

  console.log("\n");
  console.log("Beim Bearbeiten deiner Anfrage ist ein Fehler aufgetreten.");
  console.log("\n");
  console.log(layer + "x" + error.code);
  console.log(error.name);
  console.log("\n");
  console.log("Ursprung des Fehlers:\n" + fileAndLine());

  // The file and line of the error.

  function fileAndLine() {
    if (stack[1]) return stack[1].trim().replace(/^at\s+/g, "");
  }
};
