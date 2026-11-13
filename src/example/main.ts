import { join } from "node:path";
import { bootstrap } from "../index.js";

const app = bootstrap({
  path: join(import.meta.dirname, "./app"),
  configs: { welcome: { name: "senbey" } },
  // modules: [{ name: "terminal", services: {}, registries: [] }],
});

await app.boot();

await app.stop();
