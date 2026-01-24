module.exports = (system) => {
  return class Renderer {
    constructor(interval = 200) {
      this.system = system;
      this.interval = interval;
      this.timer = null;
      this.lastRender = "";
    }

    start() {
      if (this.timer) return;

      this.timer = setInterval(() => this.render(), this.interval);
    }

    stop() {
      clearInterval(this.timer);

      this.timer = null;
    }

    buildRenderedString() {
      const { title, lines, footer } = this.system.toRender;
      const output = [];

      title ? output.push(title, "") : null;

      lines.length
        ? output.push(...lines)
        : output.push(
            "du hund du hast nix zum einzeigen angegeben was mit dir",
          );

      footer ? output.push("", footer) : null;

      return output.join("\n");
    }

    render(forced = false) {
      const output = this.buildRenderedString();

      // No duplicate renders unless forced.

      if (!forced && output == this.lastRender) return;

      this.lastRender = output;

      // Clears the console.

      process.stdout.write("\x1Bc");
      process.stdout.write(output);
    }
  };
};
