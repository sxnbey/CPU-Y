const BasePanel = require("./BasePanel.js").value;

module.exports = {
  dontLoad: true,
  type: "class",
  value: class HorizontalPanel extends BasePanel {
    _draw() {
      for (let i = 0; i < this.components.length; i++) {
        const currentComponent = this.components[i];
        const currentX =
          this.x + i * Math.floor(this.w / this.components.length);
        const currentY = this.y;
      }
    }
  },
};
