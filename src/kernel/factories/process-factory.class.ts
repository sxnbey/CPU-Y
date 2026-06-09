import { IRegistry } from "../contracts/interfaces/registry.interface";
import { IBlueprint } from "../contracts/interfaces/blueprint.interface";
import { Process } from "../contracts/types/process.type";

import { KernelContext } from "../kernel-context.class";

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
