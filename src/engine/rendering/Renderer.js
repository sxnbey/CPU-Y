const ScreenBuffer = require("terminal-kit").ScreenBuffer;

module.exports = {
  category: "ROOT",
  type: "class",
  value: class Renderer {
    constructor(system) {
      this._system = system;
      this._term = system.term;

      this._sb;
      this._RenderState = system.RenderState;

      this._renderSnapshot = {};
      this.lastRender = {};
      this.layoutMap = {};

      this.scrollIndex = 0;
      this._visibleLines = [];
    }

    // render({ initialRender = false, resetCursor = false } = {}) {
    //   if (initialRender) this._term.clear();

    //   this._initBuffer();

    //   const sb = this._sb;

    //   this._clear(sb);

    //   const fff = { body: {}, header: {}, input: {} };

    //   function alignVertical(items) {
    //     for (const item in items)
    //       switch (item.fillType) {
    //         case "fixed":
    //       }
    //   }

    //   sb.draw();
    // }

    render({ initialRender = false, resetCursor = false } = {}) {
      if (initialRender) this._term.clear();

      this._initBuffer();

      const sb = this._sb;

      this._createRenderSnapshot();
      this._calculateLayoutMap();
      this._calculateScroll();
      this._clear(sb);

      [
        this._drawBanner,
        this._drawHeaderAndFooter,
        this._drawBody,
        this._drawInput,
      ].forEach((func) => func.call(this, sb));

      sb.draw();

      if (resetCursor || initialRender)
        this._term.moveTo(
          this._system.InputHandler.getCursorPosX(),
          this._term.height - 1,
        );
    }

    _initBuffer() {
      this._sb = new ScreenBuffer({
        dst: this._term,
      });
    }

    _createRenderSnapshot() {
      this._renderSnapshot = {
        banner: this._RenderState.getBanner(),
        header: this._RenderState.getHeader(),
        body: this._RenderState.getBody(),
        footer: this._RenderState.getFooter(),
        input: this._RenderState.getInput(),
      };
    }

    _calculateLayoutMap() {
      const bannerHeight = this._renderSnapshot.banner.split("\n").length;
      const headerHeight = this._renderSnapshot.header.length;
      const footerHeight = this._renderSnapshot.footer.length;

      const promptHeight = 3; // Le prompt + some padding
      const sectionGap = 1;

      const bannerY = 0;
      const headerY = bannerHeight + sectionGap;

      const footerY = this._term.height - footerHeight - promptHeight;

      const inputY = this._term.height - 2;

      const bodyStart = headerY + headerHeight + sectionGap;
      const bodyEnd = footerY - sectionGap;
      const bodyHeight = Math.max(0, bodyEnd - bodyStart);

      this.layoutMap = {
        banner: { y: bannerY, height: bannerHeight },
        header: { y: headerY, height: headerHeight, centered: false },
        body: {
          start: bodyStart,
          end: bodyEnd,
          height: bodyHeight,
          centered: true,
        },
        footer: { y: footerY, height: footerHeight, centered: false },
        input: { y: inputY },
      };

      // this._calculatePaddingOffset();
    }

    _calculateScroll() {
      const maxScroll = Math.max(
        0,
        this._renderSnapshot.body.length - this.layoutMap.body.height,
      );

      this.scrollIndex = Math.max(0, Math.min(this.scrollIndex, maxScroll));

      this._visibleLines = this._renderSnapshot.body.slice(
        this.scrollIndex,
        this.scrollIndex + this.layoutMap.body.height,
      );
    }

    _calculatePaddingOffset() {
      Object.entries(this.layoutMap).forEach(([section, config]) => {
        if (!config.centered) return;

        const extraLines = config.height - this._renderSnapshot[section].length;
        const padding = Math.floor(extraLines / 2);

        if (extraLines > 1)
          if (config.y) this.layoutMap[section].y += padding;
          else this.layoutMap[section].start += padding;
      });
    }

    _clear(sb) {
      //* Only changed soon!

      for (let y = 0; y < this._term.height; y++) {
        sb.put({ x: 0, y }, " ".padEnd(this._term.width, " "));
      }
    }

    _drawBanner(sb) {
      this._renderSnapshot.banner.split("\n").forEach((line, index) => {
        sb.put({ x: 1, y: index }, line.padEnd(this._term.width, " "));
      });
    }

    _drawHeaderAndFooter(sb) {
      ["header", "footer"].forEach((section) =>
        this._renderSnapshot[section].forEach((line, index) =>
          sb.put(
            {
              x: 1,
              y: this.layoutMap[section].y + index,
            },
            line.padEnd(this._term.width, " "),
          ),
        ),
      );
    }

    _drawBox(sb, title, { x, y, w, h }) {
      for (let i = 0; i < h; i++) sb.put({ x, y: y + i }, " ".repeat(w));

      sb.put({ x, y }, "┌" + "─".repeat(w - 2) + "┐");

      for (let i = 1; i < h - 1; i++) {
        sb.put({ x: x, y: y + i }, "│");
        sb.put({ x: x + w - 1, y: y + i }, "│");
      }

      sb.put({ x: x, y: y + h - 1 }, "└" + "─".repeat(w - 2) + "┘");

      if (title) sb.put({ x: x + 2, y: y }, ` ${title} `);
    }

    _drawBody(sb) {
      const body = this.layoutMap.body;

      this._drawBox(sb, "coole box", {
        x: 1,
        y: body.start,
        w: this._term.width - 2,
        h: body.height,
      });

      this._visibleLines = this._wrapText(this._visibleLines, 20);

      // for (let y = 0; y < body.height - 2; y++) {
      //   const posY = body.start + 1 + y;
      //   const line = this._visibleLines[y] || " ".repeat(this._term.width - 2);

      //   sb.put({ x: 3, y: posY }, line.padEnd(this._term.width - 5, " "));
      // }
    }

    _wrapText(text, width) {
      const lines = [];
      const words = text.join(" ").split(" ");

      let current = "";

      for (const word of words)
        if ((current + word).length > width) {
          lines.push(current.trimEnd());

          current = word + " ";
        } else current += word + " ";

      if (current.trim()) lines.push(current.trimEnd());

      return lines;
    }

    _drawInput(sb) {
      const y = this.layoutMap.input.y;

      sb.put({ x: 2, y }, ">".padEnd(this._term.width, " "));

      sb.put({ x: 4, y }, this._renderSnapshot.input);
    }
  },
};
