import { IBlueprint } from "../../kernel/contracts/interfaces";

import { BaseBlueprint } from "../../kernel/blueprints/base-blueprint.class";
import { DynamicBlueprint } from "../../kernel/blueprints/dynamic-blueprint.class";

export class ServiceFactory {
  /**  If source is a child of BaseBlueprint, it returns the instantiated service. */
  public create<C extends new () => BaseBlueprint>(source: C): InstanceType<C>;

  /** If source is a child instance of BaseBlueprint, it returns the instance. */
  public create<I extends BaseBlueprint>(source: I): I;

  /** If source is a plain object satisfying the IBlueprint interface, it returns the instantiated service. */
  public create<T extends IBlueprint>(source: T): DynamicBlueprint & T;

  public create(source: any): any {
    // runtime checks still needed

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
