import { IMetadata, RegistryMap } from "../index.js";

export interface IBlueprint<TConfig> extends IMetadata {
  config?: TConfig | undefined;
}

export interface IDynamicBlueprintConfig {
  id: string;
  targetRegistry: keyof RegistryMap;

  [key: string]: unknown;
}

export interface IDynamicBlueprint extends IBlueprint<IDynamicBlueprintConfig> {
  [key: string]: unknown;
}

export interface IBlueprintSchemaRule {
  type: "string" | "number" | "boolean";
  required: boolean;
}
