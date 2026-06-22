import { IRegistryPayloadMap, IRegistry } from "../index.js";

export type RegistryMap = {
  [K in keyof IRegistryPayloadMap]: IRegistry<K, IRegistryPayloadMap[K]>;
};
