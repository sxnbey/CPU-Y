import { System } from "./kernel/system.class.js";

import { ProcessRegistry } from "./kernel/registry/process-registry.class.js";
import { BlueprintRegistry } from "./kernel/registry/blueprint-registry.class.js";

const system = new System();

const processRegistry = new ProcessRegistry();
const blueprintRegistry = new BlueprintRegistry();

system.connectRegistry(processRegistry);
system.connectRegistry(blueprintRegistry);

system.start();
