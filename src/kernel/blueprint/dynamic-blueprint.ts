export class DynamicBlueprint<
  P extends Record<string, unknown> = Record<string, unknown>,
> {
  constructor(readonly payload: P = {} as P) {}
}
