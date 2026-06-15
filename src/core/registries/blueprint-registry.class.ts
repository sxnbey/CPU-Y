import { BaseRegistry } from "../../kernel/registries/base-registry.class";

export class BlueprintRegistry extends BaseRegistry<"blueprintRegistry"> {
  constructor() {
    super("blueprintRegistry");
  }
}
