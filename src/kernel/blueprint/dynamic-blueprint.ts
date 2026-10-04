export class DynamicBlueprint<
  P extends Record<string, unknown> | undefined = undefined,
> {
  constructor(readonly payload?: P) {}
}
