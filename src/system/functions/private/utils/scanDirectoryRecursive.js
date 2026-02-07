module.exports = function scanDirectoryRecursive(path, files = []) {
  this.fs.readdirSync(path, { withFileTypes: true }).forEach((entry) => {
    const fullPath = this.path.join(path, entry.name);

    if (entry.isDirectory()) this.scanDirectoryRecursive(fullPath, files);
    else if (entry.isFile() && entry.name.endsWith(".js")) files.push(fullPath);
  });

  return files;
};
