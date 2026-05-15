import { Blueprint } from "../interfaces/Blueprint.js";
import { Registry } from "../interfaces/Registry.js";

export abstract class BaseBlueprint implements Blueprint {
  protected static registry: Registry<Blueprint>;

  readonly id: string;
  readonly kind: string;
  readonly validator: string;
  readonly location: string;

  constructor(data: Blueprint) {
    this.id = data.id;
    this.kind = data.kind;
    this.validator = data.validator;
    this.location = data.location;
  }

  protected onRegister(): boolean {
    return true;
  }
}
