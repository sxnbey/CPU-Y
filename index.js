/************************************************************************************************\
*                                   DECLARATION, IM- & EXPORTS                                   *
\************************************************************************************************/

require("dotenv").config();

const os = require("os");
const system = {
  dev: process.env.dev?.split(",").includes(os.userInfo().username),
  apikey: process.env.apikey,
  toRender: { title: "hey", lines: ["du", "geiler", "sexmann"], footer: "sex" },
  chalk: require("chalk"),
  functions: {},
  sysinf: {},
  other: {
    startWithoutSysinf: true,
    lastCommand: {},
    errorOnStartup: false,
    catsBlockedByError: [],
  },
};

require("./modules/functions.js")(system);
require("./modules/loader.js")(system);

const renderling = require("./classes/renderer.js")(system);

const Renderer = new renderling(200);
// Renderer.start();

// /************************************************************************************************\
// *                                              MAIN                                              *
// \************************************************************************************************/

// return;

const home = system.commands.find((i) => i.config.name == "home");

system.other.lastCommand = home;

home.run(system, []);

system.handlers.commandHandler(system);

// Renderling renders again on window resize.

process.stdout.addListener("resize", () => Renderer.render(true));
