"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { ADMIN_COOKIE, authorize, getSession, sessionCookieOptions, signIn } from "@/lib/auth";
import { CONTENT_TAG, replaceContent, resetContent, saveContentKey, updateLeads } from "@/lib/content";
import { DEFAULT_CONTENT } from "@/lib/default-content";
import { logActivity } from "@/lib/activity";
import { permissionForKey } from "@/lib/permissions";
import { findSection } from "@/lib/admin-schema";
import { updateUsers } from "@/lib/users";
import type { Content, ContentKey } from "@/lib/types";

export type ActionResult = { ok: boolean; message: string };

const DENIED: ActionResult = { ok: false, message: "You don't have permission to do that" };

export async function login(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  let result;
  try {
    result = await signIn(email, password);
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Admin is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SECRET in the environment." };
  }
  if (!result.ok) return result;

  (await cookies()).set(ADMIN_COOKIE, result.token, sessionCookieOptions());
  const { user } = result;
  if (!user.isOwner) {
    const at = new Date().toISOString();
    await updateUsers((users) => users.map((u) => (u.id === user.id ? { ...u, lastLoginAt: at } : u)));
  }
  await logActivity(user, "Signed in");
  redirect("/admin");
}

export async function logout() {
  const user = await getSession();
  if (user) await logActivity(user, "Signed out");
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

const KEYS = Object.keys(DEFAULT_CONTENT) as ContentKey[];
const labelFor = (key: ContentKey) =>
  key === "theme" ? "Theme & Colors" : key === "sections" ? "Page Layout" : key === "pages" ? "Pages" : findSection(key)?.label ?? key;

export async function saveSection<K extends ContentKey>(key: K, value: Content[K]): Promise<ActionResult> {
  if (!KEYS.includes(key)) return { ok: false, message: "Unknown section" };
  const user = await authorize(permissionForKey(key));
  if (!user) return DENIED;
  if (value === undefined || value === null) return { ok: false, message: "Nothing to save" };
  await saveContentKey(key, value);
  updateTag(CONTENT_TAG);
  await logActivity(user, "Updated", labelFor(key));
  return { ok: true, message: "Saved and published" };
}

export async function resetAll(): Promise<ActionResult> {
  const user = await authorize("backup");
  if (!user) return DENIED;
  await resetContent();
  updateTag(CONTENT_TAG);
  await logActivity(user, "Reset all content to defaults");
  return { ok: true, message: "All content reset to defaults" };
}

export async function importAll(value: Partial<Content>): Promise<ActionResult> {
  const user = await authorize("backup");
  if (!user) return DENIED;
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false, message: "Invalid file" };
  const clean = Object.fromEntries(Object.entries(value).filter(([k]) => KEYS.includes(k as ContentKey)));
  if (!Object.keys(clean).length) return { ok: false, message: "No recognizable content in file" };
  await replaceContent(clean);
  updateTag(CONTENT_TAG);
  await logActivity(user, "Imported content backup", `${Object.keys(clean).length} sections`);
  return { ok: true, message: `Imported ${Object.keys(clean).length} sections` };
}

export async function markLead(id: string, read: boolean): Promise<ActionResult> {
  // Opening a lead marks it read, so viewers may do this; marking unread is managing.
  if (!(await authorize(read ? "leads.view" : "leads.manage"))) return DENIED;
  await updateLeads((leads) => leads.map((l) => (l.id === id ? { ...l, read } : l)));
  return { ok: true, message: read ? "Marked as read" : "Marked as unread" };
}

export async function deleteLead(id: string): Promise<ActionResult> {
  const user = await authorize("leads.manage");
  if (!user) return DENIED;
  let removed = "";
  await updateLeads((leads) => {
    removed = leads.find((l) => l.id === id)?.email ?? "";
    return leads.filter((l) => l.id !== id);
  });
  await logActivity(user, "Deleted lead", removed);
  return { ok: true, message: "Lead deleted" };
}

export async function logLeadExport(count: number): Promise<ActionResult> {
  const user = await authorize("leads.manage");
  if (!user) return DENIED;
  await logActivity(user, "Exported leads", `${count} rows`);
  return { ok: true, message: "Export started" };
}
