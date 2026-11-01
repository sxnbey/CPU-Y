import { join } from "node:path";
import { bootstrap } from "./bootstrap.js";

const system = bootstrap({
  path: join(import.meta.dirname, "example/"),
  configs: { secondExample: { name: "senbey" } },
});

await system.boot();

await system.stop();
