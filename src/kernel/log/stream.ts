import { Writable, type WritableOptions } from "node:stream";

interface OutputPayload {
  severity: "info" | "warn" | "error" | "fatal";
  message: string;
  formattedMessage?: string;
}

type Writer = (payload: OutputPayload) => void;

export class LogStream extends Writable {
  private writer: Writer;

  constructor({
    options = {},
    writer = LogStream.defaultWriter,
  }: {
    options?: WritableOptions;
    writer?: Writer;
  } = {}) {
    super({ ...options, objectMode: true });

    this.writer = writer;
  }

  override _write(
    chunk: OutputPayload,
    _: unknown,
    callback: (error?: Error) => void,
  ): void {
    try {
      this.writer(chunk);

      callback();
    } catch (err) {
      callback(
        err instanceof Error ? err : new Error(LogStream.formatToString(err)),
      );
    }
  }

  public setWriter(writer: Writer): void {
    this.writer = writer;
  }

  private static formatToString(target: unknown): string {
    if (typeof target === "string") return target;

    // Since JSON.stringify(undefined) returns undefined, it has to be caught.

    if (typeof target === "undefined") return "undefined";

    return JSON.stringify(target);
  }

  private static defaultWriter(payload: OutputPayload): void {
    let message = LogStream.formatToString(
      payload.formattedMessage ?? payload.message,
    );
    message = /\n$/.test(message) ? message : message + "\n";

    if (payload.severity === "info") process.stdout.write(message);
    else process.stderr.write(message);
  }
}
