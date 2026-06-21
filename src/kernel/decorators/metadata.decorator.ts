import "reflect-metadata";

import { IMetadata } from "../contracts";

export function Metadata(metadata: IMetadata): Function {
  return (target: Function) => {
    Reflect.defineMetadata("system:metadata", metadata, target);
  };
}
