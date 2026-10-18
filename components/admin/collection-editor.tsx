"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, GripVertical, Plus, Search, Trash2 } from "lucide-react";
import { Icon } from "@/lib/icons";
import type { Content, ContentKey } from "@/lib/types";
import type { Field } from "@/lib/admin-schema";
import { FieldInput, blankItem, getPath, inputCls, setPath, slugify } from "./fields";
import { SaveBar, Toast, card, useDraft } from "./ui";

type Item = { id: string; visible?: boolean } & Record<string, unknown>;

export function CollectionEditor<K extends ContentKey>({
  sectionKey,
  initial,
  fields,
  titleKey,
  subtitleKey,
  iconKey,
}: {
  sectionKey: K;
  initial: Content[K];
  fields: Field[];
  titleKey: string;
  subtitleKey?: string;
  iconKey?: string;
}) {
  const { draft, setDraft, dirty, pending, save, discard, toast } = useDraft(sectionKey, initial);
  const items = draft as unknown as Item[];
  const setItems = (fn: (xs: Item[]) => Item[]) => setDraft((d) => fn(d as unknown as Item[]) as unknown as Content[K]);

  const [selected, setSelected] = useState<string | null>(items[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);

  const current = items.find((i) => i.id === selected) ?? null;
  const filtered = useMemo(
    () => items.filter((i) => !query || JSON.stringify(i).toLowerCase().includes(query.toLowerCase())),
    [items, query],
  );

  const update = (id: string, key: string, value: unknown) => setItems((xs) => xs.map((x) => (x.id === id ? setPath(x, key, value) : x)));

  const move = (id: string, dir: -1 | 1) =>
    setItems((xs) => {
      const i = xs.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= xs.length) return xs;
      const copy = [...xs];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  const dropOn = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    setItems((xs) => {
      const from = xs.findIndex((x) => x.id === dragId);
      const to = xs.findIndex((x) => x.id === targetId);
      const copy = [...xs];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
    setDragId(null);
  };

  const add = () => {
    const item = blankItem(fields) as Item;
    setItems((xs) => [...xs, item]);
    setSelected(item.id);
  };

  const duplicate = (item: Item) => {
    const copy: Item = { ...structuredClone(item), id: crypto.randomUUID() };
    if (typeof copy[titleKey] === "string") copy[titleKey] = `${copy[titleKey]} (copy)`;
    if ("slug" in copy) copy.slug = "";
    setItems((xs) => {
      const i = xs.findIndex((x) => x.id === item.id);
      return [...xs.slice(0, i + 1), copy, ...xs.slice(i + 1)];
    });
    setSelected(copy.id);
  };

  const remove = (item: Item) => {
    if (!window.confirm(`Delete "${String(item[titleKey] || "this item")}"? It will be removed after you save.`)) return;
    const idx = items.findIndex((x) => x.id === item.id);
    setItems((xs) => xs.filter((x) => x.id !== item.id));
    setSelected(items[idx + 1]?.id ?? items[idx - 1]?.id ?? null);
  };

  const onSave = () => {
    const slugField = fields.find((f) => f.type === "slug");
    let value = items;
    if (slugField) {
      value = items.map((x) =>
        x[slugField.key] ? { ...x, [slugField.key]: slugify(String(x[slugField.key])) } : { ...x, [slugField.key]: slugify(String(x[slugField.from ?? titleKey] ?? "")) },
      );
    }
    save(value as unknown as Content[K], () => {
      if (slugField) {
        const slugs = value.map((x) => String(x[slugField.key]));
        if (slugs.some((s) => !s)) return "Every item needs a name or slug";
        const dup = slugs.find((s, i) => slugs.indexOf(s) !== i);
        if (dup) return `Duplicate slug "${dup}"`;
      }
      for (const f of fields.filter((f) => f.type === "code")) {
        for (const x of value) {
          try {
            JSON.parse(String(x[f.key]));
          } catch {
            return `"${String(x[titleKey])}" has invalid JSON in ${f.label}`;
          }
        }
      }
      return null;
    });
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* List */}
        <div className={`${card} flex max-h-[calc(100vh-220px)] flex-col overflow-hidden lg:sticky lg:top-24`}>
          <div className="flex items-center gap-2 border-b border-slate-100 p-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input className={`${inputCls} pl-8`} placeholder={`Search ${items.length} items`} value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <button onClick={add} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand text-white hover:brightness-110" aria-label="Add item">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <ul className="flex-1 overflow-y-auto p-2">
            {filtered.map((item) => {
              const active = item.id === selected;
              return (
                <li
                  key={item.id}
                  draggable={!query}
                  onDragStart={() => setDragId(item.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => dropOn(item.id)}
                  onDragEnd={() => setDragId(null)}
                  className={`group mb-1 flex items-center gap-2 rounded-xl px-2 py-2 transition ${
                    active ? "bg-brand/10 ring-1 ring-brand/30" : "hover:bg-slate-50"
                  } ${dragId === item.id ? "opacity-40" : ""}`}
                >
                  <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-slate-300" />
                  <button onClick={() => setSelected(item.id)} className="flex min-w-0 flex-1 items-center gap-2.5 text-left">
                    {iconKey && (
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-600">
                        <Icon name={String(item[iconKey])} className="h-4 w-4" />
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className={`block truncate text-sm font-medium ${item.visible === false ? "text-slate-400 line-through" : "text-slate-800"}`}>
                        {String(item[titleKey] || "Untitled")}
                      </span>
                      {subtitleKey && <span className="block truncate text-xs text-slate-400">{String(item[subtitleKey] ?? "")}</span>}
                    </span>
                  </button>
                  {"visible" in item && (
                    <button
                      onClick={() => update(item.id, "visible", !item.visible)}
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-slate-400 hover:bg-white hover:text-slate-700"
                      title={item.visible ? "Hide" : "Show"}
                    >
                      {item.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  )}
                </li>
              );
            })}
            {!filtered.length && <li className="p-6 text-center text-sm text-slate-400">No items</li>}
          </ul>
        </div>

        {/* Form */}
        <div>
          {current ? (
            <div className={card}>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-6 py-4">
                <h2 className="truncate font-display font-semibold text-slate-900">{String(current[titleKey] || "Untitled")}</h2>
                <div className="flex gap-1">
                  <IconBtn onClick={() => move(current.id, -1)} title="Move up"><ArrowUp className="h-4 w-4" /></IconBtn>
                  <IconBtn onClick={() => move(current.id, 1)} title="Move down"><ArrowDown className="h-4 w-4" /></IconBtn>
                  <IconBtn onClick={() => duplicate(current)} title="Duplicate"><Copy className="h-4 w-4" /></IconBtn>
                  <IconBtn onClick={() => remove(current)} title="Delete" danger><Trash2 className="h-4 w-4" /></IconBtn>
                </div>
              </div>
              <div className="grid gap-5 p-6 sm:grid-cols-2">
                {fields.map((f) => (
                  <div key={f.key} className={f.wide ? "sm:col-span-2" : ""}>
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">{f.label}</span>
                    <FieldInput field={f} value={getPath(current, f.key)} onChange={(v) => update(current.id, f.key, v)} />
                    {f.help && <span className="mt-1 block text-xs text-slate-400">{f.help}</span>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={`${card} grid place-items-center p-16 text-center`}>
              <div>
                <p className="text-sm text-slate-500">Nothing selected.</p>
                <button onClick={add} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">
                  <Plus className="h-4 w-4" /> Add the first item
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
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
      className={`grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition ${danger ? "hover:bg-rose-50 hover:text-rose-600" : "hover:bg-slate-100 hover:text-slate-800"}`}
    >
      {children}
    </button>
  );
}
