"use client";

import { useActionState } from "react";
import { Loader2, Lock } from "lucide-react";
import { login, type ActionResult } from "@/app/actions/admin";

export default function LoginPage() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(login, null);

  return (
    <div className="hero-bg grid min-h-screen place-items-center px-4">
      <form action={action} className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl shadow-black/40 animate-fade-up">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/30">
          <Lock className="h-5 w-5" />
        </span>
        <h1 className="mt-6 font-display text-2xl font-bold text-ink">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted">Sign in with your team account.</p>
        <label className="mt-6 block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="username"
            autoFocus
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
          />
        </label>
        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
          />
        </label>
        {state && !state.ok && <p className="mt-3 text-sm text-rose-600">{state.message}</p>}
        <button
          disabled={pending}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand/25 hover:brightness-110 disabled:opacity-70"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
        </button>
      </form>
    </div>
  );
}
