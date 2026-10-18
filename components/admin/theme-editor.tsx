"use client";

import type { CSSProperties } from "react";
import { Check, ArrowRight } from "lucide-react";
import { THEME_PRESETS, themeToCss } from "@/lib/themes";
import type { Theme } from "@/lib/types";
import { inputCls } from "./fields";
import { SaveBar, Toast, card, useDraft } from "./ui";

const COLOR_FIELDS: { key: keyof Theme; label: string; help: string }[] = [
  { key: "dark", label: "Dark surface", help: "Hero, footer, dark cards" },
  { key: "brand", label: "Brand", help: "Buttons, links, icons" },
  { key: "accent", label: "Accent", help: "Highlights and main CTA" },
  { key: "accentInk", label: "Text on accent", help: "Must contrast with accent" },
];

export function ThemeEditor({ initial }: { initial: Theme }) {
  const { draft, setDraft, dirty, pending, save, discard, toast } = useDraft("theme", initial);

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <div className={`${card} p-6`}>
            <h2 className="font-display font-semibold text-slate-900">Brand palettes</h2>
            <p className="mt-1 text-sm text-slate-500">Pick one of your shortlisted palettes, then fine-tune below.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {THEME_PRESETS.map(({ name, note, ...t }) => {
                const active = draft.preset === t.preset;
                return (
                  <button
                    key={t.preset}
                    onClick={() => setDraft(t)}
                    className={`relative rounded-xl border-2 p-4 text-left transition ${active ? "border-brand shadow-lg shadow-brand/10" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    {active && (
                      <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-brand text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <div className="flex h-12 overflow-hidden rounded-lg">
                      <span className="flex-[2]" style={{ background: t.dark }} />
                      <span className="flex-[2]" style={{ background: t.brand }} />
                      <span className="flex-1" style={{ background: t.accent }} />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-slate-900">{name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{note}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`${card} p-6`}>
            <h2 className="font-display font-semibold text-slate-900">Custom colors</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {COLOR_FIELDS.map((f) => (
                <label key={f.key} className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">{f.label}</span>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={draft[f.key]}
                      onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value, preset: "custom" })}
                      className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                    />
                    <input
                      className={`${inputCls} font-mono uppercase`}
                      value={draft[f.key]}
                      onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value, preset: "custom" })}
                    />
                  </div>
                  <span className="mt-1 block text-xs text-slate-400">{f.help}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Live preview with the draft palette scoped to this box */}
        <div className="xl:sticky xl:top-24 xl:self-start">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Live preview</p>
          <div style={themeToCss(draft) as CSSProperties} className="overflow-hidden rounded-2xl border border-slate-200 shadow-xl">
            <div className="hero-bg p-6">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-md bg-brand" />
                  <span className="h-2.5 w-16 rounded bg-white/70" />
                </span>
                <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-accent-ink">Request access</span>
              </div>
              <h3 className="mt-8 font-display text-2xl font-extrabold leading-tight text-white">
                One travel API.<br />
                <span className="text-accent">in one schema.</span>
              </h3>
              <p className="mt-2 text-xs text-white/60">Flights, hotels, transfers and more through one integration.</p>
              <div className="mt-5 flex gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-ink">
                  Get started <ArrowRight className="h-3 w-3" />
                </span>
                <span className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white">Explore</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 bg-white p-5">
              {["Flights", "Hotels"].map((t) => (
                <div key={t} className="rounded-xl border border-slate-200 bg-surface p-3">
                  <span className="block h-7 w-7 rounded-lg bg-brand/15" />
                  <p className="mt-2 text-xs font-semibold text-ink">{t} API</p>
                  <p className="mt-1 text-[10px] font-semibold text-brand">Explore →</p>
                </div>
              ))}
            </div>
            <div className="bg-brand p-4 text-center text-xs font-semibold text-white">Start in the sandbox today</div>
          </div>
        </div>
      </div>
      <SaveBar dirty={dirty} pending={pending} onSave={() => save()} onDiscard={discard} />
      <Toast result={toast} />
    </>
  );
}
