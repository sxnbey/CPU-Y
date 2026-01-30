module.exports = {
  dontLoad: true,
  type: "class",
  name: "SampleName", // Given automatically if loaded as file
  category: "SampleCategory", // Given automatically if loaded as file, but is not needed
  value: SampleClass,
  options: { persistent: true, instantiate: true },
};

class SampleClass {}
