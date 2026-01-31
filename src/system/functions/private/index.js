const getter = require("./getter/index.js");
const setter = require("./setter/index.js");
const persistence = require("./persistence/index.js");
const utils = require("./utils/index.js");
const register = require("./register/index.js");

module.exports = {
  ...getter,
  ...setter,
  ...persistence,
  ...utils,
  ...register,
};
