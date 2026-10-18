import { createHmac, timingSafeEqual } from "crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { env, assertAdminEnv } from "./env";
import { ADMIN_COOKIE } from "./auth-constants";
import { ALL_PERMISSIONS, can, type Permission } from "./permissions";
import { getRoles } from "./roles";
import { findUserByEmail, getUsers, verifyPassword } from "./users";
import type { AdminUser, SessionUser } from "./types";

export { ADMIN_COOKIE };

export const OWNER_ID = "owner";

function sign(value: string) {
  return createHmac("sha256", env.adminSecret).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

// The owner's "version" is derived from the env credentials, so changing
// ADMIN_PASSWORD or ADMIN_EMAIL signs the owner out everywhere.
const ownerVersion = () => sign(`owner:${env.adminEmail}:${env.adminPassword}`).slice(0, 16);

const owner = (): SessionUser => ({
  id: OWNER_ID,
  name: env.adminName,
  email: env.adminEmail,
  roleId: "owner",
  roleName: "Owner",
  roleColor: "owner",
  permissions: [...ALL_PERMISSIONS],
  isOwner: true,
});

async function toSessionUser(user: AdminUser): Promise<SessionUser> {
  const role = (await getRoles()).find((r) => r.id === user.roleId);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roleId: user.roleId,
    roleName: role?.name ?? "No role",
    roleColor: role?.color ?? "slate",
    // A user whose role was deleted keeps signing in but can do nothing.
    permissions: role?.permissions ?? [],
    isOwner: false,
  };
}

type Payload = { uid: string; ver: string | number; exp: number };

function createSessionToken(uid: string, ver: string | number) {
  const payload: Payload = { uid, ver, exp: Date.now() + env.sessionDays * 86_400_000 };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export const sessionCookieOptions = () => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.cookieSecure,
  path: "/",
  maxAge: 60 * 60 * 24 * env.sessionDays,
});

/** Current signed-in user, or null. Re-validated against storage on every request. */
export const getSession = cache(async (): Promise<SessionUser | null> => {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const [body, mac] = token.split(".");
  if (!body || !mac || !safeEqual(mac, sign(body))) return null;
  // Expiry depends on the current time, so this must run per request.
  await connection();

  let payload: Payload;
  try {
    payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (!payload.exp || payload.exp < Date.now()) return null;

  if (payload.uid === OWNER_ID) return payload.ver === ownerVersion() ? owner() : null;

  const user = (await getUsers()).find((u) => u.id === payload.uid);
  if (!user || !user.active || user.sessionVersion !== payload.ver) return null;
  return toSessionUser(user);
});

/** For pages: signed-out visitors go to login, users without the permission go to the dashboard. */
export async function requireUser(permission?: Permission): Promise<SessionUser> {
  const user = await getSession();
  if (!user) redirect("/admin/login");
  if (permission && !can(user.permissions, permission)) redirect("/admin?denied=1");
  return user;
}

/** For server actions: returns the user, or null when not allowed. */
export async function authorize(permission?: Permission): Promise<SessionUser | null> {
  const user = await getSession();
  if (!user) return null;
  if (permission && !can(user.permissions, permission)) return null;
  return user;
}

// ── Sign-in with brute-force protection ───────────────────────────────────

const MAX_FAILS = 5;
const LOCK_MS = 10 * 60_000;
const attempts = new Map<string, { fails: number; until: number }>();

export type SignInResult = { ok: true; user: SessionUser; token: string } | { ok: false; message: string };

export async function signIn(emailInput: string, password: string): Promise<SignInResult> {
  assertAdminEnv();
  const email = emailInput.trim().toLowerCase();
  const now = Date.now();
  const state = attempts.get(email);
  if (state && state.until > now) {
    const mins = Math.ceil((state.until - now) / 60_000);
    return { ok: false, message: `Too many failed attempts. Try again in ${mins} minute${mins > 1 ? "s" : ""}.` };
  }

  let result: SignInResult | null = null;
  if (safeEqual(email, env.adminEmail) && safeEqual(sign(password), sign(env.adminPassword))) {
    result = { ok: true, user: owner(), token: createSessionToken(OWNER_ID, ownerVersion()) };
  } else {
    const user = await findUserByEmail(email);
    if (user && (await verifyPassword(password, user.passwordHash))) {
      result = user.active
        ? { ok: true, user: await toSessionUser(user), token: createSessionToken(user.id, user.sessionVersion) }
        : { ok: false, message: "This account has been deactivated. Ask an admin to re-enable it." };
    }
  }

  if (result?.ok) {
    attempts.delete(email);
    return result;
  }
  // A lock that has expired starts a fresh count.
  const prevFails = state && state.until && state.until <= now ? 0 : state?.fails ?? 0;
  const fails = prevFails + 1;
  attempts.set(email, { fails, until: fails >= MAX_FAILS ? now + LOCK_MS : 0 });
  return result ?? { ok: false, message: "Wrong email or password" };
}
