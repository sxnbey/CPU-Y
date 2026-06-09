import { IRegistry } from "./registry.interface";
import { IBlueprint } from "./blueprint.interface";
import { Process } from "../types/process.type";

export interface IRegistryMap {
  processRegistry: IRegistry<Process>;
  blueprintRegistry: IRegistry<IBlueprint>;
}
