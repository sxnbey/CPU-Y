const BaseBlueprint = require("../Base.js");

class OptionsHelper extends BaseBlueprint {
  static id = "optionshelper";

  static get required() {
    return new Set([
      { option: "id", type: "string" },
      { option: "type", type: "string" },
      { option: "registry", type: "string" },
      { option: "contract", type: "string" },
    ]);
  }
  static get optional() {
    return new Set();
  }

  constructor(data = {}) {
    this._required = new Set(this.constructor.required);
    this._optional = new Set(this.constructor.optional);

    this._initialize(data);

    super(data);
  }

  get required() {
    return this._required;
  }

  get optional() {
    return this._optional;
  }

  _initialize(data) {
    Object.entries({ required: "_required", optional: "_optional" }).forEach(
      ([key, attribute]) => {
        const dataArray = Array.from(data[key]);

        // !

        if (!dataArray?.forEach)
          throw new Error(
            `${key} options must be an array or set for ${this.constructor.id}`,
          );

        dataArray.forEach((newOption) => {
          const exists = [...this[attribute]].some(
            (existing) => existing.option == newOption.option,
          );

          if (!exists) this[attribute].add(newOption);
        });
      },
    );

    this._validateMyself();
  }

  _validateMyself() {
    const allRules = [...this._required, ...this._optional];

    allRules.forEach(({ option, type }) => {
      if (typeof option != "string")
        throw new Error(`Option name ${option} must be a string`);

      if (typeof type != "string")
        throw new Error(
          `Option type ${type} for option ${option} must be a string`,
        );
    });
  }

  validateOptions(targetData) {
    if (!targetData || typeof targetData != "object")
      throw new Error("Validation target must be an object");

    this._validateRequiredOptions(targetData);
    this._validateOptionalOptions(targetData);

    return true;
  }

  _validateRequiredOptions(targetData) {
    this._required.forEach((rule) => {
      const value = targetData[rule.option];

      if (value == undefined)
        throw new Error(`Missing required option: ${rule.option}`);

      if (typeof value != rule.type)
        throw new Error(
          `Required option ${rule.option} must be ${rule.type}, but is ${typeof value}`,
        );
    });
  }

  _validateOptionalOptions(targetData) {
    this._optional.forEach((rule) => {
      const value = targetData[rule.option];

      if (value != undefined && typeof value != rule.type)
        throw new Error(
          `Optional option ${rule.option} must be ${rule.type}, but is ${typeof value}`,
        );
    });
  }
}
