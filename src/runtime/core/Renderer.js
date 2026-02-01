const ScreenBuffer = require("terminal-kit").ScreenBuffer;

module.exports = {
  dontLoad: true,
  type: "class",
  value: class Renderer {
    constructor(system) {
      this.system = system;
      this.term = system.term;

      this.ScreenBuffer;
      this.RenderState = system.RenderState;
      this.lastRender = {};
      this.layout = {};

      this.bannerHeight = null;
      this.headerHeight = null;
      this.bodyHeight = null;
      this.footerHeight = null;

      this.scrollIndex = 0;
      this.visibleLines = [];
    }

    _initBuffer() {
      if (!this.ScreenBuffer)
        this.ScreenBuffer = new ScreenBuffer({
          dst: this.term,
        });
    }

    render({ initialRender = false } = {}) {
      this._initBuffer();

      const sb = this.ScreenBuffer;

      this.calculateLayout();
      this.calculateScroll();

      this.clear(sb);

      [this.drawBanner, this.drawHeaderAndFooter, this.drawBody].forEach(
        (func) => func.call(this, sb),
      );

      // Le prompt & input field (coming soon)

      sb.put(
        { x: 2, y: this.term.height - 2 },
        ">".padEnd(this.term.width, " "),
      );

      // The canvas shall be filled now.

      sb.draw();

      this.term.moveTo(5, this.term.height - 1);
    }

    calculateLayout() {
      this.bannerHeight = this.RenderState.banner.split("\n").length;
      this.headerHeight = this.RenderState.header.length;
      this.footerHeight = this.RenderState.footer.length;
      this.input = this.RenderState.input;

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

      // Body isn't allowed to draw outside his area.

      this.layout.body.start =
        this.layout.body.y + this.layout.body.paddingOffset;

      this.layout.body.end = this.layout.body.y + this.layout.body.height;
    }

    calculateScroll() {
      const maxScroll = Math.max(
        0,
        this.RenderState.body.length - this.bodyHeight,
      );

      this.scrollIndex = Math.max(0, Math.min(this.scrollIndex, maxScroll));
      this.visibleLines = this.RenderState.body.slice(
        this.scrollIndex,
        this.scrollIndex + this.bodyHeight,
      );
    }

    calculatePaddingOffset() {
      Object.entries(this.layout).forEach(([section, config]) => {
        if (!config.centered) return;

        const extraLines = config.height - this.RenderState[section].length;

        if (extraLines > 1)
          this.layout[section].paddingOffset = Math.floor(extraLines / 2);
      });
    }

    clear(sb) {
      //* Only changed soon!

      for (let y = 0; y < this.term.height; y++) {
        sb.put({ x: 1, y }, " ".padEnd(this.term.width, ""));
      }
    }

    drawBanner(sb) {
      this.RenderState.banner.split("\n").forEach((line, index) => {
        sb.put({ x: 1, y: index }, line.padEnd(this.term.width, " "));
      });
    }

    drawHeaderAndFooter(sb) {
      ["header", "footer"].forEach((section) =>
        this.RenderState[section].forEach((line, index) =>
          sb.put(
            {
              x: 1,
              y: this.layout[section].y + index,
            },
            line.padEnd(this.term.width, " "),
          ),
        ),
      );
    }

    drawBody(sb) {
      for (let y = 0; y < this.bodyHeight; y++) {
        const posY = this.layout.body.start + y;

        if (posY >= this.layout.body.end) break;

        const line = this.visibleLines[y] || " ".padEnd(this.term.width, " ");

        sb.put({ x: 1, y: posY }, line.padEnd(this.term.width, " "));
      }
    }

    drawInput(sb) {}
  },
};
