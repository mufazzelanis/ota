"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, Mail, MailOpen, Search, Trash2, Inbox } from "lucide-react";
import { deleteLead, logLeadExport, markLead } from "@/app/actions/admin";
import type { Lead } from "@/lib/types";
import { inputCls } from "./fields";
import { Toast, card, useToast } from "./ui";

export function LeadsTable({ leads, canManage }: { leads: Lead[]; canManage: boolean }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [toast, setToast] = useToast();

  const list = useMemo(
    () =>
      leads.filter(
        (l) => (filter === "all" || !l.read) && (!query || `${l.name} ${l.email} ${l.company}`.toLowerCase().includes(query.toLowerCase())),
      ),
    [leads, filter, query],
  );

  const run = (fn: () => Promise<{ ok: boolean; message: string }>) =>
    start(async () => {
      setToast(await fn());
      router.refresh();
    });

  const exportCsv = () => {
    const rows = [["Date", "Name", "Email", "Company", "Business", "Products", "Message"]].concat(
      leads.map((l) => [l.createdAt, l.name, l.email, l.company, l.businessType, l.products.join("; "), l.message]),
    );
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "leads.csv" });
    a.click();
    URL.revokeObjectURL(url);
    void logLeadExport(leads.length);
  };

  const unread = leads.filter((l) => !l.read).length;

  return (
    <div className={card}>
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
        <div className="flex rounded-lg bg-slate-100 p-1 text-sm">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 font-medium capitalize transition ${filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
            >
              {f} {f === "unread" && unread > 0 && <span className="ml-1 rounded-full bg-brand px-1.5 text-xs text-white">{unread}</span>}
            </button>
          ))}
        </div>
        <div className="relative min-w-48 flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className={`${inputCls} pl-8`} placeholder="Search name, email, company" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        {canManage && (
        <button onClick={exportCsv} disabled={!leads.length} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
          <Download className="h-4 w-4" /> Export CSV
        </button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="grid place-items-center p-16 text-center">
          <Inbox className="h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm text-slate-500">No leads yet. Submissions from the Request Access form appear here.</p>
        </div>
      ) : (
        <ul className={`divide-y divide-slate-100 ${pending ? "opacity-60" : ""}`}>
          {list.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => {
                  setOpen(open === l.id ? null : l.id);
                  if (!l.read) run(() => markLead(l.id, true));
                }}
                className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-slate-50"
              >
                <span className={`h-2 w-2 shrink-0 rounded-full ${l.read ? "bg-transparent" : "bg-brand"}`} />
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/10 text-sm font-bold text-brand">{l.name[0]?.toUpperCase()}</span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-sm ${l.read ? "text-slate-600" : "font-semibold text-slate-900"}`}>
                    {l.name} · {l.company}
                  </span>
                  <span className="block truncate text-xs text-slate-400">{l.email} · {l.businessType}</span>
                </span>
                <span className="hidden shrink-0 text-xs text-slate-400 sm:block">{new Date(l.createdAt).toLocaleString()}</span>
              </button>
              {open === l.id && (
                <div className="bg-slate-50 px-5 pb-5 pl-[4.5rem] animate-fade-up">
                  {l.products.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {l.products.map((p) => (
                        <span key={p} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">{p}</span>
                      ))}
                    </div>
                  )}
                  <p className="mt-3 whitespace-pre-line text-sm text-slate-700">{l.message || <em className="text-slate-400">No message</em>}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a href={`mailto:${l.email}`} className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white">
                      <Mail className="h-3.5 w-3.5" /> Reply
                    </a>
                    {canManage && (
                      <>
                    <button onClick={() => run(() => markLead(l.id, false))} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700">
                      <MailOpen className="h-3.5 w-3.5" /> Mark unread
                    </button>
                    <button
                      onClick={() => window.confirm("Delete this lead?") && run(() => deleteLead(l.id))}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <Toast result={toast} />
    </div>
  );
}
