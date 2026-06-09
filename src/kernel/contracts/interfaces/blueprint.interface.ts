import { KernelContext } from "../../kernel-context.class";
import { IBlueprintOptions } from "./blueprint-options.interface";

export interface IBlueprint extends IBlueprintOptions {
  initialize(context: KernelContext): void;
}
