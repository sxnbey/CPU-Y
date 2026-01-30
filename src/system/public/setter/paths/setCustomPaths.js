module.exports = function setCustomPaths(pathArray) {
  if (!Array.isArray(pathArray))
    throw new TypeError(`Expected array got ${typeof pathArray} instead`);

  this.config.customPaths = pathArray;

  return this;
};
