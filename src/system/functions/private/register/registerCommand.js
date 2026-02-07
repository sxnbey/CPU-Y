module.exports = function registerCommand(module) {
  this.commands.push(module.file);

  return this;
};
