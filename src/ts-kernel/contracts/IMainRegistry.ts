import { IRegistry } from "./IRegistry";
import { Resource } from "./Resource";

export interface IMainRegistry extends IRegistry<IRegistry<Resource>> {}
