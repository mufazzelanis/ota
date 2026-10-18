"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, Upload, RotateCcw, Loader2 } from "lucide-react";
import { importAll, resetAll } from "@/app/actions/admin";
import type { Content } from "@/lib/types";
import { Toast, card, useToast } from "./ui";

export function DataTools({ content }: { content: Content }) {
  const router = useRouter();
  const file = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();
  const [toast, setToast] = useToast();

  const exportJson = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(content, null, 2)], { type: "application/json" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: `site-content-backup.json` });
    a.click();
    URL.revokeObjectURL(url);
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    let parsed: Partial<Content>;
    try {
      parsed = JSON.parse(await f.text());
    } catch {
      return setToast({ ok: false, message: "That file isn't valid JSON" });
    }
    if (!window.confirm("Replace the site content with this backup?")) return;
    start(async () => {
      setToast(await importAll(parsed));
      router.refresh();
    });
    if (file.current) file.current.value = "";
  };

  const reset = () => {
    if (!window.confirm("Reset ALL site content to the original defaults? Export a backup first if unsure.")) return;
    start(async () => {
      setToast(await resetAll());
      router.refresh();
    });
  };

  const btn = "inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition disabled:opacity-50";

  return (
    <div className={`${card} p-6`}>
      <h2 className="flex items-center gap-2 font-display font-semibold text-slate-900">
        Backup & restore {pending && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
      </h2>
      <p className="mt-1 text-sm text-slate-500">Download all content as JSON, restore from a backup, or start over.</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <button onClick={exportJson} className={`${btn} border-slate-200 text-slate-700 hover:bg-slate-50`}>
          <Download className="h-4 w-4" /> Export JSON
        </button>
        <button onClick={() => file.current?.click()} disabled={pending} className={`${btn} border-slate-200 text-slate-700 hover:bg-slate-50`}>
          <Upload className="h-4 w-4" /> Import JSON
        </button>
        <button onClick={reset} disabled={pending} className={`${btn} border-rose-200 text-rose-600 hover:bg-rose-50`}>
          <RotateCcw className="h-4 w-4" /> Reset to defaults
        </button>
        <input ref={file} type="file" accept="application/json" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
      </div>
      <Toast result={toast} />
    </div>
  );
}
