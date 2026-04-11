const required = ["type", "value"];
const optional = ["dontLoad", "name", "category", "options"];

module.exports = {
  required,
  optional,
  validate,
};

function validate(module) {
  if (!module || typeof module != "object")
    throw new TypeError(`Module must be an object\n${module.path}`);

  for (const key of required) {
    if (!(key in module))
      throw new TypeError(
        `Module is missing required field: ${key}\n${module.path}`,
      );
  }

  if (typeof module.type != "string")
    throw new TypeError("module.type must be a string");

  if (typeof module.name != "string")
    throw new TypeError("module.name must be a string");

  return true;
}
