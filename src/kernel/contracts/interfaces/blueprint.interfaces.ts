import { IMetadata, RegistryMap } from "..";

import { KernelContext } from "../../kernel-context.class";

export interface IBlueprint<TConfig> extends IMetadata {
  config?: TConfig | undefined;

  initialize(context: KernelContext): void;
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
