import { IRegistryMap } from "#kernel/contract/index";

import { MainRegistry } from "./main-registry.js";

export class RegistryResolver {
  constructor(private readonly mainRegistry: MainRegistry) {}

  public find<K extends keyof IRegistryMap>(target: K): IRegistryMap[K];

  public find<T extends new (...args: any[]) => any>(
    target: T,
  ): InstanceType<T> | undefined;

  public find(target: string): unknown | undefined;

  public find(target: any): any {
    if (typeof target === "function" && target.name)
      return this.find(target.name);

    if (typeof target !== "string") return undefined;

    if (this.mainRegistry.has(target)) return this.mainRegistry.get(target);

    for (const registry of this.mainRegistry.getAllRegistries()) {
      if (registry.has(target)) return registry.get(target);
    }

    return undefined;
  }

  public has(target: string): boolean {
    if (this.mainRegistry.has(target)) return true;

    for (const registry of this.mainRegistry.getAllRegistries()) {
      if (registry.has(target)) return true;
    }

    return false;
  }
}
