/************************************************************************************************\
*                                   DECLARATION, IM- & EXPORTS                                   *
\************************************************************************************************/

require("dotenv").config();

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
  functions: {},
  other: {
    lastCommand: {},
    bootLog: ["", "Boot log:", ""],
  },
};

const RenderState = require("./runtime/core/renderState.js");
system.toRender = new RenderState();
const Renderer = require("./runtime/core/renderer.js")(system);
const renderling = new Renderer();

require("./runtime/modules/loader.js")(system);

/************************************************************************************************\
*                                              MAIN                                              *
\************************************************************************************************/

renderling.render();

// system.rl.emit("line", "home");

// Shows the boot log if in dev mode.

// if (system.dev) system.other.bootLog.forEach((i) => system.toRender.addLine(i));
