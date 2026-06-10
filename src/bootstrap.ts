import { System } from "./kernel/system.class.js";

import { ServiceRegistry } from "./kernel/registries/service-registry.class.js";
import { BlueprintRegistry } from "./kernel/registries/blueprint-registry.class.js";

const system = new System();

const allRegistries = [new ServiceRegistry(), new BlueprintRegistry()];

allRegistries.forEach((registry) => system.connectRegistry(registry));

system.start();
