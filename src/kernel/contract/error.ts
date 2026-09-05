export interface IErrorMessage {
  headline: string;
  details: string;
  fix?: string | undefined;
}

export interface IErrorArgument {
  [key: string]: string;
}
