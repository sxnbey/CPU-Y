/************************************************************************************************\
*                                   DECLARATION, IM- & EXPORTS                                   *
\************************************************************************************************/

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

  system.other.errorOnStartup = true;

  // The error message.

  system.functions.cpuyBanner();
  system.functions.log(
    `An ${system.chalk.red("ERROR")} occurred while processing your request:`
  );
  console.log("\n");
  system.functions.log(`${error.name}`, ["red"]);
  console.log("\n");
  system.functions.log(
    `Error code: ${system.chalk.red(`${layer}x${error.code}`)}`
  );
  system.functions.log(`Origin: ${fileAndLine()}`);
  // If it's a critical error, CPU-Y shuts down.

  if (error.severity == 3) {
    console.log("\n");
    system.functions.log(
      `This is a ${system.chalk.red(
        errors.info.severity[error.severity]
      )} error. CPU-Y is shutting down now.`
    );

    process.exit(0);
  } else {
    if (error.severity == 2)
      errors.info.layers[layer].blockedCats.forEach((i) =>
        system.other.catsBlockedByError.push(i)
      );

    console.log("\n");
    system.functions.log(
      `This is a ${system.chalk[error.severity == 2 ? "yellow" : "green"](
        errors.info.severity[error.severity]
      )} error. You can still use CPU-Y but some commands might not work.`
    );
    system.functions.log(
      `For more information on the error, type "${system.chalk.cyan(
        `error ${layer}x${error.code}`
      )}"`
    );
    system.functions.log("You will return to the homescreen in 15 seconds.", [
      "green",
    ]);

    (async () => {
      await system.functions.wait(15000);

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
