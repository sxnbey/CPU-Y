import { IRegistry } from "../../kernel/contracts/interfaces/registry.interface";
import { IBlueprint } from "../../kernel/contracts/interfaces/blueprint.interface";
import { Process } from "../../kernel/contracts/types/service.type";

import { KernelContext } from "../../kernel/kernel-context.class";

export class ProcessFactory {
  private readonly processRegistry: IRegistry<Process>;

  constructor(private readonly context: KernelContext) {
    this.processRegistry = this.context.get("processRegistry");
  }

  public createFromBlueprint(BlueprintClass: new () => IBlueprint): void {
    const instance = new BlueprintClass();

    instance.initialize(this.context);
  }
}
