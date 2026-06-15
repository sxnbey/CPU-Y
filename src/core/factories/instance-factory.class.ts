import {
  IDynamicBlueprintConfig,
  IBlueprintConfig,
} from "../../kernel/contracts";

import { BaseBlueprint } from "../../kernel/blueprints/base-blueprint.class";
import { DynamicBlueprint } from "../../kernel/blueprints/dynamic-blueprint.class";

type BaseBlueprintChild = new (...args: any[]) => BaseBlueprint;
type BaseBlueprintChildInstance = BaseBlueprint;
type RawBlueprintOptions = IDynamicBlueprintConfig;

type Source =
  | BaseBlueprintChild
  | BaseBlueprintChildInstance
  | RawBlueprintOptions;
type ReturnValue =
  | InstanceType<BaseBlueprintChild>
  | BaseBlueprintChildInstance
  | DynamicBlueprint;

export class InstanceFactory {
  /** Generates a new instance from a given blueprint. Statics with metadata are mandatory.
   *  Source class has to accept their configuration object as first parameter in constructor.
   *
   *  @param source - The blueprint to instantiate.
   *  @param options - The configuration object.
   */
  public create<C extends BaseBlueprintChild & IBlueprintConfig>(
    source: C,
    options?: ConstructorParameters<C>[0],
  ): InstanceType<C>;

  /** Generates a new instance from a given blueprint. Options with metadata are mandatory.
   *  Source class has to accept their configuration object as first parameter in constructor.
   *
   *  @param source - The blueprint to instantiate.
   *  @param options - The configuration object.
   */
  public create<C extends BaseBlueprintChild>(
    source: C,
    options: ConstructorParameters<C>[0] & IBlueprintConfig,
  ): InstanceType<C>;

  /** Passes an instance through.
   *
   *  @param source - The instance.
   */
  public create<I extends BaseBlueprintChildInstance>(source: I): I;

  /** Generates a new instance from a raw configuration object.
   *  @param source - The raw configuration object.
   */
  public create<T extends RawBlueprintOptions>(source: T): DynamicBlueprint & T;

  public create(source: Source, options?: IBlueprintConfig): ReturnValue {
    // runtime checks still needed

    if (this.isChildClassOfBlueprint(source)) {
      const RawService = source;

      return new RawService(options);
    }

    if (this.isChildInstanceOfBlueprint(source)) return source;

    return new DynamicBlueprint(source);
  }

  private isChildClassOfBlueprint(
    target: unknown,
  ): target is BaseBlueprintChild {
    if (typeof target != "function") return false;

    return BaseBlueprint.isPrototypeOf(target);
  }

  private isChildInstanceOfBlueprint(target: unknown): target is BaseBlueprint {
    return target instanceof BaseBlueprint;
  }
}
