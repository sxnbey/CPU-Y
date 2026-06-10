import {
  IBlueprint,
  IBlueprintOptions,
  IRegistryMap,
} from "./contracts/interfaces";
import { ValidationRules } from "./contracts/types";

import { KernelContext } from "./kernel-context.class";

export abstract class BaseBlueprint implements IBlueprint {
  static readonly rules: ValidationRules = {
    id: { type: "string", required: true },
    targetRegistry: { type: "string", required: true },
  };

  readonly id: string;
  readonly targetRegistry: keyof IRegistryMap;

  private _context!: KernelContext;

  constructor(options: IBlueprintOptions) {
    this.id = options.id;
    this.targetRegistry = options.targetRegistry;
  }

  protected get context(): KernelContext {
    if (!this._context) throw new Error("Context not yet set.");

    return this._context;
  }

  public initialize(context: KernelContext): void {
    this._context = context;

    this.onInitialize();
  }

  // Optional method for custom logic after init.

  protected onInitialize(): void {}
}
