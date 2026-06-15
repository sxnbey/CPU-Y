import { BaseRegistry } from "../../kernel/registries/base-registry.class";

export class ServiceRegistry extends BaseRegistry<"serviceRegistry"> {
  constructor() {
    super("serviceRegistry");
  }
}
