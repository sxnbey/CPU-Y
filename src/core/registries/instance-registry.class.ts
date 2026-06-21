import { BaseRegistry } from "../../kernel/registries/base-registry.class";

export class InstanceRegistry extends BaseRegistry<"instanceRegistry"> {
  constructor() {
    super("instanceRegistry");
  }
}
