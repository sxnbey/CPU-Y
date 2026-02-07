const EventEmitter = require("events");

module.exports = {
  options: { instantiate: true },
  category: "ROOT",
  type: "class",
  value: class RenderState extends EventEmitter {
    constructor() {
      super();

      this._banner = `  ______   _______   __    __       __      __ 
 /      \\ |       \\ |  \\  |  \\     |  \\    /  \\
|  $$$$$$\\| $$$$$$$\\| $$  | $$      \\$$\\  /  $$
| $$   \\$$| $$__/ $$| $$  | $$ ______\\$$\\/  $$ 
| $$      | $$    $$| $$  | $$|      \\$$  $$  
| $$   __ | $$$$$$$ | $$  | $$ \\$$$$$$ \\$$$$   
| $$__/  \\| $$      | $$__/ $$         | $$    
 \\$$    $$| $$       \\$$    $$         | $$    
  \\$$$$$$  \\$$        \\$$$$$$           \\$$`;
      this._header = ["CPU-Y - Header-Platzhaltertext, der maximal tuff ist"];
      this._body =
        "hallo du mann o i j lj h p j p j2j l2jl l2j lkj kl2j l l2jlk".split(
          " ",
        );
      this._footer = ["CPU-Y - Footer-Platzhaltertext, der maximal tuff ist"];
      this._input = "";
    }

    setHeader(title) {
      this._header = title;
      this.emit("changed");

      return this;
    }

    setBody(lines) {
      this._body = lines;
      this.emit("changed");

      return this;
    }

    addBodyLine(line) {
      this._body.push(line);
      this.emit("changed");

      return this;
    }

    setFooter(footer) {
      this._footer = footer;
      this.emit("changed");

      return this;
    }

    setInput(input) {
      this._input = input;
      this.emit("changed");

      return this;
    }

    clear() {
      this._header = [];
      this._body = [];
      this._footer = [];
      this._input = "";

      return this;
    }

    getBanner() {
      return this._banner;
    }

    getHeader() {
      return this._header;
    }

    getBody() {
      return this._body;
    }

    getFooter() {
      return this._footer;
    }

    getInput() {
      return this._input;
    }
  },
};
