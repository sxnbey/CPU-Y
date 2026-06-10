import { IRegistry } from "../../kernel/contracts/interfaces/registry.interface";
import { IBlueprint } from "../../kernel/contracts/interfaces/blueprint.interface";

import { KernelContext } from "../../kernel/kernel-context.class";

export class BlueprintFactory {
  private readonly blueprintRegistry: IRegistry<IBlueprint>;

  constructor(private readonly context: KernelContext) {
    this.blueprintRegistry = this.context.get("blueprintRegistry");
  }
}
