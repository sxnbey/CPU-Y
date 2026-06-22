import { System } from "#core/system.class";
import { InstanceRegistry } from "#core/registries/instance-registry.class";

const system = new System();

const allRegistries = [new InstanceRegistry()];

allRegistries.forEach((registry) => system.connectRegistry(registry));

system.start();
