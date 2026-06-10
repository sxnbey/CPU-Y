import { IRegistryMap } from "./registry.interfaces";

import { KernelContext } from "../../kernel-context.class";

export interface IBlueprintOptions {
  id: string;
  targetRegistry: keyof IRegistryMap;
}

export interface IBlueprint extends IBlueprintOptions {
  initialize(context: KernelContext): void;
}
