import { promises as fs } from "fs";
import path from "path";
import { env } from "./env";

// JSON-file storage shared by content, leads, users and activity. Swap these two
// functions for database calls later; nothing else touches the filesystem.

export const dataFile = (name: string) => path.join(env.dataDir, name);

export async function readJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return null;
  }
}

// Serialize writes per file so two quick saves can't interleave and lose data.
const queues = new Map<string, Promise<unknown>>();

export function writeJson(file: string, data: unknown): Promise<void> {
  const prev = queues.get(file) ?? Promise.resolve();
  const next = prev.catch(() => {}).then(async () => {
    await fs.mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
    await fs.rename(tmp, file);
  });
  queues.set(file, next);
  return next;
}

/** Read-modify-write under the same per-file queue. */
export function updateJson<T>(file: string, fallback: T, fn: (current: T) => T): Promise<T> {
  const prev = queues.get(file) ?? Promise.resolve();
  let result!: T;
  const next = prev.catch(() => {}).then(async () => {
    result = fn((await readJson<T>(file)) ?? fallback);
    await fs.mkdir(path.dirname(file), { recursive: true });
    const tmp = `${file}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(result, null, 2), "utf8");
    await fs.rename(tmp, file);
  });
  queues.set(file, next);
  return next.then(() => result);
}
