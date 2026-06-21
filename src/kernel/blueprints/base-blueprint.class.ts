import "reflect-metadata";

import { IBlueprint, BlueprintSchemaRules, RegistryMap } from "../contracts";

import { KernelContext } from "../kernel-context.class";

export abstract class BaseBlueprint<
  TConfig = {},
> implements IBlueprint<TConfig> {
  readonly id: string;
  readonly targetRegistry: keyof RegistryMap;

  readonly rules: BlueprintSchemaRules = {
    id: { type: "string", required: true },
    targetRegistry: { type: "string", required: true },
  };

  private _context!: KernelContext;

  constructor(readonly config?: TConfig) {
    const metadata = Reflect.getMetadata("system:metadata", this);

    if (!metadata?.id || !metadata?.targetRegistry)
      throw new Error(
        `Blueprint ${this.constructor.name} must have an "id" and "targetRegistry" set via @Metadata decorator.`,
      );

    this.id = metadata?.id;
    this.targetRegistry = metadata?.targetRegistry;
  }

  protected get context(): KernelContext {
    if (!this._context) throw new Error("Context not yet set.");

    return this._context;
  }

  public initialize(context: KernelContext): void {
    this._context = context;

    this.onInitialize();
  }

  protected onInitialize(): void {}
}
