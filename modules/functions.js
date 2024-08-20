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

// Handles all errors

functions.handleError = function (layer, error, stack) {
  const errors = require("../data/errors.json");

  error = errors[layer].find((i) => i.code == error);

  console.log("\n");
  console.log("Beim Bearbeiten deiner Anfrage ist ein Fehler aufgetreten.");
  console.log("\n");
  console.log(layer + "x" + error.code);
  console.log(error.name);
  console.log("\n");
  console.log("Ursprung des Fehlers:\n" + fileAndLine());

  function fileAndLine() {
    if (stack[1]) return stack[1].trim().replace(/^at\s+/g, "");
  }
};
