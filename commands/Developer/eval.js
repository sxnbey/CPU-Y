module.exports.config = {
  name: "eval",
  aliases: ["e"],
  desc: "Evaluates JavaScript-Code",
  listed: false,
};

module.exports.run = (system, args) => {
  system.functions.cpuyBanner();
};
