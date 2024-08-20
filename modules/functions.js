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

functions.handleError = function (layer, error) {
  const errors = require("../data/errors.json");

  error = errors[layer].find((i) => i.code == error);

  console.log("\n");
  console.log("Beim Bearbeiten deiner Anfrage ist ein Fehler aufgetreten.");
  console.log("\n");
  console.log(layer + "x" + error.code);
  console.log(error.name);
};
