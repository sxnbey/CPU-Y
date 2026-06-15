import { System } from "./kernel/system.class";

import { ServiceRegistry } from "./core/registries/service-registry.class";
import { BlueprintRegistry } from "./core/registries/blueprint-registry.class";

const system = new System();

const allRegistries = [new ServiceRegistry(), new BlueprintRegistry()];

allRegistries.forEach((registry) => system.connectRegistry(registry));

system.start();
