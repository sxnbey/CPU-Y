import type { IRegistryMap, IRegistryEntry, IRegistry } from "#contract";

import { RegistryError } from "#kernel/error/registry-error";
import { EventEmitter } from "node:events";

export abstract class BaseRegistry<
  N extends keyof IRegistryMap,
  V extends IRegistryEntry<unknown> = IRegistryEntry<unknown>,
>
  extends EventEmitter
  implements IRegistry<N, V>
{
  protected storage: Map<string, V> = new Map();

  constructor(protected name: N) {
    super();
  }

  public getName(): N {
    return this.name;
  }

  public listAll(): V["value"][] {
    return Array.from(this.storage.values()).map((entry) => entry.value);
  }

  public listAllWrapped(): V[] {
    return Array.from(this.storage.values());
  }

  public get(id: string): V["value"] {
    const target = this.storage.get(id);

    if (!target)
      throw new RegistryError({
        errorCode: "ERR_ENTRY_NOT_FOUND",
        args: { name: id, origin: this.constructor.name },
      });

    return target.value;
  }

  public getWrapped(id: string): V {
    const target = this.storage.get(id);

    if (!target)
      throw new RegistryError({
        errorCode: "ERR_ENTRY_NOT_FOUND",
        args: { name: id, origin: this.constructor.name },
      });

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
      throw new RegistryError({
        errorCode: "ERR_ENTRY_ALREADY_REGISTERED",
        args: { name: id, origin: this.constructor.name },
      });

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
      throw new RegistryError({
        errorCode: "ERR_ENTRY_ALREADY_REGISTERED",
        args: { name: id, origin: this.constructor.name },
      });

    this.storage.set(id, value);

    this.emit("register", id, value);

    return value;
  }

  public delete(id: string): boolean {
    const entry = this.getWrapped(id);

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
}
