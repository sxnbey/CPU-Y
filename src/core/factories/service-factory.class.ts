import {
  IDynamicBlueprintOptions,
  IBlueprintOptions,
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
  /**  If source is a child of BaseBlueprint, it returns the instantiated service. */
  public create<C extends BaseBlueprintChild>(
    source: C,
    options?: ConstructorParameters<C>[0],
  ): InstanceType<C>;

  /** If source is a child instance of BaseBlueprint, it returns the instance. */
  public create<I extends BaseBlueprintChildInstance>(source: I): I;

  /** If source is a plain object satisfying the IDynamicBlueprintOptions interface, it returns the instantiated service. */
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

    return target.prototype instanceof BaseBlueprint;
  }

  private isChildInstanceOfBlueprint(target: unknown): target is BaseBlueprint {
    return target instanceof BaseBlueprint;
  }
}
