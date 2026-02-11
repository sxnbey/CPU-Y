module.exports = function registerUtil(module) {
  this.system.utils[module.name] = module.value;

  return this;
};
