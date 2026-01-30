module.exports = function setCommandsPath(path) {
  if (typeof path != "string")
    throw new TypeError(`Expected string got ${typeof path} instead`);

  this.config.commandsPath = path;

  return this;
};
