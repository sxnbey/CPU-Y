import { IBaseMetadata } from "./index.js";

export interface IBlueprint<TConfig> {
  config?: TConfig | undefined;
}

export interface IDynamicBlueprintConfig extends IBaseMetadata {
  [key: string]: unknown;
}

export interface IDynamicBlueprint extends IBlueprint<IDynamicBlueprintConfig> {
  [key: string]: unknown;
}

export interface IBlueprintSchemaRule {
  type: "string" | "number" | "boolean";
  required: boolean;
}

export type BlueprintSchemaRules = Record<string, IBlueprintSchemaRule>;
