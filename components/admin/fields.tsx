"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Plus, Star, Trash2 } from "lucide-react";
import { Icon, ICON_NAMES, TONES, TONE_NAMES } from "@/lib/icons";
import type { Field } from "@/lib/admin-schema";

export const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-brand/10";

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export function getPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), obj);
}

export function setPath<T>(obj: T, path: string, value: unknown): T {
  const [head, ...rest] = path.split(".");
  const src = (obj ?? {}) as Record<string, unknown>;
  return { ...src, [head]: rest.length ? setPath(src[head], rest.join("."), value) : value } as T;
}

/** Empty value for a field, used when adding items. */
export function blankValue(f: Field): unknown {
  switch (f.type) {
    case "boolean": return true;
    case "number": return 0;
    case "rating": return 5;
    case "lines": case "repeater": return [];
    case "icon": return "sparkles";
    case "tone": return "brand";
    case "code": return "{}";
    case "select": return f.options?.[0]?.value ?? "";
    default: return "";
  }
}

export function blankItem(fields: Field[]): Record<string, unknown> {
  const item: Record<string, unknown> = { id: crypto.randomUUID() };
  for (const f of fields) item[f.key] = blankValue(f);
  return item;
}

export function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  switch (field.type) {
    case "textarea":
      return <textarea className={inputCls} rows={3} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
    case "code":
      return <CodeInput value={String(value ?? "")} onChange={onChange} />;
    case "lines":
      return (
        <textarea
          className={inputCls}
          rows={Math.min(8, Math.max(3, ((value as string[]) ?? []).length + 1))}
          value={((value as string[]) ?? []).join("\n")}
          onChange={(e) => onChange(e.target.value.split("\n"))}
          onBlur={(e) => onChange(e.target.value.split("\n").map((l) => l.trim()).filter(Boolean))}
        />
      );
    case "number":
      return <input type="number" className={inputCls} value={Number(value ?? 0)} onChange={(e) => onChange(Number(e.target.value))} />;
    case "boolean":
      return (
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${value ? "bg-brand" : "bg-slate-300"}`}
          role="switch"
          aria-checked={Boolean(value)}
        >
          <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${value ? "translate-x-5" : "translate-x-0.5"}`} />
        </button>
      );
    case "rating":
      return (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} stars`}>
              <Star className={`h-6 w-6 ${n <= Number(value) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
            </button>
          ))}
        </div>
      );
    case "icon":
      return <IconPicker value={String(value ?? "")} onChange={onChange} />;
    case "tone":
      return (
        <div className="flex flex-wrap gap-2">
          {TONE_NAMES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              className={`grid h-9 w-9 place-items-center rounded-lg border-2 transition ${TONES[t].bg} ${TONES[t].text} ${
                value === t ? "border-slate-900" : "border-transparent"
              }`}
              title={t}
            >
              <span className="h-3 w-3 rounded-full bg-current" />
            </button>
          ))}
        </div>
      );
    case "select":
      return (
        <select className={inputCls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      );
    case "repeater":
      return <Repeater field={field} value={(value as Record<string, unknown>[]) ?? []} onChange={onChange} />;
    default:
      return <input className={inputCls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
  }
}

function CodeInput({ value, onChange }: { value: string; onChange: (v: unknown) => void }) {
  let error = "";
  try {
    JSON.parse(value);
  } catch (e) {
    error = (e as Error).message;
  }
  return (
    <div>
      <textarea
        className={`${inputCls} bg-slate-950 font-mono text-xs leading-relaxed text-emerald-200 focus:border-brand`}
        rows={8}
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="mt-1 flex justify-between text-xs">
        <span className={error ? "text-rose-600" : "text-emerald-600"}>{error ? `Invalid JSON: ${error}` : "Valid JSON"}</span>
        {!error && (
          <button type="button" className="font-medium text-brand" onClick={() => onChange(JSON.stringify(JSON.parse(value), null, 2))}>
            Format
          </button>
        )}
      </div>
    </div>
  );
}

function IconPicker({ value, onChange }: { value: string; onChange: (v: unknown) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} className={`${inputCls} flex items-center gap-2 text-left`}>
        <Icon name={value} className="h-4 w-4 text-brand" />
        <span>{value || "Choose icon"}</span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 grid w-72 grid-cols-6 gap-1 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          {ICON_NAMES.map((n) => (
            <button
              key={n}
              type="button"
              title={n}
              onClick={() => {
                onChange(n);
                setOpen(false);
              }}
              className={`grid h-10 place-items-center rounded-lg transition hover:bg-slate-100 ${n === value ? "bg-brand/10 text-brand" : "text-slate-600"}`}
            >
              <Icon name={n} className="h-5 w-5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Repeater({ field, value, onChange }: { field: Field; value: Record<string, unknown>[]; onChange: (v: unknown) => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const fields = field.fields ?? [];
  const set = (i: number, key: string, v: unknown) => onChange(value.map((it, j) => (j === i ? { ...it, [key]: v } : it)));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const copy = [...value];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    onChange(copy);
    setOpen(j);
  };

  return (
    <div className="space-y-2">
      {value.map((item, i) => {
        const label = String(item[field.itemLabel ?? fields[0]?.key ?? ""] || `Item ${i + 1}`);
        const isOpen = open === i;
        return (
          <div key={String(item.id ?? i)} className="rounded-xl border border-slate-200 bg-slate-50/60">
            <div className="flex items-center gap-1 px-3 py-2">
              <button type="button" onClick={() => setOpen(isOpen ? null : i)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition ${isOpen ? "" : "-rotate-90"}`} />
                {typeof item.icon === "string" && <Icon name={item.icon} className="h-4 w-4 shrink-0 text-brand" />}
                <span className="truncate text-sm font-medium text-slate-700">{label}</span>
              </button>
              <button type="button" onClick={() => move(i, -1)} className="grid h-7 w-7 place-items-center rounded-md text-slate-400 hover:bg-white" aria-label="Move up"><ArrowUp className="h-3.5 w-3.5" /></button>
              <button type="button" onClick={() => move(i, 1)} className="grid h-7 w-7 place-items-center rounded-md text-slate-400 hover:bg-white" aria-label="Move down"><ArrowDown className="h-3.5 w-3.5" /></button>
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="grid h-7 w-7 place-items-center rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label="Remove"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
            {isOpen && (
              <div className="grid gap-3 border-t border-slate-200 bg-white p-3 sm:grid-cols-2">
                {fields.map((f) => (
                  <div key={f.key} className={f.wide || f.type === "textarea" || f.type === "lines" || f.type === "code" ? "sm:col-span-2" : ""}>
                    <span className="mb-1 block text-xs font-medium text-slate-600">{f.label}</span>
                    <FieldInput field={f} value={item[f.key]} onChange={(v) => set(i, f.key, v)} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => { onChange([...value, blankItem(fields)]); setOpen(value.length); }}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 py-2 text-sm font-medium text-slate-500 hover:border-brand/40 hover:text-brand"
      >
        <Plus className="h-4 w-4" /> Add item
      </button>
    </div>
  );
}
