import type { IErrorMessage, ErrorParameter } from "#contract";

import { frameworkErrors } from "./framework-error.templates.js";
import { resolveTemplates, createMessage } from "./error-resolver.js";

export class FrameworkError<
  Templates extends Record<string, IErrorMessage> = typeof frameworkErrors,
> extends Error {
  public readonly rawMessage: IErrorMessage;

  constructor(
    params: {
      errorTemplates: Templates;
    } & ErrorParameter<Templates>,
  );

  constructor(
    params: {
      errorTemplates?: undefined;
      // Since TypeScript tried to infer "Templates" from the constraint, NoInfer is needed so it falls back to the default.
    } & ErrorParameter<NoInfer<Templates>>,
  );

  constructor({
    errorTemplates = frameworkErrors,
    errorCode,
    args,
  }: {
    errorTemplates?: Record<string, IErrorMessage> | undefined;
    errorCode: string;
    args?: Record<string, string>;
  }) {
    const rawMessage = resolveTemplates(errorTemplates, errorCode, args);
    const message = createMessage(rawMessage);

    super(message);

    this.rawMessage = rawMessage;
    this.name = new.target.name;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
