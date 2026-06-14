import {
  IBlueprint,
  IBlueprintOptions,
  IRegistryMap,
} from "../contracts/interfaces";
import { BlueprintSchemaRules } from "../contracts/types";

import { KernelContext } from "../kernel-context.class";

export abstract class BaseBlueprint implements IBlueprint {
  static id: string;
  static targetRegistry: keyof IRegistryMap;

  readonly id: string;
  readonly targetRegistry: keyof IRegistryMap;

  readonly rules: BlueprintSchemaRules = {
    id: { type: "string", required: true },
    targetRegistry: { type: "string", required: true },
  };

  private _context!: KernelContext;

  constructor(options?: IBlueprintOptions) {
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
