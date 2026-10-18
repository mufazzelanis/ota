"use client";

import { useEffect, useState } from "react";
import { Plus, Play, X, Smartphone, Server, Plane, Building2, Car, TrainFront } from "lucide-react";
import type { Faq } from "@/lib/types";

export function FaqList({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  return (
    <div className="space-y-3">
      {items.map((f) => {
        const isOpen = open === f.id;
        return (
          <div
            key={f.id}
            className={`rounded-2xl border transition-colors ${isOpen ? "border-brand/30 bg-white shadow-lg shadow-brand/5" : "border-slate-200 bg-surface"}`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : f.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display text-[15px] font-semibold text-ink">{f.question}</span>
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-full transition ${
                  isOpen ? "rotate-45 bg-brand text-white" : "bg-brand/10 text-brand"
                }`}
              >
                <Plus className="h-4 w-4" />
              </span>
            </button>
            <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{f.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const SUPPLIERS = [
  { icon: Plane, label: "Airlines" },
  { icon: Building2, label: "Hotels" },
  { icon: Car, label: "Transfers" },
  { icon: TrainFront, label: "Rail" },
];

export function VideoButton({ label, brandName }: { label: string; brandName: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button onClick={() => setOpen(true)} className="group inline-flex items-center gap-3 text-sm font-medium text-white">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-brand-dark animate-pulse-ring transition group-hover:scale-105">
          <Play className="ml-0.5 h-4 w-4 fill-current" />
        </span>
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-60 grid place-items-center bg-black/70 p-4 backdrop-blur-sm animate-fade-up" onClick={() => setOpen(false)}>
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl bg-[#0b1220] p-6 sm:p-10" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent">How a request flows</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-white">One call in, every supplier out.</h3>

            <div className="mt-10 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-4">
              <Node icon={<Smartphone className="h-6 w-6" />} label="Your app" />
              <Wire />
              <Node icon={<Server className="h-6 w-6" />} label={brandName} highlight />
              <Wire />
              <div className="grid gap-2">
                {SUPPLIERS.map(({ icon: I, label: l }, i) => (
                  <div key={l} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/80 animate-fade-up" style={{ animationDelay: `${300 + i * 150}ms` }}>
                    <I className="h-3.5 w-3.5 text-accent" /> {l}
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-10 text-sm leading-relaxed text-white/60">
              Your app sends one normalized request. We fan it out to every relevant supplier in parallel, merge and rank the results, and return a single response in under a second.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

function Node({ icon, label, highlight }: { icon: React.ReactNode; label: string; highlight?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center sm:p-4 ${highlight ? "border-brand bg-brand/20 text-white" : "border-white/10 bg-white/5 text-white/80"}`}>
      {icon}
      <span className="text-xs font-semibold">{label}</span>
    </div>
  );
}

function Wire() {
  return (
    <div className="relative h-0.5 w-6 overflow-hidden rounded bg-white/10 sm:w-14">
      <span className="absolute inset-y-0 w-1/2 bg-linear-to-r from-transparent via-accent to-transparent animate-wire" />
    </div>
  );
}
