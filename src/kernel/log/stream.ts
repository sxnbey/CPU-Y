import { Writable, type WritableOptions } from "node:stream";

import type { LogPayload, Writer } from "#contract";

import { formatToString, formatToError } from "#util";

export class LogStream extends Writable {
  private writer: Writer;

  constructor({
    options = {},
    writer = defaultWriter,
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
        result.then(() => callback()).catch((e) => callback(formatToError(e)));
      else callback();
    } catch (e) {
      callback(formatToError(e));
    }
  }

  public setWriter(writer: Writer): void {
    this.writer = writer;
  }
}

function defaultWriter(payload: LogPayload): void {
  let message = formatToString(payload.message);

  message = /\n$/.test(message) ? message : message + "\n";

  if (payload.severity === "info") process.stdout.write(message);
  else process.stderr.write(message);
}
