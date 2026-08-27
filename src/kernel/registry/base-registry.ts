import { EventEmitter } from "node:events";

import { IRegistryMap, IRegistryEntry } from "../contract/index.js";

export abstract class BaseRegistry<
  N extends keyof IRegistryMap,
  V extends IRegistryEntry<unknown> = IRegistryEntry<unknown>,
> extends EventEmitter {
  protected name: N;
  protected storage: Map<string, V>;

  constructor() {
    super();

    const constructor = this.constructor as unknown as { registryName: N };

    if (!Object.hasOwn(constructor, "registryName"))
      throw new Error(
        `Registry ${this.constructor.name} must define a static "registryName".`,
      );

    this.name = constructor.registryName;
    this.storage = new Map();
  }

  public listAll(): V["value"][] {
    return Array.from(this.storage.values()).map((entry) => entry.value);
  }

  public listAllRaw(): V[] {
    return Array.from(this.storage.values());
  }

  public get(id: string): V["value"] | undefined {
    const target = this.storage.get(id);

    if (!target) return undefined;

    return target.value;
  }

  public getRaw(id: string): V | undefined {
    const target = this.storage.get(id);

    if (!target) return undefined;

    return target;
  }

  public has(id: string): boolean {
    return this.storage.has(id);
  }

  public register(
    id: string,
    value: V["value"],
    optionalMetadata?: Record<string, unknown>,
  ): V {
    if (this.storage.has(id))
      throw new Error(`Entry with id "${id}" is already registered.`);

    const entry = {
      value,
      metadata: { ...optionalMetadata, id, targetRegistry: this.getName() },
    } as unknown as V;

    this.storage.set(id, entry);

    this.emit("register", id, entry);

    return entry;
  }

  public registerWrapped(value: V): V {
    const id = value.metadata.id;

    if (this.storage.has(id))
      throw new Error(`Entry with id "${id}" is already registered.`);

    this.storage.set(id, value);

    this.emit("register", id, value);

    return value;
  }

  public delete(id: string): boolean {
    const entry = this.getRaw(id);

    if (!entry) return false;

    this.storage.delete(id);

    this.emit("delete", id, entry);

    return true;
  }

  public clear(): this {
    this.storage.clear();

    this.emit("clear");

    return this;
  }

  public getName(): N {
    return this.name;
  }
}
