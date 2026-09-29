export interface IErrorMessage {
  headline: string;
  details: string;
  fix?: string | undefined;
}

export interface IErrorArgument {
  [key: string]: string;
}

// Since TypeScript thinks a keyof Templates could be string | number | symbol, & string is needed to ensure it's a string.

export type ErrorParameter<Templates extends Record<string, IErrorMessage>> = {
  [ErrorCode in keyof Templates & string]: {
    errorCode: ErrorCode;
  } & ResolvePlaceholderArgs<GetAllPlaceholders<Templates[ErrorCode]>>;
}[keyof Templates & string];

// Since never is an empty union, it gets distributed, loops 0 times and evaluates to never.
// Wrapping in a tuple disables distributing and ensures correct comparing.

export type ResolvePlaceholderArgs<Placeholders extends string> = [
  Placeholders,
] extends [never]
  ? { args?: Record<string, string> }
  : { args: Record<Placeholders, string> };

export type GetAllPlaceholders<Template extends IErrorMessage> =
  ExtractPlaceholders<
    | Template["headline"]
    | Template["details"]
    | (Template["fix"] extends string ? Template["fix"] : never)
  >;

export type ExtractPlaceholders<Template extends string> =
  Template extends `${string}{${infer Placeholder}}${infer Rest}`
    ? Lowercase<Placeholder> | ExtractPlaceholders<Rest>
    : never;
