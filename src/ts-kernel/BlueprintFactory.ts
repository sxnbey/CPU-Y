import { IRegistry } from "./contracts/IRegistry";
import { Process } from "./contracts/Process";
import { IBlueprint } from "./contracts/IBlueprint";

export class BlueprintFactory {
  constructor(private readonly registry: IRegistry<Process>) {}

  public create(data: IBlueprint): IBlueprint {
    this.registry.register(data.id, data);

    return data;
  }
}
