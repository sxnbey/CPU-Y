import { IRegistryMap } from "./registry.interfaces";

import { KernelContext } from "../../kernel-context.class";

export interface IBlueprintOptions {
  id: string;
  targetRegistry: keyof IRegistryMap;
  [key: string]: any;
}

export interface IBlueprint extends IBlueprintOptions {
  initialize(context: KernelContext): void;
}

export interface IBlueprintSchemaRule {
  type: "string" | "number" | "boolean";
  required: boolean;
}
