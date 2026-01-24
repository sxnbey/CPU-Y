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
      return [
        this.system.functions.banner(),
        "",
        title || "<!No title to display!>",
        "",
        "",
        ...(lines.length ? lines : ["<!No lines to display!>"]),
        "",
        "",
        footer ? this.system.chalk.grey(footer) : "<!No footer to display!>",
      ].join("\n");
    }

    render(forced = false) {
      const output = this.buildRenderedString();

      // No duplicate renders unless forced.

      if (!forced && output == this.lastRender) return;

      this.lastRender = output;

      // "\x1Bc" apparently clears the console.

      process.stdout.write("\x1Bc" + output);

      this.system.functions.prompt();
    }
  };
};
