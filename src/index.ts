import { join } from "node:path";
import { bootstrap } from "./bootstrap.js";

const system = bootstrap({
  path: join(import.meta.dirname, "kernel/"),
});

await system.boot();
