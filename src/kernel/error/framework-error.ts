import type { ErrorMessage } from "#contract";

// Since TypeScript thinks a keyof Templates could be string | number | symbol, & string is needed to ensure it's a string.

export type ErrorParameter<Templates extends Record<string, ErrorMessage>> = {
  [ErrorCode in keyof Templates & string]: {
    errorCode: ErrorCode;
  } & ResolvePlaceholderArgs<GetAllPlaceholders<Templates[ErrorCode]>>;
}[keyof Templates & string];

// Since never is an empty union, it gets distributed, loops 0 times and evaluates to never.
// Wrapping in a tuple disables distributing and ensures correct comparing.

type ResolvePlaceholderArgs<Placeholders extends string> = [
  Placeholders,
] extends [never]
  ? { args?: Record<string, string> }
  : { args: Record<Placeholders, string> };

type GetAllPlaceholders<Template extends ErrorMessage> = ExtractPlaceholders<
  | Template["headline"]
  | Template["details"]
  | (Template["fix"] extends string ? Template["fix"] : never)
>;

type ExtractPlaceholders<Template extends string> =
  Template extends `${string}{${infer Placeholder}}${infer Rest}`
    ? Lowercase<Placeholder> | ExtractPlaceholders<Rest>
    : never;

export class FrameworkError<
  Templates extends Record<string, ErrorMessage> = typeof frameworkErrors,
> extends Error {
  public readonly rawMessage: ErrorMessage;

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
    errorTemplates?: Record<string, ErrorMessage> | undefined;
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

function resolveTemplates(
  errorTemplates: Record<string, ErrorMessage>,
  errorCode: string,
  args?: Record<string, string>,
): ErrorMessage {
  let targetError: ErrorMessage | undefined = errorTemplates[errorCode];

  if (!targetError)
    if (errorCode in frameworkErrors)
      targetError = frameworkErrors[errorCode as keyof typeof frameworkErrors];
    else {
      targetError = frameworkErrors.ERR_ERRORCODE_NOT_FOUND;

      args = { name: errorCode, origin: "Unknown", ...args };
    }

  const headline = replacePlaceholders(targetError.headline, args);
  const details = replacePlaceholders(targetError.details, args);

  const rawMessage: ErrorMessage = {
    headline,
    details,
    ...(targetError.fix && {
      fix: replacePlaceholders(targetError.fix, args),
    }),
  };

  return rawMessage;
}

function createMessage(rawMessage: ErrorMessage): string {
  const message = [rawMessage.headline, "\n", `Cause: ${rawMessage.details}`];

  if (rawMessage.fix) message.push(`\nPotential fix: ${rawMessage.fix}`);

  return message.join("");
}

function replacePlaceholders(
  target: string,
  args?: Record<string, string>,
): string {
  if (!args) return target;

  return target.replace(
    /\{([^}]+)\}/g,
    (match, key) => args[key.toLowerCase()] ?? match,
  );
}

const frameworkErrors = {
  ERR_ERRORCODE_NOT_FOUND: {
    headline: "Error code not found",
    details:
      "The error code {NAME} does not exist in the errorTemplates.\nOrigin: {ORIGIN}",
    fix: "Please ensure that the error code is defined in the specified errorTemplates.",
  },
  ERR_INVALID_DECORATOR_TARGET: {
    headline: "Invalid decorator target",
    details:
      "Decorator @{DECORATOR} can only be used on constructor parameters, not method parameters.",
    fix: "Please ensure the @{DECORATOR} decorator is used on a constructor parameter.",
  },
  ERR_DECORATOR_CAN_ONLY_BE_USED_ONCE: {
    headline: "Decorator can only be used once",
    details: "Decorator @{DECORATOR} can only be used once per constructor.",
    fix: "Please ensure the @{DECORATOR} decorator is only used once per constructor.",
  },
} as const satisfies Record<string, ErrorMessage>;
