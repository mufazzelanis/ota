"use client";

import { useMemo, useState } from "react";
import { MapPin, Search, Terminal } from "lucide-react";
import { Icon } from "@/lib/icons";

type Region = { id: string; name: string; value: string; label: string };
type Item = { id: string; name: string; code: string; region: string; meta: string; tags: string };

export function CoverageExplorer({ regions, items, placeholder }: { regions: Region[]; items: Item[]; placeholder: string }) {
  const [region, setRegion] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const allTags = useMemo(
    () => [...new Set(items.flatMap((i) => i.tags.split(",").map((t) => t.trim()).filter(Boolean)))].slice(0, 12),
    [items],
  );
  const q = query.trim().toLowerCase();
  const list = items.filter(
    (i) =>
      (region === "All" || i.region === region) &&
      (!tag || i.tags.toLowerCase().includes(tag.toLowerCase())) &&
      (!q || `${i.name} ${i.code} ${i.meta} ${i.tags}`.toLowerCase().includes(q)),
  );

  return (
    <div>
      {regions.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {regions.map((r) => {
            const active = region === r.name;
            return (
              <button
                key={r.id}
                onClick={() => setRegion(active ? "All" : r.name)}
                className={`group rounded-2xl border p-4 text-left transition duration-300 ${
                  active ? "border-brand bg-brand text-white shadow-xl shadow-brand/20" : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lg"
                }`}
              >
                <span className={`flex items-center gap-1.5 text-xs font-medium ${active ? "text-white/80" : "text-muted"}`}>
                  <MapPin className="h-3.5 w-3.5" /> {r.name}
                </span>
                <span className={`mt-2 block font-display text-2xl font-bold ${active ? "text-white" : "text-ink"}`}>{r.value}</span>
                <span className={`text-xs ${active ? "text-white/70" : "text-muted"}`}>{r.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder || "Search…"}
              className="w-full rounded-xl border border-slate-200 bg-surface py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-brand focus:bg-white focus:ring-4 focus:ring-brand/10"
            />
          </div>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {["All", ...regions.map((r) => r.name)].map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${region === r ? "bg-ink text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 border-b border-slate-100 px-4 py-3">
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(tag === t ? null : t)}
                className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${tag === t ? "bg-accent text-accent-ink" : "bg-brand/5 text-brand hover:bg-brand/10"}`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
        <ul className="divide-y divide-slate-100">
          {list.map((i) => (
            <li key={i.id} className="flex flex-col gap-2 px-4 py-3.5 transition hover:bg-surface sm:flex-row sm:items-center sm:gap-4">
              <span className="grid h-10 w-14 shrink-0 place-items-center rounded-lg bg-brand-dark font-mono text-xs font-bold text-accent">{i.code}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-ink">{i.name}</span>
                <span className="block text-xs text-muted">
                  {i.meta} · {i.region}
                </span>
              </span>
              <span className="flex flex-wrap gap-1">
                {i.tags.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                  <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">{t}</span>
                ))}
              </span>
            </li>
          ))}
          {!list.length && <li className="px-4 py-12 text-center text-sm text-muted">Nothing matches. Try another region or search term.</li>}
        </ul>
        <div className="border-t border-slate-100 bg-surface px-4 py-2.5 text-xs text-muted">
          Showing {list.length} of {items.length}
        </div>
      </div>
    </div>
  );
}

type Group = { slug: string; name: string; icon: string; endpoints: string[] };

export function EndpointsExplorer({ groups }: { groups: Group[] }) {
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const shown = groups
    .filter((g) => active === "all" || g.slug === active)
    .map((g) => ({ ...g, endpoints: g.endpoints.filter((e) => !q || e.toLowerCase().includes(q) || g.name.toLowerCase().includes(q)) }))
    .filter((g) => g.endpoints.length);
  const total = groups.reduce((n, g) => n + g.endpoints.length, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="self-start rounded-2xl border border-slate-200 bg-white p-2 lg:sticky lg:top-24">
        <button
          onClick={() => setActive("all")}
          className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium ${active === "all" ? "bg-brand/10 text-brand" : "text-slate-600 hover:bg-slate-50"}`}
        >
          All products <span className="text-xs">{total}</span>
        </button>
        {groups.map((g) => (
          <button
            key={g.slug}
            onClick={() => setActive(g.slug)}
            className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium ${active === g.slug ? "bg-brand/10 text-brand" : "text-slate-600 hover:bg-slate-50"}`}
          >
            <Icon name={g.icon} className="h-4 w-4 shrink-0" />
            <span className="flex-1 truncate">{g.name.replace(/ API$/, "")}</span>
            <span className="text-xs text-slate-400">{g.endpoints.length}</span>
          </button>
        ))}
      </aside>
      <div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search endpoints, e.g. /book or hotel"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 font-mono text-sm outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
          />
        </div>
        <div className="space-y-4">
          {shown.map((g) => (
            <div key={g.slug} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center gap-2 border-b border-slate-100 bg-surface px-4 py-3">
                <Icon name={g.icon} className="h-4 w-4 text-brand" />
                <a href={`/products/${g.slug}`} className="font-display font-semibold text-ink hover:text-brand">{g.name}</a>
              </div>
              <ul className="divide-y divide-slate-100 font-mono text-[13px]">
                {g.endpoints.map((e) => {
                  const [method, ...rest] = e.split(" ");
                  const tone = method === "GET" ? "bg-emerald-100 text-emerald-700" : method === "DELETE" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-800";
                  return (
                    <li key={e} className="flex items-center gap-3 px-4 py-3 hover:bg-surface">
                      <span className={`w-16 shrink-0 rounded px-2 py-0.5 text-center text-[11px] font-bold ${tone}`}>{method}</span>
                      <span className="truncate text-ink">{rest.join(" ")}</span>
                      <Terminal className="ml-auto h-4 w-4 shrink-0 text-slate-300" />
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {!shown.length && <p className="rounded-2xl border border-dashed border-slate-200 p-10 text-center text-sm text-muted">No endpoints match.</p>}
        </div>
      </div>
    </div>
  );
}
