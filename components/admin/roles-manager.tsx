"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Crown, Loader2, Lock, Plus, Save, Trash2, Users, Minus } from "lucide-react";
import { deleteRole, saveRole } from "@/app/actions/roles";
import { PERMISSIONS, PERMISSION_GROUPS, ROLE_BADGE, ROLE_COLORS, type RoleColor } from "@/lib/permissions";
import type { Role } from "@/lib/types";
import { inputCls } from "./fields";
import { Toast, useToast } from "./ui";
import { card } from "./styles";

type Draft = { name: string; description: string; color: string; permissions: string[] };
const DOT: Record<RoleColor, string> = {
  violet: "bg-violet-500", sky: "bg-sky-500", emerald: "bg-emerald-500", amber: "bg-amber-500",
  rose: "bg-rose-500", indigo: "bg-indigo-500", slate: "bg-slate-500",
};

const toDraft = (r?: Role): Draft =>
  r ? { name: r.name, description: r.description, color: r.color, permissions: [...r.permissions] } : { name: "", description: "", color: "indigo", permissions: [] };

export function RolesManager({ roles, members }: { roles: Role[]; members: Record<string, number> }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [toast, setToast] = useToast();
  const [selected, setSelected] = useState<string | "new" | "owner">(roles[0]?.id ?? "new");
  const current = roles.find((r) => r.id === selected);
  const [draft, setDraft] = useState<Draft>(toDraft(current));
  const dirty = selected !== "owner" && JSON.stringify(draft) !== JSON.stringify(toDraft(current));

  const select = (id: string) => {
    if (dirty && !window.confirm("Discard unsaved changes to this role?")) return;
    setSelected(id);
    setDraft(toDraft(roles.find((r) => r.id === id)));
  };

  const toggle = (key: string) =>
    setDraft((d) => ({ ...d, permissions: d.permissions.includes(key) ? d.permissions.filter((p) => p !== key) : [...d.permissions, key] }));

  const toggleGroup = (group: string, on: boolean) => {
    const keys = PERMISSIONS.filter((p) => p.group === group).map((p) => p.key as string);
    setDraft((d) => ({ ...d, permissions: on ? [...new Set([...d.permissions, ...keys])] : d.permissions.filter((p) => !keys.includes(p)) }));
  };

  const save = () =>
    start(async () => {
      const r = await saveRole(selected === "new" ? null : selected, draft);
      setToast(r);
      if (r.ok && r.id) {
        setSelected(r.id);
        router.refresh();
      }
    });

  const remove = () => {
    if (!current || !window.confirm(`Delete the "${current.name}" role?`)) return;
    start(async () => {
      const r = await deleteRole(current.id);
      setToast(r);
      if (r.ok) {
        const next = roles.find((x) => x.id !== current.id);
        setSelected(next?.id ?? "new");
        setDraft(toDraft(next));
        router.refresh();
      }
    });
  };

  const readOnly = selected === "owner";
  const perms = readOnly ? PERMISSIONS.map((p) => p.key as string) : draft.permissions;

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Role list */}
        <div className={`${card} self-start p-2`}>
          <button
            onClick={() => select("owner")}
            className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${selected === "owner" ? "bg-amber-50 ring-1 ring-amber-200" : "hover:bg-slate-50"}`}
          >
            <Crown className="h-4 w-4 text-amber-600" />
            <span className="flex-1">
              <span className="block text-sm font-semibold text-slate-900">Owner</span>
              <span className="block text-xs text-slate-400">All permissions · from .env</span>
            </span>
            <Lock className="h-3.5 w-3.5 text-slate-300" />
          </button>
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => select(r.id)}
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${selected === r.id ? "bg-brand/10 ring-1 ring-brand/30" : "hover:bg-slate-50"}`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${DOT[r.color as RoleColor] ?? DOT.slate}`} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-slate-900">{r.name}</span>
                <span className="block text-xs text-slate-400">
                  {r.permissions.length} permissions · {members[r.id] ?? 0} {members[r.id] === 1 ? "user" : "users"}
                </span>
              </span>
            </button>
          ))}
          <button
            onClick={() => select("new")}
            className={`mt-1 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed px-3 py-2.5 text-sm font-semibold transition ${selected === "new" ? "border-brand text-brand" : "border-slate-200 text-slate-500 hover:border-brand/40 hover:text-brand"}`}
          >
            <Plus className="h-4 w-4" /> New role
          </button>
        </div>

        {/* Editor */}
        <div className={card}>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-900">
                {readOnly ? "Owner" : selected === "new" ? "New role" : current?.name}
              </h2>
              <p className="text-xs text-slate-400">
                {readOnly ? "The owner always has every permission and can't be edited." : `${perms.length} of ${PERMISSIONS.length} permissions enabled`}
              </p>
            </div>
            {!readOnly && (
              <div className="flex items-center gap-2">
                {current && (
                  <button onClick={remove} disabled={pending} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50">
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                )}
                <button
                  onClick={save}
                  disabled={pending || (!dirty && selected !== "new")}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow hover:brightness-110 disabled:opacity-50"
                >
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {selected === "new" ? "Create role" : "Save role"}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6 p-6">
            {!readOnly && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Role name</span>
                  <input className={inputCls} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Content Writer" />
                </label>
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Badge color</span>
                  <div className="flex gap-2">
                    {ROLE_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setDraft({ ...draft, color: c })}
                        className={`grid h-9 w-9 place-items-center rounded-lg ring-1 ${ROLE_BADGE[c]} ${draft.color === c ? "ring-2 ring-slate-900" : ""}`}
                        title={c}
                      >
                        {draft.color === c && <Check className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Description</span>
                  <input className={inputCls} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="What this role is for" />
                </label>
              </div>
            )}

            {PERMISSION_GROUPS.map((group) => {
              const items = PERMISSIONS.filter((p) => p.group === group);
              const on = items.filter((p) => perms.includes(p.key)).length;
              return (
                <div key={group} className="overflow-hidden rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between bg-slate-50 px-4 py-2.5">
                    <span className="text-sm font-semibold text-slate-700">
                      {group} <span className="font-normal text-slate-400">· {on}/{items.length}</span>
                    </span>
                    {!readOnly && (
                      <button type="button" onClick={() => toggleGroup(group, on < items.length)} className="text-xs font-semibold text-brand">
                        {on < items.length ? "Select all" : "Clear all"}
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-slate-100">
                    {items.map((p) => {
                      const checked = perms.includes(p.key);
                      return (
                        <label key={p.key} className={`flex items-start gap-3 px-4 py-3 ${readOnly ? "" : "cursor-pointer hover:bg-slate-50/60"}`}>
                          <input type="checkbox" className="peer sr-only" checked={checked} disabled={readOnly} onChange={() => toggle(p.key)} />
                          <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition peer-focus-visible:ring-4 peer-focus-visible:ring-brand/20 ${checked ? "border-brand bg-brand text-white" : "border-slate-300 bg-white"}`}>
                            {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                          </span>
                          <span>
                            <span className="block text-sm font-medium text-slate-800">{p.label}</span>
                            <span className="block text-xs text-slate-500">{p.description}</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Matrix overview */}
      <div className={`${card} mt-6 overflow-x-auto`}>
        <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-4">
          <Users className="h-4 w-4 text-slate-400" />
          <h2 className="font-display font-semibold text-slate-900">Permission matrix</h2>
        </div>
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Permission</th>
              <th className="px-3 py-3 text-center"><span className={`rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ${ROLE_BADGE.owner}`}>Owner</span></th>
              {roles.map((r) => (
                <th key={r.id} className="px-3 py-3 text-center">
                  <button onClick={() => select(r.id)} className={`rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ${ROLE_BADGE[r.color as RoleColor] ?? ROLE_BADGE.slate}`}>{r.name}</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {PERMISSIONS.map((p) => (
              <tr key={p.key}>
                <td className="px-6 py-2.5 text-slate-700">{p.label}</td>
                <td className="px-3 py-2.5 text-center"><Check className="mx-auto h-4 w-4 text-amber-500" /></td>
                {roles.map((r) => (
                  <td key={r.id} className="px-3 py-2.5 text-center">
                    {r.permissions.includes(p.key) ? <Check className="mx-auto h-4 w-4 text-emerald-500" /> : <Minus className="mx-auto h-4 w-4 text-slate-200" />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Toast result={toast} />
    </>
  );
}
