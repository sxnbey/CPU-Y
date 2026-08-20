import "reflect-metadata";

import { IMetadata } from "../contracts/index.js";

export function Metadata(metadata: IMetadata): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata("system:metadata", metadata, target);
  };
}
