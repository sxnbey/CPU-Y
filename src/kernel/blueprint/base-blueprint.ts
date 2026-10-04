export abstract class BaseBlueprint<
  C extends Record<string, unknown> | undefined = undefined,
> {
  constructor(readonly config?: C) {}
}
