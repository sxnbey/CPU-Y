module.exports = function _registerCommand(module) {
  this.commands.push(module.file);

  return this;
};
