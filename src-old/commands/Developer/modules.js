module.exports = {
  type: "command",
  value: execute,
  config: {
    aliases: [],
    desc: "test",
    listed: true,
  },
};

function execute(system, args) {
  const arr = [];

  system.allRegisteredModules.forEach((module) =>
    arr.push(`Name: ${module.name}, Type: ${module.type}`),
  );

  system.RenderState.setBody(arr);
}
// why am i not mapping it lmfao
