import path from "path";

// Server-only environment config. Never import this from a Client Component;
// browser-safe values must use the NEXT_PUBLIC_ prefix and live in `publicEnv`.

const DEV_EMAIL = "owner@localhost";
const DEV_PASSWORD = "admin123";
const DEV_SECRET = "dev-only-secret-change-me-in-env-local-000000";

const isProd = process.env.NODE_ENV === "production";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function str(name: string, fallback: string) {
  const v = process.env[name]?.trim();
  return v ? v : fallback;
}

function int(name: string, fallback: number, min: number, max: number) {
  const n = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : fallback;
}

function bool(name: string, fallback: boolean) {
  const v = process.env[name]?.trim().toLowerCase();
  if (v === "true" || v === "1") return true;
  if (v === "false" || v === "0") return false;
  return fallback;
}

export const env = {
  isProd,
  adminEmail: str("ADMIN_EMAIL", DEV_EMAIL).toLowerCase(),
  adminName: str("ADMIN_NAME", "Owner"),
  adminPassword: str("ADMIN_PASSWORD", DEV_PASSWORD),
  adminSecret: str("ADMIN_SECRET", DEV_SECRET),
  sessionDays: int("ADMIN_SESSION_DAYS", 7, 1, 90),
  // Defaults to secure cookies in production. Set false only when serving
  // production over plain http (e.g. a local XAMPP box), never on the internet.
  cookieSecure: bool("ADMIN_COOKIE_SECURE", isProd),
  // Runtime-configurable folder; tell the bundler not to trace it.
  dataDir: path.resolve(/*turbopackIgnore: true*/ process.cwd(), str("DATA_DIR", "data")),
  siteUrl: str("NEXT_PUBLIC_SITE_URL", "http://localhost:3000").replace(/\/+$/, ""),
};

/**
 * Problems that make the admin unsafe to expose. In production these block
 * sign-in; in development they are only warnings.
 */
export function adminEnvProblems(): string[] {
  const problems: string[] = [];
  if (env.adminEmail === DEV_EMAIL) problems.push("ADMIN_EMAIL is not set (using the dev default)");
  else if (!EMAIL_RE.test(env.adminEmail)) problems.push("ADMIN_EMAIL is not a valid email");
  if (env.adminPassword === DEV_PASSWORD) problems.push("ADMIN_PASSWORD is not set (using the dev default)");
  else if (env.adminPassword.length < 8) problems.push("ADMIN_PASSWORD must be at least 8 characters");
  if (env.adminSecret === DEV_SECRET) problems.push("ADMIN_SECRET is not set (using the dev default)");
  else if (env.adminSecret.length < 32) problems.push("ADMIN_SECRET must be at least 32 characters");
  return problems;
}

export function assertAdminEnv() {
  const problems = adminEnvProblems();
  if (!problems.length) return;
  if (isProd) {
    throw new Error(`Admin is disabled until the environment is configured:\n- ${problems.join("\n- ")}`);
  }
  console.warn(`[env] ${problems.join("; ")}`);
}
