/************************************************************************************************\
*                                   DECLARATION, IM- & EXPORTS                                   *
\************************************************************************************************/

// Exports the error handler.

module.exports = errorHandler;

/************************************************************************************************\
*                                              MAIN                                              *
\************************************************************************************************/

// This function handles all error.

function errorHandler(layer, error, stack) {
  // Import the errors.

  const errors = require("../data/errors.json");

  // Searches the error in the imported object.

  error = errors[layer].find((i) => i.code == error);

  // The error message.

  console.clear();
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
    else return "/";
  }
}
