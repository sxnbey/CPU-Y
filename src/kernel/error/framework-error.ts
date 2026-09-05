import type { IErrorMessage, IErrorArgument } from "#kernel/contract/index";

import { frameworkErrors } from "./framework-error.templates.js";

export type ErrorTemplateArguments<
  AllTemplates extends Record<string, IErrorMessage>,
  K extends keyof AllTemplates & string,
> = ResolvePlaceholderArguments<GetAllPlaceholders<AllTemplates[K]>>["args"];

type ExtractPlaceholders<T extends string> =
  T extends `${string}{${infer Placeholder}}${infer Rest}`
    ? Lowercase<Placeholder> | ExtractPlaceholders<Rest>
    : never;

type GetAllPlaceholders<Template extends IErrorMessage> = ExtractPlaceholders<
  | Template["headline"]
  | Template["details"]
  | (Template["fix"] extends string ? Template["fix"] : never)
>;

// Since never is an empty union, it gets distributed, loops 0 times and evaluates to never.
// Wrapping in a tuple disables distributing and ensures correct comparing.

type ResolvePlaceholderArguments<P extends string> = [P] extends [never]
  ? { args?: Record<string, string> }
  : { args: Record<P, string> };

type ErrorConstructorParameters<
  AllTemplates extends Record<string, IErrorMessage>,
  K extends keyof AllTemplates & string,
> = {
  errorTemplates: AllTemplates;
  errorCode: K;
} & ResolvePlaceholderArguments<GetAllPlaceholders<AllTemplates[K]>>;

export class FrameworkError<
  T extends Record<string, IErrorMessage>,
  K extends keyof T,
> extends Error {
  constructor({
    errorTemplates,
    errorCode,
    args,
  }: ErrorConstructorParameters<T, K & string>) {
    const rawMessage = FrameworkError.resolveTemplates(
      errorTemplates,
      errorCode,
      args,
    );
    const message = FrameworkError.createMessage(rawMessage);

    super(message);

    this.name = new.target.name;

    Object.setPrototypeOf(this, new.target.prototype);
  }

  private static resolveTemplates<T extends Record<string, IErrorMessage>>(
    errorTemplates: T,
    errorCode: keyof T & string,
    args?: IErrorArgument,
  ): IErrorMessage {
    let targetError: IErrorMessage | undefined = errorTemplates[errorCode];

    if (!targetError)
      if (errorCode in frameworkErrors)
        targetError =
          frameworkErrors[errorCode as keyof typeof frameworkErrors];
      else {
        targetError = frameworkErrors.ERR_ERRORCODE_NOT_FOUND;

        args = { name: errorCode, origin: "Unknown", ...args };
      }

    const headline = FrameworkError.replacePlaceholders(
      targetError.headline,
      args,
    );
    const details = FrameworkError.replacePlaceholders(
      targetError.details,
      args,
    );

    const rawMessage: IErrorMessage = {
      headline,
      details,
      ...(targetError.fix && {
        fix: FrameworkError.replacePlaceholders(targetError.fix, args),
      }),
    };

    return rawMessage;
  }

  private static replacePlaceholders(
    target: string,
    args?: IErrorArgument,
  ): string {
    let result: string = target;

    if (args) {
      for (const [key, value] of Object.entries(args)) {
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const regex = new RegExp(`{${escapedKey}}`, "gi");

        // Callback function ensures it doesn't get interpreted as regex command.

        result = result.replace(regex, () => value);
      }
    }

    return result;
  }

  private static createMessage(rawMessage: IErrorMessage): string {
    const message = [rawMessage.headline, "\n", `Cause: ${rawMessage.details}`];

    if (rawMessage.fix) message.push(`\nPotential fix: ${rawMessage.fix}`);

    return message.join("");
  }
}
