import { BaseRegistry } from "./BaseRegistry";
import { Process } from "../contracts/Process";

export class ProcessRegistry extends BaseRegistry<Process> {
  constructor() {
    super({ name: "processRegistry" });
  }
}
