import { IRegistry } from "./registry.interface";
import { IBlueprint } from "./blueprint.interface";
import { Service } from "../types/service.type";

export interface IRegistryMap {
  serviceRegistry: IRegistry<Service, "serviceRegistry">;
  blueprintRegistry: IRegistry<IBlueprint, "blueprintRegistry">;
}
