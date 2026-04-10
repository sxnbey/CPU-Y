module.exports = {
  dontLoad: true,
  type: "class",
  name: "SampleName", // Given automatically if loaded as file
  category: "SampleCategory", // Is automatically set on folder parent if loaded as file
  value: SampleClass,
  options: { persistent: true, instantiate: true },
};

class SampleClass {}
