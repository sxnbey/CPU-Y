module.exports = function addCustomPath(path) {
  if (typeof path != "string")
    throw new TypeError(`Expected string got ${typeof path} instead`);

  if (!this.config.customPaths) this.config.customPaths = [];

  this.config.customPaths.push(path);

  return this;
};
