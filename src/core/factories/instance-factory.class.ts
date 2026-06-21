import "reflect-metadata";

import { IDynamicBlueprintConfig } from "../../kernel/contracts";

import { BaseBlueprint } from "../../kernel/blueprints/base-blueprint.class";
import { DynamicBlueprint } from "../../kernel/blueprints/dynamic-blueprint.class";
import { InstanceRegistry } from "../registries/instance-registry.class";
import { Metadata, Inject } from "../../kernel/decorators";

type BaseBlueprintChild = new (...args: any[]) => BaseBlueprint<unknown>;
type RawBlueprintConfig = IDynamicBlueprintConfig;

type Source = BaseBlueprintChild | RawBlueprintConfig;
type ReturnValue = InstanceType<BaseBlueprintChild> | DynamicBlueprint;

@Metadata({ id: "instanceFactory", targetRegistry: "instanceRegistry" })
export class InstanceFactory {
  constructor(@Inject("instanceRegistry") instanceRegistry: InstanceRegistry) {}

  public create<C extends BaseBlueprintChild>(
    source: C,
    config: ConstructorParameters<C>[0],
  ): InstanceType<C>;

  public create<T extends RawBlueprintConfig>(source: T): DynamicBlueprint & T;

  public create(source: Source, config?: any): ReturnValue {
    if (this.isChildClassOfBlueprint(source)) {
      const Blueprint = source;

      return new Blueprint(config);
    }

    class DynamicClass extends DynamicBlueprint {}

    Reflect.defineMetadata(
      "system:metadata",
      { id: source.id, targetRegistry: source.targetRegistry },
      DynamicClass,
    );

    return new DynamicClass(source);
  }

  private isChildClassOfBlueprint(
    target: unknown,
  ): target is BaseBlueprintChild {
    if (typeof target != "function") return false;

    return BaseBlueprint.isPrototypeOf(target);
  }
}
