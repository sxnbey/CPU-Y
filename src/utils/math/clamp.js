module.exports = {
  type: "util",
  /**
   * Clamps a number between min and max.
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  value: function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  },
};
