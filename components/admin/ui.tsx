"use client";

import { useEffect, useState, useTransition } from "react";
import { CheckCircle2, AlertCircle, Loader2, RotateCcw, Save } from "lucide-react";
import { saveSection, type ActionResult } from "@/app/actions/admin";
import type { Content, ContentKey } from "@/lib/types";

export function Toast({ result }: { result: ActionResult | null }) {
  if (!result) return null;
  return (
    <div className="fixed bottom-24 right-6 z-50 animate-fade-up">
      <div
        className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-2xl ${
          result.ok ? "bg-slate-900 text-white" : "bg-rose-600 text-white"
        }`}
      >
        {result.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertCircle className="h-4 w-4" />}
        {result.message}
      </div>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<ActionResult | null>(null);
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(t);
  }, [toast]);
  return [toast, setToast] as const;
}

/** Local draft + baseline for one content key, with save/discard and unsaved-changes guard. */
export function useDraft<K extends ContentKey>(key: K, initial: Content[K]) {
  const [baseline, setBaseline] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [pending, start] = useTransition();
  const [toast, setToast] = useToast();
  const dirty = JSON.stringify(draft) !== JSON.stringify(baseline);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const save = (value: Content[K] = draft, validate?: (v: Content[K]) => string | null) => {
    const problem = validate?.(value);
    if (problem) return setToast({ ok: false, message: problem });
    start(async () => {
      const r = await saveSection(key, value);
      setToast(r);
      if (r.ok) {
        setDraft(value);
        setBaseline(value);
      }
    });
  };

  return { draft, setDraft, dirty, pending, save, discard: () => setDraft(baseline), toast };
}

export function SaveBar({
  dirty,
  pending,
  onSave,
  onDiscard,
}: {
  dirty: boolean;
  pending: boolean;
  onSave: () => void;
  onDiscard: () => void;
}) {
  return (
    <div
      className={`sticky bottom-4 z-30 mt-8 transition-all duration-300 ${
        dirty || pending ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-2xl backdrop-blur">
        <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-amber-500" /> Unsaved changes
        </span>
        <div className="flex gap-2">
          <button onClick={onDiscard} disabled={pending} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
            <RotateCcw className="h-4 w-4" /> Discard
          </button>
          <button
            onClick={onSave}
            disabled={pending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow hover:brightness-110 disabled:opacity-70"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save & publish
          </button>
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export { card } from "./styles";
