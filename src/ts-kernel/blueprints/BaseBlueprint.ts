import { IBlueprint } from "../contracts/IBlueprint";

export abstract class BaseBlueprint implements IBlueprint {
  readonly id: string;
  readonly kind: string;
  readonly validator: string;
  readonly location: string;

  constructor(data: IBlueprint) {
    this.id = data.id;
    this.kind = data.kind;
    this.validator = data.validator;
    this.location = data.location;
  }

  protected onRegister(): boolean {
    return true;
  }
}
