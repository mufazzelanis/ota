"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ExternalLink, History, Inbox, KeyRound, LayoutDashboard, LayoutList, LogOut, Menu, Palette, ShieldCheck, Users, X,
  type LucideIcon,
} from "lucide-react";
import { Icon } from "@/lib/icons";
import { can, ROLE_BADGE, type Permission, type RoleColor } from "@/lib/permissions";
import { logout } from "@/app/actions/admin";
import type { SessionUser } from "@/lib/types";

export type NavItem = { href: string; label: string; icon: string; permission?: Permission };

const CORE: { href: string; label: string; Icon: LucideIcon; permission?: Permission }[] = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/theme", label: "Theme & Colors", Icon: Palette, permission: "design" },
  { href: "/admin/layout", label: "Page Layout", Icon: LayoutList, permission: "design" },
  { href: "/admin/leads", label: "Leads Inbox", Icon: Inbox, permission: "leads.view" },
];

const SETTINGS: { href: string; label: string; Icon: LucideIcon; permission: Permission }[] = [
  { href: "/admin/settings/users", label: "Users", Icon: Users, permission: "users" },
  { href: "/admin/settings/roles", label: "Roles & Permissions", Icon: ShieldCheck, permission: "roles" },
  { href: "/admin/settings/activity", label: "Activity Log", Icon: History, permission: "activity" },
];

export function Sidebar({ groups, brandName, user }: { groups: [string, NavItem[]][]; brandName: string; user: SessionUser }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const allowed = (p?: Permission) => !p || can(user.permissions, p);

  const link = (active: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
      active ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
    }`;

  const visibleGroups = groups
    .map(([g, items]) => [g, items.filter((i) => allowed(i.permission))] as const)
    .filter(([, items]) => items.length);
  const settings = SETTINGS.filter((s) => allowed(s.permission));

  const nav = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand font-display text-xs font-extrabold text-white">CMS</span>
          <span className="font-display font-bold text-white">{brandName}</span>
        </Link>
        <button className="text-slate-400 lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto p-3" onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
        <div className="space-y-0.5">
          {CORE.filter((c) => allowed(c.permission)).map(({ href, label, Icon: I }) => (
            <Link key={href} href={href} className={link(path === href)}>
              <I className="h-4 w-4" /> {label}
            </Link>
          ))}
        </div>
        {visibleGroups.map(([group, items]) => (
          <div key={group}>
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{group}</p>
            <div className="space-y-0.5">
              {items.map((it) => (
                <Link key={it.href} href={it.href} className={link(path === it.href)}>
                  <Icon name={it.icon} className="h-4 w-4" /> {it.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
        {settings.length > 0 && (
          <div>
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Settings</p>
            <div className="space-y-0.5">
              {settings.map(({ href, label, Icon: I }) => (
                <Link key={href} href={href} className={link(path === href)}>
                  <I className="h-4 w-4" /> {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
      <div className="border-t border-white/10 p-3">
        <Link
          href="/admin/profile"
          onClick={() => setOpen(false)}
          className={`mb-1 flex items-center gap-3 rounded-lg p-2 transition ${path === "/admin/profile" ? "bg-white/10" : "hover:bg-white/5"}`}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white">
            {user.name[0]?.toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-white">{user.name}</span>
            <span className={`mt-0.5 inline-block rounded px-1.5 text-[10px] font-semibold ring-1 ${ROLE_BADGE[user.roleColor as RoleColor] ?? ROLE_BADGE.slate}`}>
              {user.roleName}
            </span>
          </span>
          <KeyRound className="h-4 w-4 text-slate-500" />
        </Link>
        <a href="/" target="_blank" className={link(false)}>
          <ExternalLink className="h-4 w-4" /> View live site
        </a>
        <form action={logout}>
          <button className={`${link(false)} w-full`}>
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <div className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
        <button onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-display font-bold">Admin</span>
      </div>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-slate-950 lg:block">{nav}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-slate-950 animate-fade-up">{nav}</aside>
        </div>
      )}
    </>
  );
}
