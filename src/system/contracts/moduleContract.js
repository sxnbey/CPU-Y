const required = ["type", "value"];
const optional = ["dontLoad", "name", "category", "options"];

module.exports = {
  required,
  optional,
  validate,
};

function validate(module) {
  if (!module || typeof module != "object")
    throw new TypeError("Module must be an object");

  for (const key of this.required) {
    if (!(key in module))
      throw new TypeError(`Module is missing required field: ${key}`);
  }

  if (typeof module.type != "string")
    throw new TypeError("module.type must be a string");
}
