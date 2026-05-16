import { IBlueprint } from "./IBlueprint";
import { IRegistry } from "./IRegistry";
import { Process } from "./Process";

export type Resource = IBlueprint | IRegistry<Resource> | Process;
