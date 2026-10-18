"use client";

import { useEffect, useState } from "react";
import { Send, X } from "lucide-react";

const DISMISS_KEY = "wa-widget-dismissed";

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
      <path d="M16.04 3C9.4 3 4 8.36 4 14.97c0 2.11.56 4.17 1.62 5.99L4 27l6.2-1.6a12.1 12.1 0 0 0 5.83 1.48h.01c6.63 0 12.03-5.36 12.03-11.97C28.07 8.36 22.67 3 16.04 3Zm0 21.86h-.01c-1.8 0-3.56-.48-5.1-1.39l-.37-.22-3.68.95.98-3.57-.24-.37a9.9 9.9 0 0 1-1.53-5.3c0-5.49 4.49-9.96 10-9.96 2.67 0 5.18 1.04 7.07 2.92a9.86 9.86 0 0 1 2.92 7.05c0 5.49-4.49 9.89-10.04 9.89Zm5.48-7.42c-.3-.15-1.78-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.27-.46-2.42-1.48a9.05 9.05 0 0 1-1.67-2.07c-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.23-.25-.59-.5-.5-.68-.51h-.58c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.5 0 1.46 1.08 2.88 1.23 3.08.15.2 2.12 3.22 5.13 4.52.72.31 1.28.5 1.71.63.72.23 1.38.2 1.9.12.58-.09 1.78-.72 2.03-1.42.25-.7.25-1.3.18-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

export function WhatsAppWidget({ number, agent, greeting, message, logoText }: { number: string; agent: string; greeting: string; message: string; logoText: string }) {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(false);
  const digits = number.replace(/\D/g, "");
  const href = `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

  // Show the greeting once per session, a few seconds after landing.
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {}
    if (dismissed) return;
    const t = window.setTimeout(() => {
      setUnread(true);
      if (window.innerWidth >= 640) setOpen(true);
    }, 5000);
    return () => window.clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    setUnread(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  };

  if (!digits) return null;

  return (
    <div className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-end gap-3 sm:right-6">
      {open && (
        <div role="dialog" aria-label={`Chat with ${agent} on WhatsApp`} className="w-[min(20rem,calc(100vw-2rem))] origin-bottom-right overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/25 ring-1 ring-black/5 animate-fade-up">
          <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3 text-white">
            <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 font-display text-sm font-bold">
              {logoText}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#25D366] ring-2 ring-[#075E54]" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{agent}</span>
              <span className="block text-xs text-white/70">Online · replies in minutes</span>
            </span>
            <button onClick={close} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10" aria-label="Close chat">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="bg-[#ECE5DD] bg-[radial-gradient(rgba(0,0,0,0.04)_1px,transparent_1px)] bg-size-[14px_14px] px-4 py-5">
            <div className="relative max-w-[85%] rounded-xl rounded-tl-none bg-white px-3.5 py-2.5 text-sm leading-relaxed text-slate-800 shadow-sm">
              {greeting}
              <span className="mt-1 block text-right text-[10px] text-slate-400">now</span>
            </div>
          </div>
          <div className="p-3">
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              onClick={close}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#25D366]/30 transition hover:brightness-105"
            >
              <Send className="h-4 w-4" /> Start chat
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => (open ? close() : (setOpen(true), setUnread(false)))}
        className={`group relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] ${open ? "" : "animate-wa-ring"} text-white shadow-xl shadow-[#25D366]/40 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40`}
        aria-label={open ? "Close WhatsApp chat" : "Chat on WhatsApp"}
        aria-expanded={open}
      >
        {open ? <X className="relative h-6 w-6" /> : <WhatsAppGlyph className="relative h-8 w-8" />}
        {unread && !open && (
          <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-[11px] font-bold ring-2 ring-white">1</span>
        )}
        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100 sm:block">
          Chat with us
        </span>
      </button>
    </div>
  );
}
