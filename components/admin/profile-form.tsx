"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Info, Loader2 } from "lucide-react";
import { changeOwnPassword, updateProfile } from "@/app/actions/users";
import { ROLE_BADGE, type RoleColor } from "@/lib/permissions";
import type { SessionUser } from "@/lib/types";
import { inputCls } from "./fields";
import { Toast, useToast } from "./ui";
import { card } from "./styles";

export function ProfileForm({ user, granted }: { user: SessionUser; granted: string[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [toast, setToast] = useToast();
  const [name, setName] = useState(user.name);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });

  const saveName = () =>
    start(async () => {
      const r = await updateProfile(name);
      setToast(r);
      if (r.ok) router.refresh();
    });

  const savePassword = () => {
    if (pw.next !== pw.confirm) return setToast({ ok: false, message: "New passwords don't match" });
    start(async () => {
      const r = await changeOwnPassword(pw.current, pw.next);
      setToast(r);
      if (r.ok) setPw({ current: "", next: "", confirm: "" });
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        {user.isOwner && (
          <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <Info className="h-5 w-5 shrink-0" />
            <p>
              You&apos;re signed in as the <b>owner</b>. Your name, email and password come from <code className="rounded bg-amber-100 px-1">ADMIN_NAME</code>,{" "}
              <code className="rounded bg-amber-100 px-1">ADMIN_EMAIL</code> and <code className="rounded bg-amber-100 px-1">ADMIN_PASSWORD</code> in your .env file.
            </p>
          </div>
        )}

        <div className={`${card} p-6`}>
          <h2 className="font-display font-semibold text-slate-900">Account</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Name</span>
              <input className={inputCls} value={name} disabled={user.isOwner} onChange={(e) => setName(e.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
              <input className={`${inputCls} bg-slate-50`} value={user.email} disabled />
              <span className="mt-1 block text-xs text-slate-400">Ask an admin to change your email.</span>
            </label>
          </div>
          {!user.isOwner && (
            <button onClick={saveName} disabled={pending || name === user.name} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {pending && <Loader2 className="h-4 w-4 animate-spin" />} Save name
            </button>
          )}
        </div>

        {!user.isOwner && (
          <form
            className={`${card} p-6`}
            onSubmit={(e) => {
              e.preventDefault();
              savePassword();
            }}
          >
            <h2 className="font-display font-semibold text-slate-900">Change password</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {(
                [
                  ["current", "Current password", "current-password"],
                  ["next", "New password", "new-password"],
                  ["confirm", "Confirm new password", "new-password"],
                ] as const
              ).map(([k, label, ac]) => (
                <label key={k} className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
                  <input type="password" autoComplete={ac} className={inputCls} value={pw[k]} onChange={(e) => setPw({ ...pw, [k]: e.target.value })} />
                </label>
              ))}
            </div>
            <button disabled={pending || !pw.current || pw.next.length < 8} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {pending && <Loader2 className="h-4 w-4 animate-spin" />} Update password
            </button>
          </form>
        )}
      </div>

      <div className={`${card} self-start p-6`}>
        <h2 className="font-display font-semibold text-slate-900">Your role</h2>
        <span className={`mt-3 inline-flex rounded-md px-2 py-0.5 text-sm font-semibold ring-1 ${ROLE_BADGE[user.roleColor as RoleColor] ?? ROLE_BADGE.slate}`}>{user.roleName}</span>
        <ul className="mt-4 space-y-2">
          {granted.map((g) => (
            <li key={g} className="flex items-center gap-2 text-sm text-slate-600">
              <Check className="h-4 w-4 text-emerald-500" /> {g}
            </li>
          ))}
          {!granted.length && <li className="text-sm text-slate-400">No permissions yet. Ask an admin to assign a role.</li>}
        </ul>
      </div>
      <Toast result={toast} />
    </div>
  );
}
