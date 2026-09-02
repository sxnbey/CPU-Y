import { BaseBlueprint } from "#kernel/blueprint/base-blueprint";

export type BaseBlueprintChild = new (...args: any[]) => BaseBlueprint<unknown>;
