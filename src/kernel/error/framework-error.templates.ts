import type { IErrorMessage } from "#contract";

export const frameworkErrors = {
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
} as const satisfies Record<string, IErrorMessage>;
