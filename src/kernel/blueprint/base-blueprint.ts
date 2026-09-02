export abstract class BaseBlueprint<
  C extends Record<string, unknown> = Record<string, unknown>,
> {
  constructor(readonly config?: C) {}
}
