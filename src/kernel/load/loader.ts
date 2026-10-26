import { readdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "path";

import type { LoadedExport, Loader } from "#contract";

export function createLoader({ extensions = [".js", ".mjs"] } = {}): Loader {
  return async (loadPath) => {
    const root = resolveRoot(loadPath);
    const files = await scan(root, extensions);

    return await importAll(files);
  };
}

function resolveRoot(loadPath: string | URL): string {
  if (loadPath instanceof URL) return fileURLToPath(loadPath);

  if (!path.isAbsolute(loadPath))
    throw new Error(
      `loadPath "${loadPath}" must be absolute. Use join(import.meta.dirname, "yourDir") or new URL("yourDir", import.meta.url).`,
    );

  return loadPath;
}

async function scan(loadPath: string, extensions: string[]): Promise<string[]> {
  let scanned;

  try {
    scanned = await readdir(loadPath, {
      recursive: true,
      withFileTypes: true,
    });
  } catch (e) {
    if (e instanceof Error && "code" in e) {
      if (e.code === "ENOENT")
        throw new Error(`loadPath "${loadPath}" does not exist.`);

      if (e.code === "ENOTDIR")
        throw new Error(`loadPath "${loadPath}" is not a directory.`);
    }

    throw new Error(`Failed to read loadPath "${loadPath}".`, { cause: e });
  }

  const addresses = scanned
    .filter(
      (file) =>
        file.isFile() &&
        extensions.includes(path.extname(file.name)) &&
        !file.name.endsWith(".d.ts"),
    )
    .map((file) => path.join(file.parentPath, file.name))
    .sort();

  return addresses;
}

async function importAll(files: string[]): Promise<LoadedExport[]> {
  const loaded: LoadedExport[] = [];

  for (const file of files) {
    let imported: Record<string, unknown>;

    try {
      imported = await import(pathToFileURL(file).href);
    } catch (e) {
      throw new Error(`Failed to import file "${file}"`, { cause: e });
    }

    for (const [name, value] of Object.entries(imported))
      loaded.push({ value, name, file });
  }

  return loaded;
}
