module.exports = class RenderState {
  constructor() {
    this.title = "";
    this.lines = [];
    this.footer = "";
  }

  setTitle(title) {
    this.title = title;

    return this;
  }

  setLines(lines) {
    this.lines = lines;

    return this;
  }

  addLine(line) {
    this.lines.push(line);

    return this;
  }

  setFooter(footer) {
    this.footer = footer;

    return this;
  }

  clear() {
    this.title = "";
    this.lines = [];
    this.footer = "";

    return this;
  }
};
