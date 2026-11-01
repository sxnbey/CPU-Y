import { join } from "node:path";
import { bootstrap } from "./bootstrap.js";

const system = bootstrap({
  path: join(import.meta.dirname, "example/"),
  configs: { welcome: { name: "senbey" } },
  modules: [{ name: "terminalModule", services: {}, registries: [] }],
});

await system.boot();

await system.stop();
