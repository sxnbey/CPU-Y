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
      this.ScreenBuffer = new ScreenBuffer({
        dst: this.term,
      });
    }

    render({ initialRender = false } = {}) {
      if (initialRender) this.term.clear();

      this._initBuffer();

      const sb = this.ScreenBuffer;

      this._calculateLayout();
      this._calculateScroll();

      this._clear(sb);

      [
        this._drawBanner,
        this._drawHeaderAndFooter,
        this._drawBody,
        this._drawInput,
      ].forEach((func) => func.call(this, sb));

      sb.draw();

      this.term.moveTo(
        Math.max(this.RenderState.getInput().length + 5, 5),
        this.term.height - 1,
      );
    }

    _calculateLayout() {
      const bannerHeight = this.RenderState.banner.split("\n").length;
      const headerHeight = this.RenderState.header.length;
      const footerHeight = this.RenderState.footer.length;

      const promptHeight = 3; // Le prompt + some padding
      const sectionGap = 1;

      const bannerY = 0;
      const headerY = bannerHeight + sectionGap;

      const footerY = this.term.height - footerHeight - promptHeight;

      const inputY = this.term.height - 2;

      const bodyStart = headerY + headerHeight + sectionGap;
      const bodyEnd = footerY - sectionGap;
      const bodyHeight = Math.max(0, bodyEnd - bodyStart);

      this.layout = {
        banner: { y: bannerY, height: bannerHeight },
        header: { y: headerY, height: headerHeight, centered: false },
        footer: { y: footerY, height: footerHeight, centered: false },
        input: { y: inputY },
        body: {
          start: bodyStart,
          end: bodyEnd,
          height: bodyHeight,
          centered: true,
          paddingOffset: 0,
        },
      };

      this.bannerHeight = bannerHeight;
      this.headerHeight = headerHeight;
      this.bodyHeight = bodyHeight;
      this.footerHeight = footerHeight;

      this._calculatePaddingOffset();
    }

    _calculateScroll() {
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

    _calculatePaddingOffset() {
      Object.entries(this.layout).forEach(([section, config]) => {
        if (!config.centered) return;

        const extraLines = config.height - this.RenderState[section].length;

        if (extraLines > 1)
          this.layout[section].paddingOffset = Math.floor(extraLines / 2);
      });
    }

    _clear(sb) {
      //* Only changed soon!

      for (let y = 0; y < this.term.height; y++) {
        sb.put({ x: 0, y }, " ".padEnd(this.term.width, " "));
      }
    }

    _drawBanner(sb) {
      this.RenderState.banner.split("\n").forEach((line, index) => {
        sb.put({ x: 1, y: index }, line.padEnd(this.term.width, " "));
      });
    }

    _drawHeaderAndFooter(sb) {
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

    _drawBody(sb) {
      for (let y = 0; y < this.bodyHeight; y++) {
        const posY = this.layout.body.start + y;

        if (posY >= this.layout.body.end) break;

        const line = this.visibleLines[y] || " ".padEnd(this.term.width, " ");

        sb.put({ x: 1, y: posY }, line.padEnd(this.term.width, " "));
      }
    }

    _drawInput(sb) {
      const y = this.layout.input.y;

      sb.put({ x: 2, y }, ">".padEnd(this.term.width, " "));

      sb.put({ x: 4, y }, this.RenderState.input.join(""));
    }
  },
};
