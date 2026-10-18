import { cacheLife, cacheTag } from "next/cache";
import { DEFAULT_CONTENT } from "./default-content";
import { dataFile, readJson, updateJson, writeJson } from "./storage";
import type { Content, ContentKey, Lead } from "./types";

const CONTENT_FILE = dataFile("content.json");
const LEADS_FILE = dataFile("leads.json");

export const CONTENT_TAG = "content";

const isPlainObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

/** Fill in keys added to the defaults after a file was saved, including new fields inside object sections. */
function mergeDefaults(stored: Partial<Content>): Content {
  const out: Record<string, unknown> = { ...DEFAULT_CONTENT };
  for (const [key, value] of Object.entries(stored)) {
    const fallback = (DEFAULT_CONTENT as Record<string, unknown>)[key];
    out[key] = isPlainObject(fallback) && isPlainObject(value) ? { ...fallback, ...value } : value;
  }
  return out as Content;
}

export async function getContent(): Promise<Content> {
  "use cache";
  cacheLife("max");
  cacheTag(CONTENT_TAG);
  const stored = await readJson<Partial<Content>>(CONTENT_FILE);
  return mergeDefaults(stored ?? {});
}

export async function saveContentKey<K extends ContentKey>(key: K, value: Content[K]) {
  await updateJson<Partial<Content>>(CONTENT_FILE, {}, (stored) => ({ ...DEFAULT_CONTENT, ...stored, [key]: value }));
}

export async function resetContent() {
  await writeJson(CONTENT_FILE, DEFAULT_CONTENT);
}

export async function replaceContent(content: Partial<Content>) {
  await writeJson(CONTENT_FILE, { ...DEFAULT_CONTENT, ...content });
}

export async function getLeads(): Promise<Lead[]> {
  return (await readJson<Lead[]>(LEADS_FILE)) ?? [];
}

export function updateLeads(fn: (leads: Lead[]) => Lead[]) {
  return updateJson<Lead[]>(LEADS_FILE, [], fn);
}
