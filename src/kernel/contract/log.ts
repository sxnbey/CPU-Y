export interface LogPayload {
  severity: "info" | "warn" | "error" | "fatal";
  message: string;
}
