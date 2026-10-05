import { readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "path";

export async function load(scanPath: string): Promise<unknown[]> {
  scanPath = path.resolve(process.cwd(), scanPath);

  const files = await readdir(scanPath, {
    recursive: true,
    withFileTypes: true,
  });

  const rawFiles: { fileName: string; parentPath: string }[] = [];

  files
    .filter((file) => file.isFile())
    .forEach((file) =>
      rawFiles.push({ fileName: file.name, parentPath: file.parentPath }),
    );

  const loaded = [];

  for (const rawFile of rawFiles) {
    const absolutePath = path.resolve(rawFile.parentPath, rawFile.fileName);
    const jsPath = absolutePath.endsWith(".ts")
      ? absolutePath.slice(0, -3) + ".js"
      : absolutePath;

    const fileUrl = pathToFileURL(jsPath).href;
    const imported = await import(fileUrl);

    for (const file of Object.values(imported)) loaded.push(file);
  }

  console.log(loaded);

  return loaded;
}
