/************************************************************************************************\
*                                   DECLARATION, IM- & EXPORTS                                   *
\************************************************************************************************/

require("dotenv").config();

const readline = require("readline");
const os = require("os");
const terminalkit = require("terminal-kit");
const term = terminalkit.terminal;
const ScreenBuffer = terminalkit.ScreenBuffer;

const system = {
  dev: process.env.dev?.split(",").includes(os.userInfo().username),
  apikey: process.env.apikey,
  term: term,
  screenBuffer: ScreenBuffer,
  chalk: require("chalk"),
  rl: null,
  functions: {},
  other: {
    lastCommand: {},
    bootLog: ["", "Boot log:", ""],
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

renderling.render();

// system.handlers.commandHandler(system);
// system.rl.emit("line", "home");

// Shows the boot log if in dev mode.

// if (system.dev) system.other.bootLog.forEach((i) => system.toRender.addLine(i));

// Renderling renders again on window resize.

process.stdout.addListener("resize", () => renderling.render(true));
