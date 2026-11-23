import type EventEmitter from "events";
import type { BaseMetadata } from "./metadata.js";

export interface Registry<
  N extends RegistryName = RegistryName,
  V extends RegistryEntry<unknown> = RegistryEntry<unknown>,
> extends EventEmitter {
  getName(): N;

  listAllIds(): string[];
  listAllWrapped(): V[];

  get(id: string): V["value"];
  getWrapped(id: string): V;

  has(id: string): boolean;

  register({
    id,
    value,
    metadata,
  }: {
    id: string;
    value: V["value"];
    metadata?: Record<string, unknown>;
  }): V;
  registerWrapped(value: V): V;

  delete(id: string): boolean;
  clear(): this;
}

export interface RegistryPayloadMap {
  serviceRegistry: RegistryEntry<unknown, BaseMetadata>;
}

export type KnownRegistries = {
  [R in keyof RegistryPayloadMap]: Registry<R, RegistryPayloadMap[R]>;
};

export type RegistryName = keyof RegistryPayloadMap;

export interface RegistryEntry<V, M extends BaseMetadata = BaseMetadata> {
  value: V;
  metadata: M;
}
