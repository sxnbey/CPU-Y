import type { IErrorMessage, IErrorArgument } from "#contract";

import { frameworkErrors } from "./framework-error.templates.js";

export function resolveTemplates(
  errorTemplates: Record<string, IErrorMessage>,
  errorCode: string,
  args?: IErrorArgument,
): IErrorMessage {
  let targetError: IErrorMessage | undefined = errorTemplates[errorCode];

  if (!targetError)
    if (errorCode in frameworkErrors)
      targetError = frameworkErrors[errorCode as keyof typeof frameworkErrors];
    else {
      targetError = frameworkErrors.ERR_ERRORCODE_NOT_FOUND;

      args = { name: errorCode, origin: "Unknown", ...args };
    }

  const headline = replacePlaceholders(targetError.headline, args);
  const details = replacePlaceholders(targetError.details, args);

  const rawMessage: IErrorMessage = {
    headline,
    details,
    ...(targetError.fix && {
      fix: replacePlaceholders(targetError.fix, args),
    }),
  };

  return rawMessage;
}

export function createMessage(rawMessage: IErrorMessage): string {
  const message = [rawMessage.headline, "\n", `Cause: ${rawMessage.details}`];

  if (rawMessage.fix) message.push(`\nPotential fix: ${rawMessage.fix}`);

  return message.join("");
}

function replacePlaceholders(target: string, args?: IErrorArgument): string {
  if (!args) return target;

  return target.replace(
    /\{([^}]+)\}/g,
    (match, key) => args[key.toLowerCase()] ?? match,
  );
}
