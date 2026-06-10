import { Service } from "../contracts/types/service.type";

import { BaseRegistry } from "./base-registry.class";

export class ServiceRegistry extends BaseRegistry<Service, "serviceRegistry"> {
  constructor() {
    super({ name: "serviceRegistry" });
  }
}
