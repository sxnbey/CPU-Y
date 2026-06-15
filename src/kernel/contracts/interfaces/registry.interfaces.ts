import { IBlueprintMetadata, RegistryMap } from "..";

export interface IRegistry<N, V> {
  getName(): N;

  register(id: string, value: V): V;
  delete(id: string): this;

  get(id: string): V | undefined;
  has(id: string): boolean;
}

export interface IMainRegistry {
  register<K extends keyof RegistryMap>(key: K, registry: RegistryMap[K]): void;

  get<K extends keyof RegistryMap>(key: K): RegistryMap[K];
}

export interface IRegistryPayloadMap {
  serviceRegistry: IBlueprintMetadata;
  blueprintRegistry: IBlueprintMetadata;
}
