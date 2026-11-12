import { join } from "node:path";
import { bootstrap } from "./bootstrap.js";

const app = bootstrap({
  path: join(import.meta.dirname, "example/"),
  configs: { welcome: { name: "senbey" } },
  // modules: [{ name: "terminal", services: {}, registries: [] }],
});

await app.boot();

await app.stop();
