import type { IErrorMessage, IErrorArgument } from "#kernel/contract/index";

import { frameworkErrors } from "./framework-error.templates.js";

export class FrameworkError<
  T extends Record<string, IErrorMessage>,
> extends Error {
  constructor({
    errorTemplates,
    errorCode,
    args,
  }: {
    errorTemplates: T;
    errorCode: keyof T & string;
    args?: IErrorArgument;
  }) {
    const rawMessage = FrameworkError.resolveTemplates(
      errorTemplates,
      errorCode,
      args,
    );
    const message = FrameworkError.createMessage(rawMessage, new.target.name);

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

  private static createMessage(
    rawMessage: IErrorMessage,
    errorName: string,
  ): string {
    const errorPrefix = `[${new Date().toISOString()} | ${errorName}]`;

    const message = [
      errorPrefix,
      " - ",
      rawMessage.headline,
      "\n",
      `Cause: ${rawMessage.details}`,
    ];

    if (rawMessage.fix) message.push(`\nPotential fix: ${rawMessage.fix}`);

    return message.join("");
  }
}
