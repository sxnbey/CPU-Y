import { Writable, type WritableOptions } from "node:stream";

import type { LogPayload } from "#contract";

import { formatToString, formatToError } from "#util";

type Writer = (payload: LogPayload) => void | Promise<void>;

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
    chunk: LogPayload,
    _: unknown,
    callback: (error?: Error) => void,
  ): void {
    try {
      const result = this.writer(chunk);

      if (typeof result?.then === "function")
        result
          .then(() => callback())
          .catch((err) => callback(formatToError(err)));
      else callback();
    } catch (err) {
      callback(formatToError(err));
    }
  }

  public setWriter(writer: Writer): void {
    this.writer = writer;
  }

  private static defaultWriter(payload: LogPayload): void {
    let message = formatToString(payload.message);

    message = /\n$/.test(message) ? message : message + "\n";

    if (payload.severity === "info") process.stdout.write(message);
    else process.stderr.write(message);
  }
}
