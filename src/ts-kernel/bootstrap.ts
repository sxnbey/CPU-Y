import { IMainRegistry } from "./contracts/IMainRegistry";
import { BlueprintFactory } from "./BlueprintFactory";
import { MainRegistry } from "./registry/MainRegistry";
import { ProcessRegistry } from "./registry/ProcessRegistry";

interface ISystem {
  start(): boolean;
}

export class CPUY implements ISystem {
  registry: IMainRegistry;
  factory: BlueprintFactory;

  constructor() {
    this.registry = new MainRegistry();

    const processRegistry = new ProcessRegistry();

    this.registry.register(processRegistry.getName(), processRegistry);

    this.factory = new BlueprintFactory(processRegistry);
  }

  public start(): boolean {
    // other

    return true;
  }
}
