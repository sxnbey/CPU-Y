import { IRegistryMap } from "#kernel/contract/index";

import { BaseRegistry } from "#kernel/registry/base-registry";

type ServiceRegistryEntry = {
  metadata: { id: string; targetRegistry: keyof IRegistryMap };
  service: unknown;
};

export class ServiceRegistry extends BaseRegistry<
  "serviceRegistry",
  ServiceRegistryEntry
> {
  static registryName = "serviceRegistry";

  public listAll(): unknown[] {
    return Array.from(this.storage.values()).map((entry) => entry.service);
  }

  public get(id: string): unknown | undefined {
    const target = this.storage.get(id);

    if (!target) return undefined;

    return target.service;
  }

  public getRaw(id: string): ServiceRegistry | unknown {
    const target = this.storage.get(id);

    if (!target) return undefined;

    return target;
  }

  public register(id: string, value: unknown): ServiceRegistryEntry {
    if (this.storage.has(id))
      throw new Error(`Service with id "${id}" is already registered.`);

    const entry = {
      metadata: { id, targetRegistry: this.getName() },
      service: value,
    };

    this.storage.set(id, entry);

    this.emit("register", id, entry);

    return entry;
  }
}
