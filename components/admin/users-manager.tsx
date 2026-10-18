"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, KeyRound, Loader2, MoreHorizontal, Pencil, Plus, Power, Search, Trash2, Wand2, Crown } from "lucide-react";
import { createUser, deleteUser, resetUserPassword, updateUser } from "@/app/actions/users";
import { ROLE_BADGE, type RoleColor } from "@/lib/permissions";
import type { PublicUser, Role } from "@/lib/types";
import { FieldInput, inputCls } from "./fields";
import { Modal, generatePassword } from "./modal";
import { Toast, useToast } from "./ui";
import { card } from "./styles";

type Draft = { name: string; email: string; roleId: string; password: string; active: boolean };

function RoleBadge({ name, color }: { name: string; color: string }) {
  return <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ${ROLE_BADGE[color as RoleColor] ?? ROLE_BADGE.slate}`}>{name}</span>;
}

function PasswordField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex gap-2">
      <input className={`${inputCls} font-mono`} value={value} onChange={(e) => onChange(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" />
      <button type="button" onClick={() => onChange(generatePassword())} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50" title="Generate strong password">
        <Wand2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        disabled={!value}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {}
        }}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        title="Copy"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function UsersManager({
  users,
  roles,
  owner,
  meId,
}: {
  users: PublicUser[];
  roles: Role[];
  owner: { name: string; email: string };
  meId: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [toast, setToast] = useToast();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editing, setEditing] = useState<PublicUser | "new" | null>(null);
  const [resetting, setResetting] = useState<PublicUser | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>({ name: "", email: "", roleId: roles[0]?.id ?? "", password: "", active: true });
  const [newPassword, setNewPassword] = useState("");

  const roleById = useMemo(() => new Map(roles.map((r) => [r.id, r])), [roles]);
  const list = users.filter(
    (u) => (roleFilter === "all" || u.roleId === roleFilter) && (!query || `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase())),
  );

  const openNew = () => {
    setDraft({ name: "", email: "", roleId: roles[0]?.id ?? "", password: generatePassword(), active: true });
    setEditing("new");
  };
  const openEdit = (u: PublicUser) => {
    setDraft({ name: u.name, email: u.email, roleId: u.roleId, password: "", active: u.active });
    setEditing(u);
    setMenu(null);
  };

  const run = (fn: () => Promise<{ ok: boolean; message: string }>, after?: () => void) =>
    start(async () => {
      const r = await fn();
      setToast(r);
      if (r.ok) {
        after?.();
        router.refresh();
      }
    });

  const submit = () =>
    run(
      () => (editing === "new" ? createUser(draft) : updateUser((editing as PublicUser).id, { name: draft.name, email: draft.email, roleId: draft.roleId, active: draft.active })),
      () => setEditing(null),
    );

  const selectedRole = roleById.get(draft.roleId);

  return (
    <>
      <div className={card}>
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          <div className="relative min-w-48 flex-1">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className={`${inputCls} pl-8`} placeholder="Search users" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <select className={`${inputCls.replace("w-full", "")} w-44 shrink-0`} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="all">All roles</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <button onClick={openNew} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow hover:brightness-110">
            <Plus className="h-4 w-4" /> Add user
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Last sign-in</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className={`divide-y divide-slate-100 ${pending ? "opacity-60" : ""}`}>
              <tr className="bg-amber-50/40">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-amber-100 text-amber-700"><Crown className="h-4 w-4" /></span>
                    <span>
                      <span className="block font-semibold text-slate-900">{owner.name}{meId === "owner" && <span className="ml-1.5 text-xs font-normal text-slate-400">(you)</span>}</span>
                      <span className="block text-xs text-slate-400">{owner.email}</span>
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5"><RoleBadge name="Owner" color="owner" /></td>
                <td className="px-5 py-3.5"><span className="text-xs font-medium text-emerald-600">● Active</span></td>
                <td className="px-5 py-3.5 text-xs text-slate-400" colSpan={2}>Managed in .env (ADMIN_EMAIL / ADMIN_PASSWORD)</td>
              </tr>
              {list.map((u) => {
                const role = roleById.get(u.roleId);
                return (
                  <tr key={u.id} className={u.active ? "" : "bg-slate-50/70"}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${u.active ? "bg-brand/10 text-brand" : "bg-slate-200 text-slate-400"}`}>{u.name[0]?.toUpperCase()}</span>
                        <span>
                          <span className={`block font-semibold ${u.active ? "text-slate-900" : "text-slate-400"}`}>
                            {u.name}{u.id === meId && <span className="ml-1.5 text-xs font-normal text-slate-400">(you)</span>}
                          </span>
                          <span className="block text-xs text-slate-400">{u.email}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">{role ? <RoleBadge name={role.name} color={role.color} /> : <span className="text-xs text-rose-500">Role deleted</span>}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium ${u.active ? "text-emerald-600" : "text-slate-400"}`}>● {u.active ? "Active" : "Inactive"}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}</td>
                    <td className="relative px-5 py-3.5 text-right">
                      <button onClick={() => setMenu(menu === u.id ? null : u.id)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Actions">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {menu === u.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenu(null)} />
                          <div className="absolute right-5 top-12 z-20 w-48 rounded-xl border border-slate-200 bg-white p-1 text-left shadow-xl">
                            <MenuItem icon={<Pencil className="h-4 w-4" />} onClick={() => openEdit(u)}>Edit details & role</MenuItem>
                            <MenuItem icon={<KeyRound className="h-4 w-4" />} onClick={() => { setNewPassword(generatePassword()); setResetting(u); setMenu(null); }}>Reset password</MenuItem>
                            {u.id !== meId && (
                              <MenuItem
                                icon={<Power className="h-4 w-4" />}
                                onClick={() => { setMenu(null); run(() => updateUser(u.id, { name: u.name, email: u.email, roleId: u.roleId, active: !u.active })); }}
                              >
                                {u.active ? "Deactivate" : "Activate"}
                              </MenuItem>
                            )}
                            {u.id !== meId && (
                              <MenuItem
                                danger
                                icon={<Trash2 className="h-4 w-4" />}
                                onClick={() => { setMenu(null); if (window.confirm(`Delete ${u.name}? This can't be undone.`)) run(() => deleteUser(u.id)); }}
                              >
                                Delete user
                              </MenuItem>
                            )}
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!list.length && users.length > 0 && <p className="p-10 text-center text-sm text-slate-400">No users match your filters</p>}
          {!users.length && (
            <div className="p-12 text-center">
              <p className="text-sm text-slate-500">No team members yet. Add someone and give them a role.</p>
              <button onClick={openNew} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">
                <Plus className="h-4 w-4" /> Add the first user
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal open={editing !== null} onClose={() => setEditing(null)} title={editing === "new" ? "Add user" : "Edit user"}>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Full name</span>
            <input className={inputCls} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} autoFocus />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Email (used to sign in)</span>
            <input type="email" className={inputCls} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
          </label>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Role</span>
            <div className="grid gap-2">
              {roles.map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setDraft({ ...draft, roleId: r.id })}
                  className={`flex items-start gap-3 rounded-xl border-2 p-3 text-left transition ${draft.roleId === r.id ? "border-brand bg-brand/5" : "border-slate-200 hover:border-slate-300"}`}
                >
                  <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 ${draft.roleId === r.id ? "border-brand" : "border-slate-300"}`}>
                    {draft.roleId === r.id && <span className="h-2 w-2 rounded-full bg-brand" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <RoleBadge name={r.name} color={r.color} />
                      <span className="text-xs text-slate-400">{r.permissions.length} permissions</span>
                    </span>
                    {r.description && <span className="mt-1 block text-xs text-slate-500">{r.description}</span>}
                  </span>
                </button>
              ))}
            </div>
            {!selectedRole && <p className="mt-1 text-xs text-rose-600">Create a role first under Roles & Permissions.</p>}
          </div>
          {editing === "new" && (
            <div>
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Temporary password</span>
              <PasswordField value={draft.password} onChange={(password) => setDraft({ ...draft, password })} />
              <span className="mt-1 block text-xs text-slate-400">Share it securely. They can change it from their profile.</span>
            </div>
          )}
          {editing !== "new" && editing?.id !== meId && (
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span>
                <span className="block text-sm font-medium text-slate-700">Active</span>
                <span className="block text-xs text-slate-400">Inactive users can&apos;t sign in and are signed out immediately.</span>
              </span>
              <FieldInput field={{ key: "active", label: "Active", type: "boolean" }} value={draft.active} onChange={(v) => setDraft({ ...draft, active: Boolean(v) })} />
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setEditing(null)} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
            <button disabled={pending} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing === "new" ? "Create user" : "Save changes"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={resetting !== null} onClose={() => setResetting(null)} title={`Reset password · ${resetting?.name ?? ""}`}>
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Set a new password. They&apos;ll be signed out of every device and must use the new one.</p>
          <PasswordField value={newPassword} onChange={setNewPassword} />
          <div className="flex justify-end gap-2">
            <button onClick={() => setResetting(null)} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Cancel</button>
            <button
              disabled={pending}
              onClick={() => resetting && run(() => resetUserPassword(resetting.id, newPassword), () => setResetting(null))}
              className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />} Reset password
            </button>
          </div>
        </div>
      </Modal>

      <Toast result={toast} />
    </>
  );
}

function MenuItem({ children, icon, onClick, danger }: { children: React.ReactNode; icon: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${danger ? "text-rose-600 hover:bg-rose-50" : "text-slate-700 hover:bg-slate-50"}`}>
      {icon}
      {children}
    </button>
  );
}
