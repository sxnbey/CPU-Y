import { IBlueprint } from "../contracts/IBlueprint";
import { IMainRegistry } from "../contracts/IMainRegistry";

import { RegistryBridge } from "../RegistryBridge";

export abstract class BaseBlueprint implements IBlueprint {
  readonly id: string;
  readonly kind: string;
  readonly validator: string;
  readonly location: string;

  constructor(
    data: IBlueprint,
    protected readonly communicator: RegistryBridge,
  ) {
    this.id = data.id;
    this.kind = data.kind;
    this.validator = data.validator;
    this.location = data.location;
  }

  protected getRegistry(): IMainRegistry {
    return this.communicator.getRegistry();
  }

  protected onRegister(): boolean {
    return true;
  }
}
