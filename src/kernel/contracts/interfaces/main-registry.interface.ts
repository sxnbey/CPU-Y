import { IRegistryMap } from "./registry-map.interface";

export interface IMainRegistry {
  register<K extends keyof IRegistryMap>(
    key: K,
    registry: IRegistryMap[K],
  ): void;

  get<K extends keyof IRegistryMap>(key: K): IRegistryMap[K];
}
