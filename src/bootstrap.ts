import { System } from "./kernel/system.class.js";

import { ServiceRegistry } from "./kernel/registry/service-registry.class.js";
import { BlueprintRegistry } from "./kernel/registry/blueprint-registry.class.js";

const system = new System();

const serviceRegistry = new ServiceRegistry();
const blueprintRegistry = new BlueprintRegistry();

system.connectRegistry(serviceRegistry);
system.connectRegistry(blueprintRegistry);

system.start();
