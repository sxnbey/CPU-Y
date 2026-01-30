module.exports = {
  type: "function",
  export: sample,
  dontLoad: true,
  options: { persistent: true, execute: true },
};

function sample() {}
