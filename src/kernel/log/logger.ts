import type { LogStream } from "./stream.js";
import type { LogPayload } from "#contract";

import { formatToString } from "#kernel/util/formatter";

const prefix = "CPU-Y";

export class Logger {
  constructor(private readonly stream: LogStream) {}

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
    payload.message = `[${payload.severity} \\ ${prefix} / ${new Date().toISOString()}] - ${payload.message}`;

    this.stream.write(payload);
  }

  private static formatMessage(target: unknown): string {
    return target instanceof Error
      ? target.stack || target.message
      : formatToString(target);
  }
}
