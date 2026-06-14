import { IRegistryMap } from "./registry.interfaces";

import { KernelContext } from "../../kernel-context.class";

export interface IBlueprintOptions {
  id: string;
  targetRegistry: keyof IRegistryMap;
}

export interface IBlueprint extends IBlueprintOptions {
  initialize(context: KernelContext): void;
}

export interface IDynamicBlueprintOptions extends IBlueprintOptions {
  [key: string]: unknown;
}

export interface IDynamicBlueprint extends IBlueprint {
  [key: string]: unknown;
}

export interface IBlueprintSchemaRule {
  type: "string" | "number" | "boolean";
  required: boolean;
}
