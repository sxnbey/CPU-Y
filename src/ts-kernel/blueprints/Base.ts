import { Blueprint } from "../interfaces/Blueprint.js";

export abstract class BaseBlueprint implements Blueprint {
  protected static registry: Partial<Blueprint>;

  readonly id: string | undefined;
  readonly kind: string | undefined;
  readonly validator: string | undefined;
  readonly location: string | undefined;

  constructor(data: Partial<Blueprint> = {}) {
    this.id = data.id;
    this.kind = data.kind;
    this.validator = data.validator;
    this.location = data.location;
  }

  protected onRegister(): boolean {
    return true;
  }
}
