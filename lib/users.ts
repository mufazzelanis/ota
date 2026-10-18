import { randomBytes, scrypt as scryptCb, timingSafeEqual, type BinaryLike } from "crypto";
import { promisify } from "util";
import { dataFile, readJson, updateJson } from "./storage";
import type { AdminUser, PublicUser } from "./types";

const scrypt = promisify(scryptCb) as (pw: BinaryLike, salt: BinaryLike, len: number) => Promise<Buffer>;
const USERS_FILE = dataFile("users.json");
const KEY_LEN = 64;

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = await scrypt(password, salt, KEY_LEN);
  return `scrypt$${salt}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [algo, salt, hex] = stored.split("$");
  if (algo !== "scrypt" || !salt || !hex) return false;
  const expected = Buffer.from(hex, "hex");
  const actual = await scrypt(password, salt, expected.length);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function passwordProblem(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (password.length > 200) return "Password is too long";
  return null;
}

export async function getUsers(): Promise<AdminUser[]> {
  return (await readJson<AdminUser[]>(USERS_FILE)) ?? [];
}

export function updateUsers(fn: (users: AdminUser[]) => AdminUser[]) {
  return updateJson<AdminUser[]>(USERS_FILE, [], fn);
}

export async function findUserByEmail(email: string) {
  const e = email.trim().toLowerCase();
  return (await getUsers()).find((u) => u.email === e) ?? null;
}

export function toPublic(u: AdminUser): PublicUser {
  return { id: u.id, name: u.name, email: u.email, roleId: u.roleId, active: u.active, createdAt: u.createdAt, lastLoginAt: u.lastLoginAt };
}
