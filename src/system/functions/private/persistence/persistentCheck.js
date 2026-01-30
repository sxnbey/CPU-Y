module.exports = function _persistentCheck(value) {
  return;

  // ID gen and check soon cuz not every value has a category

  const exists = this.survivesHotReload.some(
    (i) => i.name == value.name && i.category == value.category,
  );

  if (!exists) this.survivesHotReload.push(value);

  return exists;
};
