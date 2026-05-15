interface Blueprint {
  id: string | undefined;
  kind: string | undefined;
  validator: string | undefined;
  registry: string | undefined;
}

export abstract class BaseBlueprint implements Blueprint {
  protected static system: Partial<Blueprint>;

  static readonly id: string = "baseblueprint";
  static readonly registry: string = "blueprints";

  readonly id: string | undefined;
  readonly kind: string | undefined;
  readonly validator: string | undefined;
  readonly registry: string | undefined;

  constructor(data: Partial<Blueprint> = {}) {
    this.id = data.id;
    this.kind = data.kind;
    this.validator = data.validator;
    this.registry = data.registry;

    this.registerMyself();
  }

  private registerMyself(): void {
    this.onRegister();
  }

  protected onRegister(): boolean {
    return true;
  }
}
