import type { IRegistryMap } from "#kernel/contract/index";

import { MainRegistry } from "./main-registry.js";
import { RegistryError } from "#kernel/error/registry-error";

export class RegistryResolver {
  constructor(private readonly mainRegistry: MainRegistry) {}

  public get<K extends keyof IRegistryMap>(target: K): IRegistryMap[K];

  public get<T>(target: string): T;

  public get(target: string): unknown {
    if (!this.has(target))
      throw new RegistryError({
        errorCode: "ERR_ENTRY_NOT_FOUND",
        args: { name: target, origin: this.constructor.name },
      });

    return this.find(target);
  }

  public find<K extends keyof IRegistryMap>(target: K): IRegistryMap[K];

  public find<T>(target: string): T | undefined;

  public find(target: string): unknown {
    if (this.mainRegistry.has(target)) return this.mainRegistry.get(target);

    for (const registry of this.mainRegistry.getAllRegistries()) {
      if (registry.has(target)) return registry.get(target);
    }

    return undefined;
  }

  public has(target: string): boolean {
    return this.find(target) !== undefined;
  }
}
