import { Process } from "../contracts/types/process.type";

import { BaseRegistry } from "./base-registry.class";

export class ProcessRegistry extends BaseRegistry<Process, "processRegistry"> {
  constructor() {
    super({ name: "processRegistry" });
  }
}
