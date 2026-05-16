import { BaseRegistry } from "./BaseRegistry";
import { IRegistry } from "../contracts/IRegistry";
import { Resource } from "../contracts/Resource";
import { IMainRegistry } from "../contracts/IMainRegistry";

export class MainRegistry
  extends BaseRegistry<IRegistry<Resource>>
  implements IMainRegistry
{
  constructor() {
    super({ name: "mainRegistry" });
  }
}
