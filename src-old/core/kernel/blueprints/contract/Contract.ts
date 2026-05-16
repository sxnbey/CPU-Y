const BaseBlueprint = require("../Base.js");
const OptionsHelper = require("./OptionsHelper.js");

module.exports = class ContractBlueprint extends BaseBlueprint {
  constructor(data = {}) {
    super(data);
  }

  validate() {}
};
