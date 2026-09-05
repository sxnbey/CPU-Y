import type { IBaseMetadata, IRegistryEntry } from "#kernel/contract/index";
import { type BaseBlueprintChild, MetadataKey } from "#core/contract/index";

import { BaseBlueprint } from "#kernel/blueprint/base-blueprint";
import { DynamicBlueprint } from "#kernel/blueprint/dynamic-blueprint";
import { RegistryResolver } from "#kernel/registry/registry-resolver";
import { Inject } from "#core/decorator/index";
import { getMetadata } from "#core/util/metadata";
import { resolveArguments } from "./argument-resolver.js";

type Source = BaseBlueprintChild | IBaseMetadata;

export class InstanceFactory {
  constructor(
    @Inject("registryResolver")
    private readonly registryResolver: RegistryResolver,
  ) {}

  public create<C extends BaseBlueprintChild>(
    source: C,
    config?: Record<string, unknown>,
  ): IRegistryEntry<InstanceType<C>>;

  public create(source: IBaseMetadata): IRegistryEntry<DynamicBlueprint>;

  public create<P extends Record<string, unknown>>(
    source: IBaseMetadata,
    payload: P,
  ): IRegistryEntry<DynamicBlueprint<P>>;

  public create(
    source: Source,
    input?: Record<string, unknown>,
  ): IRegistryEntry<unknown> {
    if (InstanceFactory.isChildClassOfBlueprint(source)) {
      const Blueprint = source;
      const config = input;
      const metadata = getMetadata<IBaseMetadata>(
        MetadataKey.METADATA,
        Blueprint,
      );

      if (!metadata)
        throw new Error(
          `Missing metadata for blueprint "${Blueprint.name}". Please ensure that the blueprint is properly decorated.`,
        );

      const constructorArguments = resolveArguments(
        this.registryResolver,
        Blueprint,
        config,
      );
      const value = new Blueprint(...constructorArguments);

      return { metadata, value };
    }

    if (InstanceFactory.isMetadata(source)) {
      const payload = input;
      const metadata = source;
      const value = new DynamicBlueprint(payload);

      return { metadata, value };
    }

    throw new Error(
      `Invalid source provided to InstanceFactory. Expected a class extending BaseBlueprint or a raw blueprint configuration object.`,
    );
  }

  private static isChildClassOfBlueprint(
    target: unknown,
  ): target is BaseBlueprintChild {
    if (typeof target !== "function") return false;

    return BaseBlueprint.isPrototypeOf(target);
  }

  private static isMetadata(target: unknown): target is IBaseMetadata {
    if (typeof target !== "object" || target === null) return false;

    return (
      "id" in target &&
      typeof (target as IBaseMetadata).id === "string" &&
      "targetRegistry" in target &&
      typeof (target as IBaseMetadata).targetRegistry === "string"
    );
  }
}
