import type { LogStream } from "./stream.js";
import type { LogPayload } from "#contract";

import { Inject } from "#kernel/di/decorator/inject-parameter";
import { formatToString } from "#kernel/util/formatter";

export class Logger {
  constructor(@Inject("logStream") private readonly stream: LogStream) {}

  public info(message: string): void {
    this.log({ message, severity: "info" });
  }

  public warn(message: string): void {
    this.log({ message, severity: "warn" });
  }

  public error(payload: unknown): void {
    const message = Logger.formatMessage(payload);

    this.log({ message, severity: "error" });
  }

  public fatal(payload: unknown): void {
    const message = Logger.formatMessage(payload);

    this.log({ message, severity: "fatal" });
  }

  private log(payload: LogPayload): void {
    this.stream.write(payload);
  }

  private static formatMessage(target: unknown): string {
    return target instanceof Error
      ? target.stack || target.message
      : formatToString(target);
  }
}
