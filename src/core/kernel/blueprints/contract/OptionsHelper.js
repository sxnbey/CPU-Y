const BaseBlueprint = require("../Base.js");

module.exports = class OptionsHelper extends BaseBlueprint {
  static id = "optionshelper";

  static get options() {
    return new Set([
      { name: "id", type: "string", required: true },
      { name: "type", type: "string", required: true },
      { name: "registry", type: "string", required: true },
      { name: "contract", type: "string", required: true },
    ]);
  }

  constructor(data = {}) {
    super(data);

    this._options = new Set(this.constructor.options);

    this._initialize(data);
  }

  get options() {
    return this._options;
  }

  _initialize(data) {
    let dataOptions = data.options;
    const isValidCollection =
      dataOptions && (dataOptions instanceof Set || Array.isArray(dataOptions));
    const existingOptionNames = new Set(
      [...this._options].map(({ name }) => name),
    );

    if (!isValidCollection)
      throw new Error("Options must be an array or a set");

    if (Array.isArray(dataOptions)) dataOptions = new Set(dataOptions);

    dataOptions.forEach((option) => {
      if (!existingOptionNames.has(option.name)) this._options.add(option);
    });

    this._validateMyself();
  }

  _validateMyself() {
    this._options.forEach((optionObject) => {
      const isValidFormat =
        optionObject != null &&
        typeof optionObject == "object" &&
        !Array.isArray(optionObject);

      if (!isValidFormat)
        throw new Error(
          `Option must be an object, but is ${typeof optionObject}\n${JSON.stringify(optionObject)}`,
        );

      const { name, type, required } = optionObject;

      if (typeof name != "string")
        throw new Error(
          `Option attribute "name" ${name} must be a string, but is ${typeof name}\n${JSON.stringify(optionObject)}`,
        );

      if (typeof type != "string")
        throw new Error(
          `Option attribute "type" ${type} for option ${name} must be a string, but is ${typeof type}\n${JSON.stringify(optionObject)}`,
        );

      if (typeof required != "boolean")
        throw new Error(
          `Option attribute "required" ${required} for option ${name} must be a boolean, but is ${typeof required}\n${JSON.stringify(optionObject)}`,
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
};
