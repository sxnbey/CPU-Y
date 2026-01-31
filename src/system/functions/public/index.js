const getter = require("./getter/index.js");
const setter = require("./setter/index.js");
const register = require("./register/index.js");

module.exports = { ...getter, ...setter, ...register };
