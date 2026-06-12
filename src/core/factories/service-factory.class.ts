import { IBlueprint } from "../../kernel/contracts/interfaces";

import { BaseBlueprint } from "../../kernel/blueprints/base-blueprint.class";
import { DynamicBlueprint } from "../../kernel/blueprints/dynamic-blueprint.class";

export class ServiceFactory {
  public create<C extends new () => IBlueprint>(RawService: C): InstanceType<C>;

  public create<I extends BaseBlueprint>(RawService: I): I;

  public create<T extends Record<string, any>>(
    RawService: T,
  ): DynamicBlueprint & T;

  public create(RawService: any): any {
    if (this.isChildClassOfBlueprint(RawService)) {
      const serviceInstance = new RawService();

      return serviceInstance;
    }

    if (this.isChildInstanceOfBlueprint(RawService)) return RawService;

    const rawServiceObject = RawService;

    return new DynamicBlueprint(rawServiceObject);
  }

  private isChildClassOfBlueprint(
    target: (new () => IBlueprint) | IBlueprint,
  ): target is new () => BaseBlueprint {
    if (typeof target != "function") return false;

    return target.prototype instanceof BaseBlueprint;
  }

  private isChildInstanceOfBlueprint(
    target: (new () => IBlueprint) | IBlueprint,
  ): target is BaseBlueprint {
    return target instanceof BaseBlueprint;
  }
}
