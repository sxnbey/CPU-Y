import type { IErrorMessage } from "#kernel/contract/index";

export const frameworkErrors = {
  ERR_ERRORCODE_NOT_FOUND: {
    headline: "Error code not found",
    details:
      "The error code {NAME} does not exist in the errorTemplates.\nOrigin: {ORIGIN}",
    fix: "Please ensure that the error code is defined in the specified errorTemplates.",
  },
} satisfies Record<string, IErrorMessage>;
