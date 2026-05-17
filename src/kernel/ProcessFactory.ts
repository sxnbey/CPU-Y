import { IRegistry } from "./contracts/IRegistry";
import { IBlueprint } from "./contracts/IBlueprint";
import { Process } from "./contracts/Process";

import { KernelBridge } from "./KernelBridge";

export class ProcessFactory {
  readonly processRegistry: IRegistry<Process>;

  constructor(private readonly kernelBridge: KernelBridge) {
    this.processRegistry = this.kernelBridge.get("processRegistry");
  }

  public create(data: IBlueprint): IBlueprint {
    this.processRegistry.register(data.id, data);
    return data;
  }
}
