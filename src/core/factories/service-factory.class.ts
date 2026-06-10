import { IRegistry } from "../../kernel/contracts/interfaces/registry.interface";
import { IBlueprint } from "../../kernel/contracts/interfaces/blueprint.interface";
import { Service } from "../../kernel/contracts/types/service.type";

import { KernelContext } from "../../kernel/kernel-context.class";

export class ServiceFactory {
  private readonly serviceRegistry: IRegistry<Service, "serviceRegistry">;

  constructor(private readonly context: KernelContext) {
    this.serviceRegistry = this.context.get("serviceRegistry");
  }

  public createFromBlueprint(BlueprintClass: new () => IBlueprint): void {
    const instance = new BlueprintClass();

    instance.initialize(this.context);
  }
}
