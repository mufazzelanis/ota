import type { ContentKey } from "./types";

// Shared by server checks and client UI, so no server-only imports here.

export const PERMISSIONS = [
  { key: "content", group: "Website", label: "Edit homepage content", description: "Hero, sections, FAQ, testimonials and other homepage blocks" },
  { key: "catalog", group: "Website", label: "Edit products & use cases", description: "Add, edit and remove products and use cases" },
  { key: "pages", group: "Website", label: "Manage pages & navigation", description: "Build pages with blocks and edit the header menu" },
  { key: "design", group: "Website", label: "Theme & page layout", description: "Change colors and reorder or hide sections" },
  { key: "brand", group: "Website", label: "Brand & contact settings", description: "Brand name, logo, contact details and social links" },
  { key: "leads.view", group: "Sales", label: "View leads", description: "See the leads inbox and lead details" },
  { key: "leads.manage", group: "Sales", label: "Manage leads", description: "Mark read/unread, delete and export leads" },
  { key: "users", group: "Administration", label: "Manage users", description: "Invite, edit, deactivate and remove users" },
  { key: "roles", group: "Administration", label: "Manage roles & permissions", description: "Create roles and choose what each can do" },
  { key: "activity", group: "Administration", label: "View activity log", description: "See who changed what and when" },
  { key: "backup", group: "Administration", label: "Backup, restore & reset", description: "Export, import or reset all site content" },
] as const;

export type Permission = (typeof PERMISSIONS)[number]["key"];

export const ALL_PERMISSIONS = PERMISSIONS.map((p) => p.key) as Permission[];

export const PERMISSION_GROUPS = [...new Set(PERMISSIONS.map((p) => p.group))];

export const ROLE_COLORS = ["violet", "sky", "emerald", "amber", "rose", "indigo", "slate"] as const;
export type RoleColor = (typeof ROLE_COLORS)[number];

export const ROLE_BADGE: Record<RoleColor | "owner", string> = {
  owner: "bg-amber-100 text-amber-800 ring-amber-200",
  violet: "bg-violet-100 text-violet-700 ring-violet-200",
  sky: "bg-sky-100 text-sky-700 ring-sky-200",
  emerald: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-100 text-amber-700 ring-amber-200",
  rose: "bg-rose-100 text-rose-700 ring-rose-200",
  indigo: "bg-indigo-100 text-indigo-700 ring-indigo-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-200",
};

export function can(permissions: readonly string[] | undefined, permission: Permission) {
  return !!permissions && permissions.includes(permission);
}

export function isPermission(p: string): p is Permission {
  return (ALL_PERMISSIONS as string[]).includes(p);
}

/** Which permission is needed to edit a given content key. */
export function permissionForKey(key: ContentKey): Permission {
  if (key === "theme" || key === "sections") return "design";
  if (key === "settings") return "brand";
  if (key === "pages" || key === "navigation") return "pages";
  if (key === "products" || key === "useCases") return "catalog";
  return "content";
}
