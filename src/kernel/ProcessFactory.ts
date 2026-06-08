import { IRegistry } from "./contracts/IRegistry";
import { IBlueprint } from "./contracts/IBlueprint";
import { Process } from "./contracts/Process";

import { KernelContext } from "./KernelContext";

export class ProcessFactory {
  readonly processRegistry: IRegistry<Process>;

  constructor(private readonly KernelContext: KernelContext) {
    this.processRegistry = this.KernelContext.get("processRegistry");
  }

  public create(data: IBlueprint): void {
    //! SOON

    this.processRegistry.register(data.id, data);
  }
}
