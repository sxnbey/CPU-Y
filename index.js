/************************************************************************************************\
*                                   DECLARATION, IM- & EXPORTS                                   *
\************************************************************************************************/

require("dotenv").config();

const readline = require("readline");
const os = require("os");
const system = {
  dev: process.env.dev?.split(",").includes(os.userInfo().username),
  apikey: process.env.apikey,
  toRender: { title: "hey", lines: ["du", "geiler", "sexmann"], footer: "sex" },
  chalk: require("chalk"),
  rl: null,
  functions: {},
  sysinf: {},
  other: {
    lastCommand: {},
  },
};
system.rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

require("./modules/functions.js")(system);
require("./modules/loader.js")(system);

const Renderer = require("./classes/renderer.js")(system);
const renderling = new Renderer(200);

/************************************************************************************************\
*                                              MAIN                                              *
\************************************************************************************************/

//! SOON LIL RENDERLING GONNA DO HIS WOOOOORK

// renderling.start();

system.handlers.commandHandler(system);
system.rl.emit("line", "home");

// Renderling renders again on window resize.

process.stdout.addListener("resize", () => renderling.render(true));
