import { ALL_PERMISSIONS } from "./permissions";
import { dataFile, readJson, updateJson } from "./storage";
import type { Role } from "./types";

const ROLES_FILE = dataFile("roles.json");
const SEEDED_AT = "2026-01-01T00:00:00.000Z";

// Starting roles. They behave like any other role and can be edited or removed.
export const DEFAULT_ROLES: Role[] = [
  {
    id: "admin",
    name: "Admin",
    description: "Full access, including users, roles and backups.",
    color: "violet",
    permissions: [...ALL_PERMISSIONS],
    createdAt: SEEDED_AT,
  },
  {
    id: "editor",
    name: "Editor",
    description: "Edits website content, pages, products, theme and layout.",
    color: "sky",
    permissions: ["content", "catalog", "pages", "design", "brand"],
    createdAt: SEEDED_AT,
  },
  {
    id: "sales",
    name: "Sales",
    description: "Works the leads inbox.",
    color: "emerald",
    permissions: ["leads.view", "leads.manage"],
    createdAt: SEEDED_AT,
  },
];

export async function getRoles(): Promise<Role[]> {
  return (await readJson<Role[]>(ROLES_FILE)) ?? DEFAULT_ROLES;
}

export function updateRoles(fn: (roles: Role[]) => Role[]) {
  return updateJson<Role[]>(ROLES_FILE, DEFAULT_ROLES, fn);
}
