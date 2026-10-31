import type { LogStream } from "./stream.js";
import type { LogPayload } from "#contract";

import { formatToString, isError, describeError } from "#util";

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
    if (!isError(target)) return formatToString(target);

    const lines = [describeError(target)];

    let current = target.cause;

    const seen = new Set([target]);

    while (current !== undefined) {
      if (!isError(current)) {
        lines.push(`Caused by: ${formatToString(current)}`);

        break;
      }

      if (seen.has(current)) {
        lines.push("Caused by: [circular]");

        break;
      }

      lines.push(`Caused by: ${describeError(current)}`);

      seen.add(current);

      current = current.cause;
    }

    return lines.join("\n");
  }
}
