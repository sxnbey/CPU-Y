/************************************************************************************************\
*                                   DECLARATION, IM- & EXPORTS                                   *
\************************************************************************************************/

require("dotenv").config();

const readline = require("readline");
const os = require("os");
const system = {
  dev: process.env.dev?.split(",").includes(os.userInfo().username),
  apikey: process.env.apikey,
  chalk: require("chalk"),
  rl: null,
  functions: {},
  other: {
    lastCommand: {},
  },
};
system.rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});
const RenderState = require("./classes/renderstate.js");
system.toRender = new RenderState();
const Renderer = require("./classes/renderer.js")(system);
const renderling = new Renderer();

require("./modules/functions.js")(system);
require("./modules/loader.js")(system);

/************************************************************************************************\
*                                              MAIN                                              *
\************************************************************************************************/

//! SOON LIL RENDERLING GONNA DO HIS WOOOOORK

// return;

system.handlers.commandHandler(system);
system.rl.emit("line", "home");

// Renderling renders again on window resize.

process.stdout.addListener("resize", () => renderling.render(true));
