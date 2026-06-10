import { IBlueprint } from "./blueprint.interfaces";
import { Service } from "../types/service.type";

export interface IRegistry<V, N> {
  getName(): N;

  register(id: string, value: V): V;
  delete(id: string): this;

  get(id: string): V | undefined;
  has(id: string): boolean;
}

export interface IMainRegistry {
  register<K extends keyof IRegistryMap>(
    key: K,
    registry: IRegistryMap[K],
  ): void;

  get<K extends keyof IRegistryMap>(key: K): IRegistryMap[K];
}

export interface IRegistryMap {
  serviceRegistry: IRegistry<Service, "serviceRegistry">;
  blueprintRegistry: IRegistry<IBlueprint, "blueprintRegistry">;
}
