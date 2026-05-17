import { IRegistry } from "./contracts/IRegistry";
import { IBlueprint } from "./contracts/IBlueprint";
import { Process } from "./contracts/Process";

import { RegistryBridge } from "./RegistryBridge";

export class BlueprintFactory {
  readonly processRegistry: IRegistry<Process>;

  constructor(private readonly registryBridge: RegistryBridge) {
    this.processRegistry = this.registryBridge.get("processRegistry");
  }

  public create(data: IBlueprint): IBlueprint {
    this.processRegistry.register(data.id, data);
    return data;
  }
}
