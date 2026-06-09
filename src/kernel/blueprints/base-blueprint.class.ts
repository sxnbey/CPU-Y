import { IBlueprint } from "../contracts/interfaces/blueprint.interface";
import { IBlueprintOptions } from "../contracts/interfaces/blueprint-options.interface";
import { IRegistryMap } from "../contracts/interfaces/registry-map.interface";
import { ValidationRules } from "../contracts/types/validation-rules.type";

import { KernelContext } from "../kernel-context.class";

export abstract class BaseBlueprint implements IBlueprint {
  static readonly rules: ValidationRules = {
    id: { type: "string", required: true },
    targetLocation: { type: "string", required: true },
  };

  readonly id: string;
  readonly targetLocation: keyof IRegistryMap;

  private _context!: KernelContext;

  constructor(options: IBlueprintOptions) {
    this.id = options.id;
    this.targetLocation = options.targetLocation;
  }

  protected get context(): KernelContext {
    if (!this._context) throw new Error("Context not yet set.");

    return this._context;
  }

  public initialize(context: KernelContext): void {
    this._context = context;

    this.onInitialize();
  }

  // Optional method, so no abstract.

  protected onInitialize(): void {}
}
