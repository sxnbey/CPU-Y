module.exports = class BaseRole {
  constructor({ options = {} }) {
    this.id = options.id || null;
    this.type = options.type || null;
  }

  // _normalizeOptions(options) {
  //   return {
  //     persistent: options?.persistent || false,
  //     execute: options?.execute || false,
  //     instantiate: options?.instantiate || false,
  //   };
  // }
};
