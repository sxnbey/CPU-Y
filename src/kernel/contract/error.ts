export interface ErrorMessage {
  headline: string;
  details: string;
  fix?: string | undefined;
}

export type ErrorTemplates = Record<string, ErrorMessage>;
