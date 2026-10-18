"use client";

import { useMemo, useState } from "react";
import {
  ArrowDown, ArrowUp, ChevronDown, Copy, ExternalLink, Eye, EyeOff, FileText, GripVertical, LayoutTemplate, Plus, Search, Settings2, Sparkles, Trash2,
} from "lucide-react";
import { Icon } from "@/lib/icons";
import { BLOCKS, HERO_FIELDS } from "@/lib/blocks";
import type { Block, Page } from "@/lib/types";
import { FieldInput, blankValue, inputCls, setPath, slugify } from "./fields";
import { Modal } from "./modal";
import { SaveBar, Toast, useDraft } from "./ui";
import { card } from "./styles";

const RESERVED = ["admin", "api", "contact", "products", "_next"];

const normalizeSlug = (s: string) => s.split("/").map(slugify).filter(Boolean).join("/");

function newBlock(type: string): Block {
  const block: Block = { id: crypto.randomUUID(), type, visible: true };
  for (const f of BLOCKS[type].fields) block[f.key] = blankValue(f);
  return block;
}

function newPage(existing: Page[]): Page {
  let slug = "new-page";
  for (let i = 2; existing.some((p) => p.slug === slug); i++) slug = `new-page-${i}`;
  return {
    id: crypto.randomUUID(),
    slug,
    title: "New page",
    seoDescription: "",
    visible: false,
    hero: {
      eyebrow: "", title: "A headline that sells", highlight: "", subtitle: "",
      primaryLabel: "Request API Access", primaryHref: "/contact", secondaryLabel: "", secondaryHref: "",
      art: "orbit", codeTitle: "", code: "", orbitIcons: ["plane", "building", "globe", "car", "ticket", "train"], chips: [],
    },
    blocks: [newBlock("features"), newBlock("cta")],
  };
}

type Tab = "settings" | "hero" | "blocks";

export function PagesEditor({ initial }: { initial: Page[] }) {
  const { draft: pages, setDraft: setPages, dirty, pending, save, discard, toast } = useDraft("pages", initial);
  const [selected, setSelected] = useState<string | null>(pages[0]?.id ?? null);
  const [tab, setTab] = useState<Tab>("blocks");
  const [query, setQuery] = useState("");
  const [openBlock, setOpenBlock] = useState<string | null>(null);
  const [gallery, setGallery] = useState<{ after: string | null } | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);

  const page = pages.find((p) => p.id === selected) ?? null;
  const filtered = useMemo(
    () => pages.filter((p) => !query || `${p.title} ${p.slug}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => a.slug.localeCompare(b.slug)),
    [pages, query],
  );

  const updatePage = (fn: (p: Page) => Page) => page && setPages((ps) => ps.map((p) => (p.id === page.id ? fn(p) : p)));
  const setBlocks = (fn: (bs: Block[]) => Block[]) => updatePage((p) => ({ ...p, blocks: fn(p.blocks) }));

  const addPage = () => {
    const p = newPage(pages);
    setPages((ps) => [...ps, p]);
    setSelected(p.id);
    setTab("settings");
  };

  const duplicatePage = (p: Page) => {
    const copy: Page = { ...structuredClone(p), id: crypto.randomUUID(), slug: `${p.slug}-copy`, title: `${p.title} (copy)`, visible: false };
    copy.blocks = copy.blocks.map((b) => ({ ...b, id: crypto.randomUUID() }));
    setPages((ps) => [...ps, copy]);
    setSelected(copy.id);
  };

  const deletePage = (p: Page) => {
    if (!window.confirm(`Delete the page "${p.title}" (/${p.slug})? It's removed when you save.`)) return;
    setPages((ps) => ps.filter((x) => x.id !== p.id));
    setSelected(pages.find((x) => x.id !== p.id)?.id ?? null);
  };

  const insertBlock = (type: string) => {
    const b = newBlock(type);
    setBlocks((bs) => {
      const at = gallery?.after ? bs.findIndex((x) => x.id === gallery.after) + 1 : bs.length;
      return [...bs.slice(0, at), b, ...bs.slice(at)];
    });
    setOpenBlock(b.id);
    setGallery(null);
  };

  const moveBlock = (id: string, d: -1 | 1) =>
    setBlocks((bs) => {
      const i = bs.findIndex((b) => b.id === id);
      const j = i + d;
      if (j < 0 || j >= bs.length) return bs;
      const c = [...bs];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });

  const dropBlock = (target: string) => {
    if (!dragId || dragId === target) return;
    setBlocks((bs) => {
      const from = bs.findIndex((b) => b.id === dragId);
      const to = bs.findIndex((b) => b.id === target);
      const c = [...bs];
      const [m] = c.splice(from, 1);
      c.splice(to, 0, m);
      return c;
    });
    setDragId(null);
  };

  const onSave = () => {
    const value = pages.map((p) => ({ ...p, slug: normalizeSlug(p.slug) }));
    save(value, (v) => {
      const seen = new Set<string>();
      for (const p of v) {
        if (!p.slug) return `"${p.title}" needs a URL`;
        if (RESERVED.includes(p.slug.split("/")[0])) return `/${p.slug} is reserved. Pick another URL for "${p.title}".`;
        if (seen.has(p.slug)) return `Two pages use /${p.slug}`;
        seen.add(p.slug);
        const codes = [p.hero.art === "code" ? p.hero.code : "", ...p.blocks.filter((b) => b.type === "split").map((b) => String(b.code ?? ""))].filter(Boolean);
        for (const code of codes) {
          try {
            JSON.parse(code);
          } catch {
            return `"${p.title}" has invalid JSON in a code window`;
          }
        }
      }
      return null;
    });
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Page list */}
        <div className={`${card} flex max-h-[calc(100vh-200px)] flex-col overflow-hidden lg:sticky lg:top-24`}>
          <div className="flex items-center gap-2 border-b border-slate-100 p-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input className={`${inputCls} pl-8`} placeholder={`Search ${pages.length} pages`} value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <button onClick={addPage} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand text-white hover:brightness-110" aria-label="New page">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <ul className="flex-1 overflow-y-auto p-2">
            {filtered.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => setSelected(p.id)}
                  className={`mb-1 flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${p.id === selected ? "bg-brand/10 ring-1 ring-brand/30" : "hover:bg-slate-50"}`}
                >
                  <FileText className={`h-4 w-4 shrink-0 ${p.visible ? "text-brand" : "text-slate-300"}`} />
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-sm font-medium ${p.visible ? "text-slate-800" : "text-slate-400"}`}>{p.title || "Untitled"}</span>
                    <span className="block truncate font-mono text-[11px] text-slate-400">/{p.slug}</span>
                  </span>
                  {!p.visible && <span className="rounded bg-slate-100 px-1.5 text-[10px] font-semibold text-slate-500">DRAFT</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Editor */}
        {page ? (
          <div className="min-w-0">
            <div className={`${card} mb-4 flex flex-wrap items-center justify-between gap-3 px-5 py-3`}>
              <div className="min-w-0">
                <h2 className="truncate font-display text-lg font-semibold text-slate-900">{page.title || "Untitled"}</h2>
                <p className="font-mono text-xs text-slate-400">/{normalizeSlug(page.slug)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updatePage((p) => ({ ...p, visible: !p.visible }))}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium ${page.visible ? "text-emerald-700 hover:bg-emerald-50" : "text-slate-500 hover:bg-slate-100"}`}
                >
                  {page.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />} {page.visible ? "Published" : "Draft"}
                </button>
                <a href={`/${page.slug}`} target="_blank" className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" title="View saved page">
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button onClick={() => duplicatePage(page)} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" title="Duplicate page">
                  <Copy className="h-4 w-4" />
                </button>
                <button onClick={() => deletePage(page)} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600" title="Delete page">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mb-4 flex gap-1 rounded-xl bg-slate-200/60 p-1">
              {(
                [
                  ["blocks", "Blocks", LayoutTemplate, page.blocks.length],
                  ["hero", "Hero", Sparkles, null],
                  ["settings", "Page settings", Settings2, null],
                ] as const
              ).map(([key, label, I, count]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${tab === key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <I className="h-4 w-4" /> {label}
                  {count !== null && <span className="rounded-full bg-slate-100 px-1.5 text-xs">{count}</span>}
                </button>
              ))}
            </div>

            {tab === "settings" && (
              <div className={`${card} grid gap-5 p-6 sm:grid-cols-2`}>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Page title</span>
                  <input className={inputCls} value={page.title} onChange={(e) => updatePage((p) => ({ ...p, title: e.target.value }))} />
                  <span className="mt-1 block text-xs text-slate-400">Shown in the browser tab and search results.</span>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">URL</span>
                  <div className="flex items-center overflow-hidden rounded-lg border border-slate-200 focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10">
                    <span className="bg-slate-50 px-3 py-2 font-mono text-sm text-slate-400">/</span>
                    <input className="w-full px-2 py-2 font-mono text-sm outline-none" value={page.slug} onChange={(e) => updatePage((p) => ({ ...p, slug: e.target.value }))} />
                  </div>
                  <span className="mt-1 block text-xs text-slate-400">Use / for nesting, e.g. coverage/hotels</span>
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">SEO description</span>
                  <textarea className={inputCls} rows={2} value={page.seoDescription} onChange={(e) => updatePage((p) => ({ ...p, seoDescription: e.target.value }))} />
                </label>
              </div>
            )}

            {tab === "hero" && (
              <div className={`${card} grid gap-5 p-6 sm:grid-cols-2`}>
                {HERO_FIELDS.filter((f) => {
                  if (["codeTitle", "code"].includes(f.key)) return page.hero.art === "code";
                  if (f.key === "orbitIcons") return page.hero.art === "orbit";
                  return true;
                }).map((f) => (
                  <div key={f.key} className={f.wide ? "sm:col-span-2" : ""}>
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">{f.label}</span>
                    <FieldInput field={f} value={page.hero[f.key as keyof Page["hero"]]} onChange={(v) => updatePage((p) => ({ ...p, hero: setPath(p.hero, f.key, v) }))} />
                  </div>
                ))}
              </div>
            )}

            {tab === "blocks" && (
              <div className="space-y-3">
                {page.blocks.map((b, i) => {
                  const def = BLOCKS[b.type];
                  const isOpen = openBlock === b.id;
                  const preview = String(b.title || b.eyebrow || (Array.isArray(b.items) ? `${b.items.length} items` : "") || "");
                  return (
                    <div
                      key={b.id}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => dropBlock(b.id)}
                      className={`${card} overflow-hidden transition ${dragId === b.id ? "opacity-40" : ""} ${b.visible ? "" : "opacity-60"}`}
                    >
                      <div className="flex items-center gap-2 px-3 py-2.5">
                        <span draggable onDragStart={() => setDragId(b.id)} onDragEnd={() => setDragId(null)} className="cursor-grab p-1 text-slate-300 hover:text-slate-500">
                          <GripVertical className="h-4 w-4" />
                        </span>
                        <button onClick={() => setOpenBlock(isOpen ? null : b.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                            <Icon name={def?.icon ?? "sparkles"} className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-slate-800">
                              <span className="mr-1.5 text-slate-400">{i + 1}.</span>
                              {def?.label ?? b.type}
                            </span>
                            {preview && <span className="block truncate text-xs text-slate-400">{preview}</span>}
                          </span>
                          <ChevronDown className={`ml-auto h-4 w-4 shrink-0 text-slate-400 transition ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                        <div className="flex shrink-0 items-center">
                          <IconBtn title="Move up" onClick={() => moveBlock(b.id, -1)}><ArrowUp className="h-4 w-4" /></IconBtn>
                          <IconBtn title="Move down" onClick={() => moveBlock(b.id, 1)}><ArrowDown className="h-4 w-4" /></IconBtn>
                          <IconBtn title={b.visible ? "Hide" : "Show"} onClick={() => setBlocks((bs) => bs.map((x) => (x.id === b.id ? { ...x, visible: !x.visible } : x)))}>
                            {b.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </IconBtn>
                          <IconBtn title="Duplicate" onClick={() => setBlocks((bs) => { const at = bs.findIndex((x) => x.id === b.id); return [...bs.slice(0, at + 1), { ...structuredClone(b), id: crypto.randomUUID() }, ...bs.slice(at + 1)]; })}>
                            <Copy className="h-4 w-4" />
                          </IconBtn>
                          <IconBtn title="Insert block below" onClick={() => setGallery({ after: b.id })}><Plus className="h-4 w-4" /></IconBtn>
                          <IconBtn title="Delete" danger onClick={() => window.confirm(`Remove this ${def?.label ?? "block"}?`) && setBlocks((bs) => bs.filter((x) => x.id !== b.id))}>
                            <Trash2 className="h-4 w-4" />
                          </IconBtn>
                        </div>
                      </div>
                      {isOpen && def && (
                        <div className="grid gap-4 border-t border-slate-100 bg-slate-50/40 p-5 sm:grid-cols-2">
                          {def.fields.length === 0 && <p className="text-sm text-slate-500">This block has no settings.</p>}
                          {def.description && <p className="text-xs text-slate-500 sm:col-span-2">{def.description}</p>}
                          {def.fields.map((f) => (
                            <div key={f.key} className={f.wide || f.type === "textarea" || f.type === "lines" || f.type === "code" || f.type === "repeater" ? "sm:col-span-2" : ""}>
                              <span className="mb-1.5 block text-sm font-medium text-slate-700">{f.label}</span>
                              <FieldInput field={f} value={b[f.key]} onChange={(v) => setBlocks((bs) => bs.map((x) => (x.id === b.id ? { ...x, [f.key]: v } : x)))} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                <button
                  onClick={() => setGallery({ after: null })}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 py-5 text-sm font-semibold text-slate-500 transition hover:border-brand hover:bg-brand/5 hover:text-brand"
                >
                  <Plus className="h-5 w-5" /> Add block
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={`${card} grid place-items-center p-16 text-center`}>
            <div>
              <p className="text-sm text-slate-500">No page selected.</p>
              <button onClick={addPage} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">
                <Plus className="h-4 w-4" /> Create a page
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal open={gallery !== null} onClose={() => setGallery(null)} title="Add a block" width="max-w-3xl">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(BLOCKS).map(([type, def]) => (
            <button
              key={type}
              onClick={() => insertBlock(type)}
              className="group flex flex-col items-start rounded-xl border border-slate-200 p-4 text-left transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
                <Icon name={def.icon} className="h-5 w-5" />
              </span>
              <span className="mt-3 text-sm font-semibold text-slate-900">{def.label}</span>
              <span className="mt-1 text-xs text-slate-500">{def.description}</span>
            </button>
          ))}
        </div>
      </Modal>

      <SaveBar dirty={dirty} pending={pending} onSave={onSave} onDiscard={discard} />
      <Toast result={toast} />
    </>
  );
}

function IconBtn({ children, onClick, title, danger }: { children: React.ReactNode; onClick: () => void; title: string; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition ${danger ? "hover:bg-rose-50 hover:text-rose-600" : "hover:bg-slate-100 hover:text-slate-700"}`}
    >
      {children}
    </button>
  );
}
