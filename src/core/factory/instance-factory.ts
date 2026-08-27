import "reflect-metadata";

import { BaseBlueprintChild, ArgumentBuilder } from "./arguments-builder.js";

import type { IDynamicBlueprintConfig } from "#kernel/contract/index";
import type { MetadataKeys } from "#core/contract/metadata-keys";
import type { IBaseMetadata } from "#kernel/contract/index";

import { BaseBlueprint } from "#kernel/blueprint/base-blueprint";
import { DynamicBlueprint } from "#kernel/blueprint/dynamic-blueprint";
import { RegistryResolver } from "#kernel/registry/registry-resolver";
import { Inject } from "#core/decorator/index";

type RawBlueprintConfig = IDynamicBlueprintConfig;

type Source = BaseBlueprintChild | RawBlueprintConfig;
type ReturnValue = InstanceType<BaseBlueprintChild> | DynamicBlueprint;

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
    if (InstanceFactory.isChildClassOfBlueprint(source)) {
      const Blueprint = source;
      const constructorArguments = ArgumentBuilder.createArgumentsArray(
        this.registryResolver,
        Blueprint,
        config,
      );

      //! metadatahelper bauen und wrapped returnen

      const instance = new Blueprint(...constructorArguments);
    }

    if (InstanceFactory.isRawBlueprintConfig(source))
      return new DynamicBlueprint(source);

    throw new Error(
      `Invalid source provided to InstanceFactory. Expected a class extending BaseBlueprint or a raw blueprint configuration object.`,
    );
  }

  static isChildClassOfBlueprint(
    target: unknown,
  ): target is BaseBlueprintChild {
    if (typeof target !== "function") return false;

    return BaseBlueprint.isPrototypeOf(target);
  }

  static isRawBlueprintConfig(target: unknown): target is RawBlueprintConfig {
    if (typeof target !== "object" || target === null) return false;

    return (
      "id" in target &&
      typeof (target as RawBlueprintConfig).id === "string" &&
      "targetRegistry" in target &&
      typeof (target as RawBlueprintConfig).targetRegistry === "string"
    );
  }
}
