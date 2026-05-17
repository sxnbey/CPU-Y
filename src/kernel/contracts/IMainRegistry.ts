import { RegistryMap } from "./RegistryMap";

export interface IMainRegistry {
  register<K extends keyof RegistryMap>(key: K, registry: RegistryMap[K]): void;

  get<K extends keyof RegistryMap>(key: K): RegistryMap[K];
}
