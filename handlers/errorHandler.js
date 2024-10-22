/************************************************************************************************\
*                                   DECLARATION, IM- & EXPORTS                                   *
\************************************************************************************************/

const commandHandler = require("./commandHandler");

// Exports the error handler.

module.exports = errorHandler;

/************************************************************************************************\
*                                              MAIN                                              *
\************************************************************************************************/

// This function handles all error.

function errorHandler(system, layer, error, stack) {
  // Import the errors.

  const errors = require("../data/errors.json");

  // Searches the error in the imported object.

  error = errors.errors[layer].find((i) => i.code == error);

  system.other.commandsBlockedByError.push(system.other.lastCommand);
  system.other.errorOnStartup = true;

  // The error message.

  console.clear();
  console.log("An error occurred while processing your request:");
  console.log(`${errors.info.layers[layer]} - ${layer}x${error.code}`);
  console.log(error.name);
  console.log("\n");
  console.log("Origin of the error:\n" + fileAndLine());

  if (error.severity == 3) {
    console.log("\n");
    console.log(
      `This is a ${
        errors.info.severity[error.severity]
      } error. CPU-Y is shutting down now.`
    );

    process.exit(0);
  } else {
    console.log("\n");
    console.log(
      `This is a ${
        errors.info.severity[error.severity]
      } error. You can still use CPU-Y but some commands might not work.`
    );
    console.log("\n");
    console.log("You will return to the homescreen in 10 seconds.");

    (async () => {
      await system.functions.wait(10000);

      system.other.errorOnStartup = false;
      system.modules.createMainPage(system);
    })();
  }

  // The file and line of the error.

  function fileAndLine() {
    if (stack[1]) return stack[1].trim().replace(/^at\s+/g, "");
    else return "/";
  }
}
