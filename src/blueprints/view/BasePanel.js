const { ScreenBuffer, terminal } = require("terminal-kit");

module.exports = {
  dontLoad: true,
  type: "class",
  value: class BasePanel {
    static sb;
    static term;
    components;
    x = 0;
    y = 0;
    w = 0;
    h = 0;

    constructor(x, y, w, h, count) {
      if (!BasePanel.sb) {
        BasePanel._term = terminal;

        BasePanel._sb = new ScreenBuffer({
          dst: this._term,
        });
      }
      if (this.constructor === BasePanel) throw "Invalid";

      if (isNaN(x) || isNaN(y)) throw "Invalid";

      this.components = new Array(count).fill([]);

      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }

    updatePos(x, y) {
      this.x = x;
      this.y = y;

      return this;
    }

    _draw() {
      throw "Invalid";
    }

    addComponents(panelIndex, ...components) {
      if (!this.components[panelIndex]) throw "Invalid Index";
      this.components[panelIndex].push(...components);
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
  },
};
