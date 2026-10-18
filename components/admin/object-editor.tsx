"use client";

import type { Content, ContentKey } from "@/lib/types";
import type { Field } from "@/lib/admin-schema";
import { FieldInput, getPath, setPath } from "./fields";
import { SaveBar, Toast, card, useDraft } from "./ui";

export function ObjectEditor<K extends ContentKey>({
  sectionKey,
  initial,
  fields,
}: {
  sectionKey: K;
  initial: Content[K];
  fields: Field[];
}) {
  const { draft, setDraft, dirty, pending, save, discard, toast } = useDraft(sectionKey, initial);

  return (
    <>
      <div className={`${card} grid gap-5 p-6 sm:grid-cols-2`}>
        {fields.map((f) => (
          <div key={f.key} className={f.wide || f.type === "textarea" || f.type === "lines" ? "sm:col-span-2" : ""}>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">{f.label}</span>
            <FieldInput field={f} value={getPath(draft, f.key)} onChange={(v) => setDraft((d) => setPath(d, f.key, v))} />
            {f.help && <span className="mt-1 block text-xs text-slate-400">{f.help}</span>}
          </div>
        ))}
      </div>
      <SaveBar dirty={dirty} pending={pending} onSave={() => save()} onDiscard={discard} />
      <Toast result={toast} />
    </>
  );
}
