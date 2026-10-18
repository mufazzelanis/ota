"use server";

import { randomUUID } from "crypto";
import { authorize, getSession } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { env, EMAIL_RE } from "@/lib/env";
import { getRoles } from "@/lib/roles";
import { getUsers, hashPassword, passwordProblem, updateUsers, verifyPassword } from "@/lib/users";
import type { ActionResult } from "./admin";

const DENIED: ActionResult = { ok: false, message: "You don't have permission to do that" };

type UserInput = { name: string; email: string; roleId: string; password?: string; active?: boolean };

async function validate(input: UserInput, editingId?: string): Promise<string | null> {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  if (name.length < 2) return "Name must be at least 2 characters";
  if (!EMAIL_RE.test(email)) return "Enter a valid email";
  if (email === env.adminEmail) return "That email belongs to the owner account";
  if ((await getUsers()).some((u) => u.email === email && u.id !== editingId)) return "Another user already has that email";
  if (!(await getRoles()).some((r) => r.id === input.roleId)) return "Choose a valid role";
  if (input.password !== undefined) return passwordProblem(input.password);
  return null;
}

export async function createUser(input: UserInput): Promise<ActionResult> {
  const actor = await authorize("users");
  if (!actor) return DENIED;
  const problem = await validate({ ...input, password: input.password ?? "" });
  if (problem) return { ok: false, message: problem };

  const email = input.email.trim().toLowerCase();
  const passwordHash = await hashPassword(input.password!);
  await updateUsers((users) => [
    ...users,
    {
      id: randomUUID(),
      name: input.name.trim(),
      email,
      roleId: input.roleId,
      passwordHash,
      active: input.active ?? true,
      sessionVersion: 1,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
    },
  ]);
  await logActivity(actor, "Created user", email);
  return { ok: true, message: `${input.name.trim()} can now sign in` };
}

export async function updateUser(id: string, input: UserInput): Promise<ActionResult> {
  const actor = await authorize("users");
  if (!actor) return DENIED;
  const problem = await validate({ ...input, password: undefined }, id);
  if (problem) return { ok: false, message: problem };
  if (id === actor.id && input.active === false) return { ok: false, message: "You can't deactivate your own account" };

  let found = false;
  await updateUsers((users) =>
    users.map((u) => {
      if (u.id !== id) return u;
      found = true;
      const deactivated = u.active && input.active === false;
      return {
        ...u,
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        roleId: input.roleId,
        active: input.active ?? u.active,
        // Deactivating signs the user out immediately.
        sessionVersion: deactivated ? u.sessionVersion + 1 : u.sessionVersion,
      };
    }),
  );
  if (!found) return { ok: false, message: "User not found" };
  await logActivity(actor, "Updated user", input.email.trim().toLowerCase());
  return { ok: true, message: "User updated" };
}

export async function resetUserPassword(id: string, password: string): Promise<ActionResult> {
  const actor = await authorize("users");
  if (!actor) return DENIED;
  const problem = passwordProblem(password);
  if (problem) return { ok: false, message: problem };
  const passwordHash = await hashPassword(password);
  let email = "";
  await updateUsers((users) =>
    users.map((u) => {
      if (u.id !== id) return u;
      email = u.email;
      return { ...u, passwordHash, sessionVersion: u.sessionVersion + 1 };
    }),
  );
  if (!email) return { ok: false, message: "User not found" };
  await logActivity(actor, "Reset password", email);
  return { ok: true, message: "Password reset. Their other sessions were signed out." };
}

export async function deleteUser(id: string): Promise<ActionResult> {
  const actor = await authorize("users");
  if (!actor) return DENIED;
  if (id === actor.id) return { ok: false, message: "You can't delete your own account" };
  let email = "";
  await updateUsers((users) => {
    email = users.find((u) => u.id === id)?.email ?? "";
    return users.filter((u) => u.id !== id);
  });
  if (!email) return { ok: false, message: "User not found" };
  await logActivity(actor, "Deleted user", email);
  return { ok: true, message: "User deleted" };
}

// ── Self-service profile ──────────────────────────────────────────────────

export async function updateProfile(name: string): Promise<ActionResult> {
  const me = await getSession();
  if (!me) return DENIED;
  if (me.isOwner) return { ok: false, message: "The owner's name is set with ADMIN_NAME in .env" };
  if (name.trim().length < 2) return { ok: false, message: "Name must be at least 2 characters" };
  await updateUsers((users) => users.map((u) => (u.id === me.id ? { ...u, name: name.trim() } : u)));
  await logActivity({ id: me.id, name: name.trim() }, "Updated profile");
  return { ok: true, message: "Profile updated" };
}

export async function changeOwnPassword(current: string, next: string): Promise<ActionResult> {
  const me = await getSession();
  if (!me) return DENIED;
  if (me.isOwner) return { ok: false, message: "The owner's password is set with ADMIN_PASSWORD in .env" };
  const user = (await getUsers()).find((u) => u.id === me.id);
  if (!user || !(await verifyPassword(current, user.passwordHash))) return { ok: false, message: "Current password is incorrect" };
  const problem = passwordProblem(next);
  if (problem) return { ok: false, message: problem };
  const passwordHash = await hashPassword(next);
  // Keep this session valid: the cookie carries the old version, so don't bump it here.
  await updateUsers((users) => users.map((u) => (u.id === me.id ? { ...u, passwordHash } : u)));
  await logActivity(me, "Changed own password");
  return { ok: true, message: "Password changed" };
}
