import "reflect-metadata";

import { IBlueprint } from "#kernel/contract/index";

export abstract class BaseBlueprint<C = {}> implements IBlueprint<C> {
  constructor(readonly config?: C) {}
}
