export interface LogPayload {
  severity: "info" | "warn" | "error" | "fatal";
  message: string;
}

export type Writer = (payload: LogPayload) => void | Promise<void>;
