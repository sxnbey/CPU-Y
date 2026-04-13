const BaseBlueprint = require("../Base.js");

class ContractBlueprint extends BaseBlueprint {
  required = [
    { option: "id", type: "string" },
    { option: "type", type: "string" },
    { option: "registry", type: "string" },
    { option: "contract", type: "string" },
  ];

  constructor(data = {}) {
    super({
      id: data.id || null,
      type: data.type || null,
      registry: data.registry || null,
    });
  }

  validate() {}
}
