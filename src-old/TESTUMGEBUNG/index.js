const terminalkit = require("this.terminal-kit");
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
// let this.system.renderState.body =
//   "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.".split(
//     " ",
//   );
let body = "hallo du mann o i j lj h p j p j2j l2jl l2j lkj kl2j l l2jlk".split(
  " ",
);

class Renderer {
  constructor() {
    this.system = {
      RenderState: {},
      renderState: {
        header: ["CPU-Y - Header-Platzhaltertext, der maximal tuff ist"],
        body: body,
        footer: ["CPU-Y - Footer-Platzhaltertext, der maximal tuff ist"],
      },
    };

    this.term = term;

    this.lastRender = {};

    this.banner = this.banner;
    this.bannerHeight = null;
    this.headerHeight = null;
    this.bodyHeight = null;
    this.footerHeight = null;

    this.scrollIndex = 0;
    this.visibleLines = [];

    this.layout = {};

    // this.system.RenderState.on("changed", () => this.render());
  }

  render() {
    //* Calculate layout

    this.bannerHeight = this.banner.split("\n").length;
    this.headerHeight = this.system.renderState.header.length;
    this.footerHeight = this.system.renderState.footer.length;

    const sectionGap = 1;
    const reserved =
      this.bannerHeight +
      this.headerHeight +
      this.footerHeight +
      sectionGap * 3 + // header gap, body gap, footer gap
      3; // the ">" (le prompt + some padding)

    this.bodyHeight = Math.max(0, this.term.height - reserved);

    let y = this.bannerHeight;

    this.layout.header = {
      centered: false,
      height: this.headerHeight,
      y: y + sectionGap,
    };

    y += this.layout.header.height + sectionGap;

    this.layout.body = {
      centered: true,
      height: this.bodyHeight,
      y: y + sectionGap,
      paddingOffset: 0,
    };

    y += this.layout.body.height + sectionGap;

    this.layout.footer = {
      centered: false,
      height: this.footerHeight,
      y: y + sectionGap,
    };

    this.calculatePaddingOffset();

    // Because of the structure it was possible that the body overwrites the footer, so I have to make sure the body doesn't draw outside his teretorry.

    //? Why not render body earlier? Soon check

    this.layout.body.start =
      this.layout.body.y + this.layout.body.paddingOffset;

    this.layout.body.end = this.layout.body.y + this.layout.body.height;

    // this.layout.body = {
    //   ...this.layout.body,
    //   start: this.layout.body.y + this.layout.body.paddingOffset,
    //   end: this.layout.body.y + this.layout.body.height,
    // };

    // Calculates currently possible scroll & changes scrollIndex if needed.

    const maxScroll = Math.max(
      0,
      this.system.renderState.body.length - this.bodyHeight,
    );
    this.scrollIndex = Math.max(0, Math.min(this.scrollIndex, maxScroll));

    this.visibleLines = this.system.renderState.body.slice(
      this.scrollIndex,
      this.scrollIndex + this.bodyHeight,
    );

    // Renderling starts rendering process.

    const sb = new ScreenBuffer({
      dst: this.term,
    });

    // Clear everything
    //* Only changed soon!

    for (let y = 0; y < this.term.height; y++) {
      sb.put({ x: 0, y }, " ".repeat(this.term.width));
    }

    // this.banner

    this.banner.split("\n").forEach((line, index) => {
      sb.put({ x: 1, y: index }, line.padEnd(this.term.width, " "));
    });

    // Header & Footer

    ["header", "footer"].forEach((section) =>
      this.system.renderState[section].forEach((line, index) =>
        sb.put(
          {
            x: 1,
            y: this.layout[section].y + index,
          },
          line.padEnd(this.term.width, " "),
        ),
      ),
    );

    // Body

    for (let y = 0; y < this.bodyHeight; y++) {
      const posY = this.layout.body.start + y;

      if (posY >= this.layout.body.end) break;

      const line = this.visibleLines[y] || " ".padEnd(this.term.width, " ");

      sb.put({ x: 1, y: posY }, line.padEnd(this.term.width, " "));
    }

    // Le prompt

    sb.put({ x: 2, y: this.term.height - 2 }, ">".padEnd(this.term.width, " "));

    // THe canvas shall be filled now

    sb.draw();

    // After drawing, the cursor will be moved out of the window. Hiding and restoring the cursor did NOT work (as I intended at least).

    //? Other way maybe? Check soon

    this.term.moveTo(5, this.term.height - 1);
  }

  calculatePaddingOffset() {
    Object.entries(this.layout).forEach(([section, config]) => {
      if (!config.centered) return;

      const extraLines =
        config.height - this.system.renderState[section].length;

      if (extraLines > 1)
        this.layout[section].paddingOffset = Math.floor(extraLines / 2);
    });
  }
}

// term.on("mouse", (name, data) => {
//   if (
//     data.y <= this.layout.body.y ||
//     data.y >= this.term.height - (this.footerHeight + 2)
//   )
//     return;

//   if (name == "MOUSE_WHEEL_UP") {
//     this.scrollIndex = Math.max(0, this.scrollIndex - 3);
//     render();
//   }

//   if (name == "MOUSE_WHEEL_DOWN") {
//     this.scrollIndex = Math.min(
//       Math.max(0, this.system.renderState.body.length - this.bodyHeight),
//       this.scrollIndex + 3,
//     );

//     render();
//   }
// });

term.on("resize", () => render());
