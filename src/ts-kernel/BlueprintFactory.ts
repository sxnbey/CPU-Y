import { Registry } from "./interfaces/Registry";
import { Blueprint } from "./interfaces/Blueprint";

export class BlueprintFactory {
  constructor(private readonly registry: Registry<Blueprint>) {}

  public create(data: Blueprint): Blueprint {
    this.registry.register(data.id, data);

    return data;
  }
}
