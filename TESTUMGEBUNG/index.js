const terminalkit = require("terminal-kit");
const term = terminalkit.terminal;
const ScreenBuffer = terminalkit.ScreenBuffer;

term.on("key", (name) => {
  if (name === "CTRL_C") {
    term.processExit(0);
    term.fullscreen(false);
  }
});

term.clear();
term.grabInput();
term.grabInput({ mouse: "button" });

term.fullscreen(true);

const banner = `  ______   _______   __    __       __      __ 
 /      \\ |       \\ |  \\  |  \\     |  \\    /  \\
|  $$$$$$\\| $$$$$$$\\| $$  | $$      \\$$\\  /  $$
| $$   \\$$| $$__/ $$| $$  | $$ ______\\$$\\/  $$ 
| $$      | $$    $$| $$  | $$|      \\$$  $$  
| $$   __ | $$$$$$$ | $$  | $$ \\$$$$$$ \\$$$$   
| $$__/  \\| $$      | $$__/ $$         | $$    
 \\$$    $$| $$       \\$$    $$         | $$    
  \\$$$$$$  \\$$        \\$$$$$$           \\$$`;
// let bodyLines =
//   "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.".split(
//     " ",
//   );
let bodyLines =
  "hallo du mann o i j lj h p j p j2j l2jl l2j lkj kl2j l l2jlk".split(" ");
let scrollIndex = 0;
let visibleLines;

let bannerH;
let headerH;
let footerH;
let bodyH;

let layout = {};

function render() {
  let renderState = {
    header: ["CPU-Y - Header-Platzhaltertext, der maximal tuff ist"],
    body: bodyLines,
    footer: ["CPU-Y - Footer-Platzhaltertext, der maximal tuff ist"],
  };

  //* Calculate layout

  bannerH = banner.split("\n").length;
  headerH = renderState.header.length;
  footerH = renderState.footer.length;

  const sectionGap = 1;
  const reserved =
    bannerH +
    headerH +
    footerH +
    sectionGap * 3 + // header gap, body gap, footer gap
    3; // the ">" (le prompt + some padding)

  bodyH = Math.max(0, term.height - reserved);

  let y = bannerH;

  layout.header = {
    centered: false,
    height: headerH,
    y: y + sectionGap,
  };

  y += layout.header.height + sectionGap;

  layout.body = {
    centered: true,
    height: bodyH,
    y: y + sectionGap,
    paddingOffset: 0,
  };

  y += layout.body.height + sectionGap;

  layout.footer = {
    centered: false,
    height: footerH,
    y: y + sectionGap,
  };

  calculatePaddingOffset();

  // Because of the structure it was possible that the body overwrites the footer, so I have to make sure the body doesn't draw outside his teretorry.

  //? Why not render body earlier? Soon check

  layout.body = {
    ...layout.body,
    start: layout.body.y + layout.body.paddingOffset,
    end: layout.body.y + layout.body.height,
  };

  // Calculates currently possible scroll & changes scrollIndex if needed.

  const maxScroll = Math.max(0, bodyLines.length - bodyH);
  scrollIndex = Math.max(0, Math.min(scrollIndex, maxScroll));

  visibleLines = bodyLines.slice(scrollIndex, scrollIndex + bodyH);

  // Renderling starts rendering process.

  const sb = new ScreenBuffer({
    dst: term,
  });

  // Clear everything
  //* Only changed soon!

  for (let y = 0; y < term.height; y++) {
    sb.put({ x: 1, y }, " ".repeat(term.width));
  }

  // Banner

  banner.split("\n").forEach((line, index) => {
    sb.put({ x: 1, y: index }, line.padEnd(term.width, " "));
  });

  // Header & Footer

  ["header", "footer"].forEach((section) =>
    renderState[section].forEach((line, index) =>
      sb.put(
        {
          x: 1,
          y: layout[section].y + index,
        },
        line.padEnd(term.width, " "),
      ),
    ),
  );

  // Body

  for (let y = 0; y < bodyH; y++) {
    const posY = layout.body.start + y;

    if (posY >= layout.body.end) break;

    const line = visibleLines[y] || " ".padEnd(term.width, " ");

    sb.put({ x: 1, y: posY }, line.padEnd(term.width, " "));
  }

  // Le prompt

  sb.put({ x: 2, y: term.height - 2 }, ">".padEnd(term.width, " "));

  // THe canvas shall be filled now

  sb.draw();

  // After drawing, the cursor will be moved out of the window. Hiding and restoring the cursor did NOT work (as I intended at least).

  //? Other way maybe? Check soon

  term.moveTo(5, term.height - 1);

  function calculatePaddingOffset() {
    Object.entries(layout).forEach(([section, config]) => {
      if (!config.centered) return;

      const extraLines = config.height - renderState[section].length;

      if (extraLines > 1) {
        layout[section].paddingOffset = Math.floor(extraLines / 2);
      }
    });
  }
}

term.on("mouse", (name, data) => {
  if (data.y <= layout.body.y || data.y >= term.height - (footerH + 2)) return;

  if (name == "MOUSE_WHEEL_UP") {
    scrollIndex = Math.max(0, scrollIndex - 3);
    render();
  }

  if (name == "MOUSE_WHEEL_DOWN") {
    scrollIndex = Math.min(
      Math.max(0, bodyLines.length - bodyH),
      scrollIndex + 3,
    );

    render();
  }
});

render();

term.on("resize", () => render());
