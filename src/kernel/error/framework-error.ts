interface IErrorMessage {
  headline: string;
  details: string;
  fix?: string;
}

export abstract class FrameworkError extends Error {
  constructor(readonly rawMessage: IErrorMessage) {
    super(FrameworkError.createMessage(rawMessage, new.target.name));

    this.name = new.target.name;

    Object.setPrototypeOf(this, new.target.prototype);
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
