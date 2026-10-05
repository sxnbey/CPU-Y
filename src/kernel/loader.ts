import { readdir, access } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { constants } from "node:fs";
import path from "path";

interface FileAddress {
  fileName: string;
  parentPath: string;
}

export async function load(loadPath: string): Promise<unknown[]> {
  loadPath = path.resolve(process.cwd(), loadPath);

  const pathExists = await doesPathExist(loadPath);

  if (!pathExists) throw new Error(`path "${loadPath}" does not exist`);

  const rawFiles = await scan(loadPath);
  const loadedFiles = await resolvePath(rawFiles);

  return loadedFiles;
}

async function resolvePath(addresses: FileAddress[]): Promise<unknown[]> {
  const loaded = [];

  for (const entry of addresses) {
    const absolutePath = path.resolve(entry.parentPath, entry.fileName);
    const jsPath = absolutePath.endsWith(".ts")
      ? absolutePath.slice(0, -3) + ".js"
      : absolutePath;

    const fileUrl = pathToFileURL(jsPath).href;
    const imported = await import(fileUrl);

    for (const importedFile of Object.values(imported))
      loaded.push(importedFile);
  }

  return loaded;
}

async function scan(scanPath: string): Promise<FileAddress[]> {
  const scanned = await readdir(scanPath, {
    recursive: true,
    withFileTypes: true,
  });

  const addresses = scanned
    .filter((file) => file.isFile())
    .map((file) => ({
      fileName: file.name,
      parentPath: file.parentPath,
    }));

  return addresses;
}

async function doesPathExist(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);

    return true;
  } catch {
    return false;
  }
}
