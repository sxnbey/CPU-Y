import "reflect-metadata";

import { ServiceOptions } from "../contract/index.js";

import { ServiceRegistry } from "#core/registry/service-registry";

export function Service(metadata: ServiceOptions): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(
      "system:metadata",
      { ...metadata, targetRegistry: ServiceRegistry.registryName },
      target,
    );
  };
}
