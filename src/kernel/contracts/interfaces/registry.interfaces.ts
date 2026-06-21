import { IMetadata, RegistryMap } from "..";

export interface IRegistry<N, V> {
  getName(): N;

  register(id: string, value: V): V;
  delete(id: string): this;

  get(id: string): V | undefined;
  has(id: string): boolean;
}

export interface IMainRegistry {
  register<K extends keyof RegistryMap>(key: K, registry: RegistryMap[K]): void;

  get<R extends keyof RegistryMap>(registry: R): RegistryMap[R];
  has<R extends keyof RegistryMap>(
    registry: R | string,
  ): registry is keyof RegistryMap;

  getAllRegistries<K extends keyof RegistryMap>(): RegistryMap[K][];
}

export interface IRegistryPayloadMap {
  instanceRegistry: IMetadata;
}
