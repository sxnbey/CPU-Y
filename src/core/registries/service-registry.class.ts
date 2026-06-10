import { Service } from "../../kernel/contracts/types/service.type";

import { BaseRegistry } from "../../kernel/registries/base-registry.class";

export class ServiceRegistry extends BaseRegistry<Service, "serviceRegistry"> {
  constructor() {
    super("serviceRegistry");
  }
}
