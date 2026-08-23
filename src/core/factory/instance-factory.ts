import { BaseBlueprintChild, ArgumentsBuilder } from "./arguments-builder.js";

import type { IDynamicBlueprintConfig } from "#kernel/contract/index";

import { BaseBlueprint } from "#kernel/blueprint/base-blueprint";
import { DynamicBlueprint } from "#kernel/blueprint/dynamic-blueprint";
import { RegistryResolver } from "#kernel/registry/registry-resolver";
import { Inject } from "#kernel/decorator/index";

type RawBlueprintConfig = IDynamicBlueprintConfig;

type Source = BaseBlueprintChild | RawBlueprintConfig;
type ReturnValue = InstanceType<BaseBlueprintChild> | DynamicBlueprint;

export class InstanceFactory {
  private readonly argumentBuilder: ArgumentsBuilder = new ArgumentsBuilder();

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
      const constructorArguments = this.argumentBuilder.createArgumentsArray(
        this.registryResolver,
        Blueprint,
        config,
      );

      return new Blueprint(...constructorArguments);
    } else if (this.isRawBlueprintConfig(source))
      return new DynamicBlueprint(source);
    else
      throw new Error(
        `Invalid source provided to InstanceFactory. Expected a class extending BaseBlueprint or a raw blueprint configuration object.`,
      );
  }

  private isChildClassOfBlueprint(
    target: unknown,
  ): target is BaseBlueprintChild {
    if (typeof target !== "function") return false;

    return BaseBlueprint.isPrototypeOf(target);
  }

  private isRawBlueprintConfig(target: unknown): target is RawBlueprintConfig {
    if (typeof target !== "object" || target === null) return false;

    return (
      "id" in target &&
      typeof (target as RawBlueprintConfig).id === "string" &&
      "targetRegistry" in target &&
      typeof (target as RawBlueprintConfig).targetRegistry === "string"
    );
  }
}
