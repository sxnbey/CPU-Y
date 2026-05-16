module.exports = {
  type: "util",
  /**
   * Random number generator.
   * @param {number} min inclusive
   * @param {number} max inclusive
   * @returns {number}
   */
  value: function rng(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
};
