"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, GripVertical } from "lucide-react";
import type { SectionConfig } from "@/lib/types";
import { FieldInput } from "./fields";
import { SaveBar, Toast, card, useDraft } from "./ui";

export function SectionsEditor({ initial }: { initial: SectionConfig[] }) {
  const { draft, setDraft, dirty, pending, save, discard, toast } = useDraft("sections", initial);
  const [dragId, setDragId] = useState<string | null>(null);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= draft.length || from === to) return;
    const copy = [...draft];
    const [m] = copy.splice(from, 1);
    copy.splice(to, 0, m);
    setDraft(copy);
  };

  return (
    <>
      <div className={`${card} divide-y divide-slate-100`}>
        {draft.map((s, i) => (
          <div
            key={s.id}
            draggable
            onDragStart={() => setDragId(s.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragId) move(draft.findIndex((x) => x.id === dragId), i);
              setDragId(null);
            }}
            onDragEnd={() => setDragId(null)}
            className={`flex items-center gap-4 px-5 py-3.5 transition ${dragId === s.id ? "opacity-40" : ""} ${s.visible ? "" : "bg-slate-50"}`}
          >
            <GripVertical className="h-5 w-5 cursor-grab text-slate-300" />
            <span className="grid h-7 w-7 place-items-center rounded-md bg-slate-100 text-xs font-bold text-slate-500">{i + 1}</span>
            <span className={`flex-1 text-sm font-medium ${s.visible ? "text-slate-800" : "text-slate-400"}`}>{s.label}</span>
            <div className="flex gap-1">
              <button onClick={() => move(i, i - 1)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100" aria-label="Move up">
                <ArrowUp className="h-4 w-4" />
              </button>
              <button onClick={() => move(i, i + 1)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100" aria-label="Move down">
                <ArrowDown className="h-4 w-4" />
              </button>
            </div>
            <FieldInput
              field={{ key: "visible", label: "Visible", type: "boolean" }}
              value={s.visible}
              onChange={(v) => setDraft(draft.map((x) => (x.id === s.id ? { ...x, visible: Boolean(v) } : x)))}
            />
          </div>
        ))}
      </div>
      <SaveBar dirty={dirty} pending={pending} onSave={() => save()} onDiscard={discard} />
      <Toast result={toast} />
    </>
  );
}
