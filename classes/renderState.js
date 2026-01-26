const EventEmitter = require("events");

module.exports = class RenderState extends EventEmitter {
  constructor() {
    super();

    this.banner = `  ______   _______   __    __       __      __ 
 /      \\ |       \\ |  \\  |  \\     |  \\    /  \\
|  $$$$$$\\| $$$$$$$\\| $$  | $$      \\$$\\  /  $$
| $$   \\$$| $$__/ $$| $$  | $$ ______\\$$\\/  $$ 
| $$      | $$    $$| $$  | $$|      \\$$  $$  
| $$   __ | $$$$$$$ | $$  | $$ \\$$$$$$ \\$$$$   
| $$__/  \\| $$      | $$__/ $$         | $$    
 \\$$    $$| $$       \\$$    $$         | $$    
  \\$$$$$$  \\$$        \\$$$$$$           \\$$`;
    this.header = ["CPU-Y - Header-Platzhaltertext, der maximal tuff ist"];
    this.body =
      "hallo du mann o i j lj h p j p j2j l2jl l2j lkj kl2j l l2jlk".split(" ");
    this.footer = ["CPU-Y - Footer-Platzhaltertext, der maximal tuff ist"];
  }

  setHeader(title) {
    this.header = title;
    this.emit("changed");

    return this;
  }

  setBody(lines) {
    this.body = lines;
    this.emit("changed");

    return this;
  }

  addBodyLine(line) {
    this.body.push(line);
    this.emit("changed");

    return this;
  }

  setFooter(footer) {
    this.footer = footer;
    this.emit("changed");

    return this;
  }

  clear() {
    this.header = "";
    this.lines = [];
    this.footer = "";

    return this;
  }
};
