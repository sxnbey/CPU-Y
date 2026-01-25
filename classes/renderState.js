const EventEmitter = require("events");

module.exports = class RenderState extends EventEmitter {
  constructor() {
    super();

    this.title = "";
    this.lines = [];
    this.footer = "";
  }

  setTitle(title) {
    this.title = title;
    this.emit("changed");

    return this;
  }

  setLines(lines) {
    this.lines = lines;
    this.emit("changed");

    return this;
  }

  addLine(line) {
    this.lines.push(line);
    this.emit("changed");

    return this;
  }

  setFooter(footer) {
    this.footer = footer;
    this.emit("changed");

    return this;
  }

  clear() {
    this.title = "";
    this.lines = [];
    this.footer = "";

    return this;
  }
};
