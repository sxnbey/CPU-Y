import { BaseRegistry } from "./BaseRegistry";

import { Process } from "../contracts/Process";

export class ProcessRegistry extends BaseRegistry<Process, "processRegistry"> {
  constructor() {
    super({ name: "processRegistry" });
  }
}
