import { BaseRegistry } from "./Base";
import { Blueprint } from "../interfaces/Blueprint";

export class MainRegistry extends BaseRegistry<Blueprint> {
  constructor() {
    super({ name: "MainRegistry" });
  }
}
