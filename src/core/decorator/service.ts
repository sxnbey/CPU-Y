import "reflect-metadata";

import { IRegistryMap } from "#kernel/contract/index";
import { ServiceOptions } from "#core/contract/index";

const serviceRegistryName = "serviceRegistry" satisfies keyof IRegistryMap;

export function Service(metadata: ServiceOptions): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(
      "system:metadata",
      { ...metadata, targetRegistry: serviceRegistryName },
      target,
    );
  };
}
