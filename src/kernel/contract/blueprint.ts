import { IBaseMetadata, IRegistryMap } from "./index.js";

export interface IBlueprint<TConfig> extends IBaseMetadata {
  config?: TConfig | undefined;
}

export interface IDynamicBlueprintConfig {
  id: string;
  targetRegistry: keyof IRegistryMap;

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
