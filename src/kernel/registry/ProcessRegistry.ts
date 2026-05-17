import { Process } from "../contracts/Process";

import { BaseRegistry } from "./BaseRegistry";

export class ProcessRegistry extends BaseRegistry<Process, "processRegistry"> {
  constructor() {
    super({ name: "processRegistry" });
  }
}
