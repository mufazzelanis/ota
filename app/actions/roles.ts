"use server";

import { authorize } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { isPermission, ROLE_COLORS } from "@/lib/permissions";
import { getRoles, updateRoles } from "@/lib/roles";
import { getUsers } from "@/lib/users";
import type { ActionResult } from "./admin";

const DENIED: ActionResult = { ok: false, message: "You don't have permission to do that" };

type RoleInput = { name: string; description: string; color: string; permissions: string[] };

function clean(input: RoleInput) {
  return {
    name: input.name.trim().slice(0, 40),
    description: input.description.trim().slice(0, 200),
    color: (ROLE_COLORS as readonly string[]).includes(input.color) ? input.color : "slate",
    permissions: [...new Set(input.permissions.filter(isPermission))],
  };
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "role";

export async function saveRole(id: string | null, input: RoleInput): Promise<ActionResult & { id?: string }> {
  const actor = await authorize("roles");
  if (!actor) return DENIED;
  const role = clean(input);
  if (role.name.length < 2) return { ok: false, message: "Role name must be at least 2 characters" };
  if (role.name.toLowerCase() === "owner") return { ok: false, message: '"Owner" is reserved' };

  const roles = await getRoles();
  if (roles.some((r) => r.name.toLowerCase() === role.name.toLowerCase() && r.id !== id)) {
    return { ok: false, message: "A role with that name already exists" };
  }

  if (id) {
    if (!roles.some((r) => r.id === id)) return { ok: false, message: "Role not found" };
    await updateRoles((rs) => rs.map((r) => (r.id === id ? { ...r, ...role } : r)));
    await logActivity(actor, "Updated role", `${role.name} (${role.permissions.length} permissions)`);
    return { ok: true, message: "Role saved. Members get the new permissions right away.", id };
  }

  let newId = slug(role.name);
  while (roles.some((r) => r.id === newId)) newId = `${slug(role.name)}-${Math.random().toString(36).slice(2, 6)}`;
  await updateRoles((rs) => [...rs, { id: newId, ...role, createdAt: new Date().toISOString() }]);
  await logActivity(actor, "Created role", role.name);
  return { ok: true, message: "Role created", id: newId };
}

export async function deleteRole(id: string): Promise<ActionResult> {
  const actor = await authorize("roles");
  if (!actor) return DENIED;
  const members = (await getUsers()).filter((u) => u.roleId === id).length;
  if (members) return { ok: false, message: `Move the ${members} user${members > 1 ? "s" : ""} in this role to another role first` };
  const roles = await getRoles();
  const role = roles.find((r) => r.id === id);
  if (!role) return { ok: false, message: "Role not found" };
  await updateRoles((rs) => rs.filter((r) => r.id !== id));
  await logActivity(actor, "Deleted role", role.name);
  return { ok: true, message: "Role deleted" };
}
