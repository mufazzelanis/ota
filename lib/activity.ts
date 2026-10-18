import { randomUUID } from "crypto";
import { dataFile, readJson, updateJson } from "./storage";
import type { Activity, SessionUser } from "./types";

const ACTIVITY_FILE = dataFile("activity.json");
const KEEP = 1000;

export async function logActivity(actor: Pick<SessionUser, "id" | "name">, action: string, target = "") {
  try {
    await updateJson<Activity[]>(ACTIVITY_FILE, [], (list) =>
      [{ id: randomUUID(), at: new Date().toISOString(), actorId: actor.id, actorName: actor.name, action, target }, ...list].slice(0, KEEP),
    );
  } catch (e) {
    // Logging must never break the action it describes.
    console.error("[activity] failed to log", e);
  }
}

export async function getActivity(limit = 100): Promise<Activity[]> {
  return ((await readJson<Activity[]>(ACTIVITY_FILE)) ?? []).slice(0, limit);
}
