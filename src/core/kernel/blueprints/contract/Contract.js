const BaseBlueprint = require("../Base.js");

class ContractBlueprint extends BaseBlueprint {
  constructor(data = {}) {
    super({
      id: data.id || null,
      type: "contract",
      registry: "contracts",
      required: data.required || ["id", "type"],
      optional: data.optional || [],
    });
  }

  validate() {}
}
