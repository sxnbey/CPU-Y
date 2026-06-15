import {
  IBlueprint,
  IBlueprintConfig,
  BlueprintSchemaRules,
  RegistryMap,
} from "../contracts";

import { KernelContext } from "../kernel-context.class";

export abstract class BaseBlueprint implements IBlueprint {
  static id: string;
  static targetRegistry: keyof RegistryMap;

  readonly id: string;
  readonly targetRegistry: keyof RegistryMap;

  readonly rules: BlueprintSchemaRules = {
    id: { type: "string", required: true },
    targetRegistry: { type: "string", required: true },
  };

  private _context!: KernelContext;

  constructor(options?: IBlueprintConfig) {
    const StaticSource = this.constructor as any;

    const id = options?.id || StaticSource.id;
    const targetRegistry =
      options?.targetRegistry || StaticSource.targetRegistry;

    if (!id || !targetRegistry)
      throw new Error(
        "Blueprint must have an id and targetRegistry defined, either as static properties or passed in the options.",
      );

    this.id = id;
    this.targetRegistry = targetRegistry;
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
