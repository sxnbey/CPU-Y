module.exports = {
  type: "function",
  value: sample,
  dontLoad: true,
  options: { persistent: true, execute: true },
};

function sample() {}
