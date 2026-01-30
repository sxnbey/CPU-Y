module.exports = function setSubcommandsPath(path) {
  if (typeof path != "string")
    throw new TypeError(`Expected string got ${typeof path} instead`);

  this.config.subcommandsPath = path;

  return this;
};
