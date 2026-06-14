import {
  IDynamicBlueprintOptions,
  IBlueprintOptions,
  IBlueprintMetaStatics,
} from "../../kernel/contracts/interfaces";

import { BaseBlueprint } from "../../kernel/blueprints/base-blueprint.class";
import { DynamicBlueprint } from "../../kernel/blueprints/dynamic-blueprint.class";

type BaseBlueprintChild = new (...args: any[]) => BaseBlueprint;
type BaseBlueprintChildInstance = BaseBlueprint;
type RawBlueprintOptions = IDynamicBlueprintOptions;

type Source =
  | BaseBlueprintChild
  | BaseBlueprintChildInstance
  | RawBlueprintOptions;
type ReturnValue =
  | InstanceType<BaseBlueprintChild>
  | BaseBlueprintChildInstance
  | DynamicBlueprint;

export class ServiceFactory {
  /** Generates a new service from a given blueprint. Statics with metadata are mandatory.
   *  Source class has to accept their configuration object as first parameter in constructor.
   *
   *  @param source - The blueprint to instantiate.
   *  @param options - The configuration object.
   */
  public create<C extends BaseBlueprintChild & IBlueprintMetaStatics>(
    source: C,
    options?: ConstructorParameters<C>[0],
  ): InstanceType<C>;

  /** Generates a new service from a given blueprint. Options with metadata are mandatory.
   *  Source class has to accept their configuration object as first parameter in constructor.
   *
   *  @param source - The blueprint to instantiate.
   *  @param options - The configuration object.
   */
  public create<C extends BaseBlueprintChild>(
    source: C,
    options: ConstructorParameters<C>[0] & IBlueprintOptions,
  ): InstanceType<C>;

  /** Passes through an already instantiated service.
   *
   *  @param source - The instantiated service.
   */
  public create<I extends BaseBlueprintChildInstance>(source: I): I;

  /** Generates a new service from a raw configuration object.
   *  @param source - The raw configuration object.
   */
  public create<T extends RawBlueprintOptions>(source: T): DynamicBlueprint & T;

  public create(source: Source, options?: IBlueprintOptions): ReturnValue {
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
  ): target is new (options?: IBlueprintOptions) => BaseBlueprint {
    if (typeof target != "function") return false;

    return BaseBlueprint.isPrototypeOf(target);
  }

  private isChildInstanceOfBlueprint(target: unknown): target is BaseBlueprint {
    return target instanceof BaseBlueprint;
  }
}
