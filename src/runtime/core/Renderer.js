const ScreenBuffer = require("terminal-kit").ScreenBuffer;

module.exports = {
  dontLoad: true,
  type: "class",
  value: class Renderer {
    constructor(system) {
      this._system = system;
      this._term = system.term;

      this._sb;
      this._RenderState = system.RenderState;

      this.lastRender = {};
      this.layout = {};

      this.scrollIndex = 0;
      this._visibleLines = [];
    }

    _initBuffer() {
      this._sb = new ScreenBuffer({
        dst: this._term,
      });
    }

    render({ initialRender = false } = {}) {
      if (initialRender) this._term.clear();

      this._initBuffer();

      const sb = this._sb;

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

      this._term.moveTo(
        Math.max(this._RenderState.getInput().length + 5, 5),
        this._term.height - 1,
      );
    }

    _calculateLayout() {
      const bannerHeight = this._RenderState.banner.split("\n").length;
      const headerHeight = this._RenderState.header.length;
      const footerHeight = this._RenderState.footer.length;

      const promptHeight = 3; // Le prompt + some padding
      const sectionGap = 1;

      const bannerY = 0;
      const headerY = bannerHeight + sectionGap;

      const footerY = this._term.height - footerHeight - promptHeight;

      const inputY = this._term.height - 2;

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
        },
      };

      this._calculatePaddingOffset();
    }

    _calculateScroll() {
      const maxScroll = Math.max(
        0,
        this._RenderState.body.length - this.layout.body.height,
      );

      this.scrollIndex = Math.max(0, Math.min(this.scrollIndex, maxScroll));
      this._visibleLines = this._RenderState.body.slice(
        this.scrollIndex,
        this.scrollIndex + this.layout.body.height,
      );
    }

    _calculatePaddingOffset() {
      Object.entries(this.layout).forEach(([section, config]) => {
        if (!config.centered) return;

        const extraLines = config.height - this._RenderState[section].length;
        const padding = Math.floor(extraLines / 2);

        if (extraLines > 1)
          if (config.y) this.layout[section].y += padding;
          else this.layout[section].start += padding;
      });
    }

    _clear(sb) {
      //* Only changed soon!

      for (let y = 0; y < this._term.height; y++) {
        sb.put({ x: 0, y }, " ".padEnd(this._term.width, " "));
      }
    }

    _drawBanner(sb) {
      this._RenderState.banner.split("\n").forEach((line, index) => {
        sb.put({ x: 1, y: index }, line.padEnd(this._term.width, " "));
      });
    }

    _drawHeaderAndFooter(sb) {
      ["header", "footer"].forEach((section) =>
        this._RenderState[section].forEach((line, index) =>
          sb.put(
            {
              x: 1,
              y: this.layout[section].y + index,
            },
            line.padEnd(this._term.width, " "),
          ),
        ),
      );
    }

    _drawBody(sb) {
      for (let y = 0; y < this.layout.body.height; y++) {
        const posY = this.layout.body.start + y;

        if (posY >= this.layout.body.end) break;

        const line = this._visibleLines[y] || " ".padEnd(this._term.width, " ");

        sb.put({ x: 1, y: posY }, line.padEnd(this._term.width, " "));
      }
    }

    _drawInput(sb) {
      const y = this.layout.input.y;

      sb.put({ x: 2, y }, ">".padEnd(this._term.width, " "));

      sb.put({ x: 4, y }, this._RenderState.input);
    }
  },
};
