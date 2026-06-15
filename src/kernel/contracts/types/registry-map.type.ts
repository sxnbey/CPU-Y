import { IRegistryPayloadMap, IRegistry } from "..";

export type RegistryMap = {
  [K in keyof IRegistryPayloadMap]: IRegistry<K, IRegistryPayloadMap[K]>;
};
