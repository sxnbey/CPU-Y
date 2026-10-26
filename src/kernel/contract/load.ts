export type LoadedExport = { value: unknown; name: string; file: string };

export type Loader = (loadPath: string | URL) => Promise<LoadedExport[]>;
