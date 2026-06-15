import { RegistryMap } from "..";

import { KernelContext } from "../../kernel-context.class";

export interface IBlueprintConfig {
  id: string;
  targetRegistry: keyof RegistryMap;
}

export interface IBlueprint extends IBlueprintConfig {
  initialize(context: KernelContext): void;
}

export interface IDynamicBlueprintConfig extends IBlueprintConfig {
  [key: string]: unknown;
}

export interface IDynamicBlueprint extends IBlueprint {
  [key: string]: unknown;
}

export interface IBlueprintSchemaRule {
  type: "string" | "number" | "boolean";
  required: boolean;
}

export interface IBlueprintMetadata {
  id: string;
  targetRegistry: keyof RegistryMap;
}
