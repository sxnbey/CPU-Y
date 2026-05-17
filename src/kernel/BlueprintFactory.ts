import { IRegistry } from "./contracts/IRegistry";
import { Process } from "./contracts/Process";
import { IBlueprint } from "./contracts/IBlueprint";

import { RegistryBridge } from "./RegistryBridge";

export class BlueprintFactory {
  readonly processRegistry: IRegistry<Process>;

  constructor(private readonly registryBridge: RegistryBridge) {
    this.processRegistry = this.registryBridge
      .getRegistry()
      .get("processRegistry") as IRegistry<Process>;
  }

  public create(data: IBlueprint): IBlueprint {
    this.processRegistry.register(data.id, data);
    return data;
  }
}
