"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Loader2, Play } from "lucide-react";
import { Icon } from "@/lib/icons";
import { highlight } from "@/lib/highlight";
import type { PlaygroundItem } from "@/lib/types";

export function Playground({ items }: { items: PlaygroundItem[] }) {
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<"idle" | "loading" | "done">("idle");
  const [typed, setTyped] = useState("");
  const [copied, setCopied] = useState(false);
  const timers = useRef<number[]>([]);
  const item = items[active];

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const run = useCallback(() => {
    if (!item) return;
    clear();
    setPhase("loading");
    setTyped("");
    const latency = Math.min(Math.max(item.latency, 150), 2500);
    timers.current.push(
      window.setTimeout(() => {
        setPhase("done");
        const text = item.response;
        const chunk = Math.max(3, Math.ceil(text.length / 40));
        let pos = 0;
        const tick = () => {
          pos += chunk;
          setTyped(text.slice(0, pos));
          if (pos < text.length) timers.current.push(window.setTimeout(tick, 16));
        };
        tick();
      }, latency),
    );
  }, [item]);

  useEffect(() => {
    const t = window.setTimeout(run, 0);
    return () => {
      window.clearTimeout(t);
      clear();
    };
  }, [run]);

  if (!item) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(item.request);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="gradient-border relative rounded-2xl bg-[#0b1220]/90 shadow-2xl shadow-black/50 backdrop-blur">
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400/90" />
          <span className="h-3 w-3 rounded-full bg-amber-400/90" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
        </div>
        <span className="font-mono text-[11px] text-white/40">live sandbox · v1</span>
      </div>

      {/* Tabs */}
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-white/10 px-2 pt-2">
        {items.map((it, idx) => (
          <button
            key={it.id}
            onClick={() => setActive(idx)}
            className={`flex shrink-0 items-center gap-1.5 rounded-t-lg px-3 py-2 text-xs font-medium transition ${
              idx === active ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80"
            }`}
          >
            <Icon name={it.icon} className="h-3.5 w-3.5" />
            {it.label}
          </button>
        ))}
      </div>

      {/* Request */}
      <div className="px-4 pt-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2 font-mono text-xs">
            <span className="rounded bg-accent/20 px-1.5 py-0.5 font-semibold text-accent">{item.method}</span>
            <span className="truncate text-white/70">{item.endpoint}</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={copy} className="grid h-7 w-7 place-items-center rounded-md text-white/50 hover:bg-white/10 hover:text-white" aria-label="Copy request">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={run}
              disabled={phase === "loading"}
              className="flex items-center gap-1.5 rounded-md bg-brand px-2.5 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
            >
              {phase === "loading" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
              Send
            </button>
          </div>
        </div>
        <pre className="max-h-44 overflow-auto rounded-lg bg-black/30 p-3 font-mono text-[12px] leading-relaxed text-white/80">
          {highlight(item.request)}
        </pre>
      </div>

      {/* Response */}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between font-mono text-xs">
          <span className="text-white/50">Response</span>
          {phase === "loading" ? (
            <span className="text-white/50">routing to suppliers…</span>
          ) : phase === "done" ? (
            <span className="flex items-center gap-2">
              <span className="rounded bg-emerald-400/15 px-1.5 py-0.5 font-semibold text-emerald-300">200 OK</span>
              <span className="text-white/50">{item.latency} ms</span>
            </span>
          ) : null}
        </div>
        <div className="relative h-1 overflow-hidden rounded bg-white/5">
          <div
            className="absolute inset-y-0 left-0 bg-linear-to-r from-brand to-accent"
            style={{
              width: phase === "idle" ? "0%" : "100%",
              transition: phase === "loading" ? `width ${item.latency}ms linear` : "none",
            }}
          />
        </div>
        <pre className="mt-2 h-40 overflow-auto rounded-lg bg-black/30 p-3 font-mono text-[12px] leading-relaxed text-white/80">
          {phase === "done" ? highlight(typed) : <span className="text-white/30">{"// waiting for response"}</span>}
        </pre>
      </div>
    </div>
  );
}
