const BasePanel = require("./BasePanel.js").value;

module.exports = {
  dontLoad: true,
  type: "class",
  value: class VerticalPanel extends BasePanel {
    _draw() {
      for (let i = 0; i < this.components.length; i++) {
        const currentComponent = this.components[i];
        const currentX = this.x;
        const currentY =
          this.y + i * Math.floor(this.h / this.components.length);
      }
    }
  },
};
