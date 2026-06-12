import { IBlueprint } from "../../kernel/contracts/interfaces";

import { BaseBlueprint } from "../../kernel/blueprints/base-blueprint.class";
import { DynamicBlueprint } from "../../kernel/blueprints/dynamic-blueprint.class";

export class ServiceFactory {
  /**  If source is a class implementing IBlueprint, it returns the instantiated class. */
  public create<C extends new () => IBlueprint>(source: C): InstanceType<C>;

  /** If source is an instance that's extending BaseBlueprint, it returns the instance. */
  public create<I extends BaseBlueprint>(source: I): I;

  /** If source is a plain object satisfying the IBlueprint interface, it returns an instantiated service. */
  public create<T extends IBlueprint>(source: T): DynamicBlueprint & T;

  public create(source: any): any {
    if (this.isChildClassOfBlueprint(source)) {
      const RawService = source;

      return new RawService();
    }

    if (this.isChildInstanceOfBlueprint(source)) return source;

    return new DynamicBlueprint(source);
  }

  private isChildClassOfBlueprint(
    target: unknown,
  ): target is new () => BaseBlueprint {
    if (typeof target != "function") return false;

    return target.prototype instanceof BaseBlueprint;
  }

  private isChildInstanceOfBlueprint(target: unknown): target is BaseBlueprint {
    return target instanceof BaseBlueprint;
  }
}
