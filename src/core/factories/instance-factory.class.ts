import "reflect-metadata";

import type { IDynamicBlueprintConfig } from "#kernel/contracts/index";

import { BaseBlueprint } from "#kernel/blueprints/base-blueprint.class";
import { DynamicBlueprint } from "#kernel/blueprints/dynamic-blueprint.class";
import { RegistryResolver } from "#kernel/registry-resolver.class";
import { Metadata, Inject } from "#kernel/decorators/index";

type BaseBlueprintChild = new (...args: any[]) => BaseBlueprint<unknown>;
type RawBlueprintConfig = IDynamicBlueprintConfig;

type Source = BaseBlueprintChild | RawBlueprintConfig;
type ReturnValue = InstanceType<BaseBlueprintChild> | DynamicBlueprint;

@Metadata({ id: "instanceFactory", targetRegistry: "instanceRegistry" })
export class InstanceFactory {
  constructor(
    @Inject("registryResolver")
    private readonly registryResolver: RegistryResolver,
  ) {}

  public create<C extends BaseBlueprintChild>(
    source: C,
    config: Record<string, unknown>,
  ): InstanceType<C>;

  public create<T extends RawBlueprintConfig>(source: T): DynamicBlueprint & T;

  public create(source: Source, config?: Record<string, unknown>): ReturnValue {
    if (this.isChildClassOfBlueprint(source)) {
      const Blueprint = source;
      const args = [];

      const configIndex = Reflect.getMetadata("system:config", Blueprint);
      const injectableParameters: Record<number, string> =
        Reflect.getMetadata("system:dependencies", Blueprint) || {};

      for (let i = 0; i < Blueprint.length; i++) {
        const dependencyId = injectableParameters?.[i];

        if (i != configIndex && !dependencyId)
          throw new Error(
            `Missing dependency for parameter at index ${i} in blueprint ${Blueprint.name}. Please use the @Inject decorator to provide a dependency or @Config decorator to provide a configuration.`,
          );

        if (dependencyId) {
          const dependency = this.registryResolver.find(dependencyId);

          if (!dependency)
            throw new Error(
              `Dependency with id ${dependencyId} not found in the registry for blueprint ${Blueprint.name}.`,
            );

          args[i] = dependency;
        }

        if (i == configIndex) args[i] = config;
      }

      return new Blueprint(...args);
    }

    return new DynamicBlueprint(source);
  }

  private isChildClassOfBlueprint(
    target: unknown,
  ): target is BaseBlueprintChild {
    if (typeof target != "function") return false;

    return BaseBlueprint.isPrototypeOf(target);
  }
}
