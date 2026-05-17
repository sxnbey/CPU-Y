import { IRegistry } from "./IRegistry";
import { IBlueprint } from "./IBlueprint";
import { Process } from "./Process";

export interface RegistryMap {
  processRegistry: IRegistry<Process>;
  blueprintRegistry: IRegistry<IBlueprint>;
}
