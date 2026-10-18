import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Eye, Inbox, Layers, Palette, LayoutList, ShieldAlert, Users } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getContent, getLeads } from "@/lib/content";
import { getActivity } from "@/lib/activity";
import { getUsers } from "@/lib/users";
import { can, type Permission } from "@/lib/permissions";
import { THEME_PRESETS } from "@/lib/themes";
import { PageHeader } from "@/components/admin/ui";
import { card } from "@/components/admin/styles";
import { DataTools } from "@/components/admin/data-tools";
import { ActivityList } from "@/components/admin/activity-list";
import { LoadingCard } from "./loading-card";

export default function DashboardPage({ searchParams }: PageProps<"/admin">) {
  return (
    <Suspense fallback={<LoadingCard />}>
      <Dashboard searchParams={searchParams} />
    </Suspense>
  );
}

async function Dashboard({ searchParams }: { searchParams: PageProps<"/admin">["searchParams"] }) {
  const user = await requireUser();
  const has = (p: Permission) => can(user.permissions, p);
  const [{ denied }, c, leads, activity, users] = await Promise.all([
    searchParams,
    getContent(),
    has("leads.view") ? getLeads() : Promise.resolve([]),
    has("activity") ? getActivity(8) : Promise.resolve([]),
    has("users") ? getUsers() : Promise.resolve([]),
  ]);
  const unread = leads.filter((l) => !l.read).length;
  const preset = THEME_PRESETS.find((p) => p.preset === c.theme.preset);

  const stats = [
    has("leads.view") && { label: "New leads", value: unread, sub: `${leads.length} total`, Icon: Inbox, href: "/admin/leads" },
    has("catalog") && { label: "Live products", value: c.products.filter((p) => p.visible).length, sub: `${c.products.length} total`, Icon: Layers, href: "/admin/content/products" },
    has("design") && { label: "Visible sections", value: c.sections.filter((s) => s.visible).length, sub: `of ${c.sections.length}`, Icon: LayoutList, href: "/admin/layout" },
    has("users") && { label: "Team members", value: users.filter((u) => u.active).length + 1, sub: "including owner", Icon: Users, href: "/admin/settings/users" },
  ].filter(Boolean) as { label: string; value: number; sub: string; Icon: typeof Inbox; href: string }[];

  const quick = [
    ["Hero headline", "/admin/content/hero", "content"],
    ["Products", "/admin/content/products", "catalog"],
    ["API playground", "/admin/content/playground", "content"],
    ["FAQ", "/admin/content/faqs", "content"],
    ["Brand & contact", "/admin/content/settings", "brand"],
    ["Theme & colors", "/admin/theme", "design"],
  ].filter(([, , p]) => has(p as Permission));

  return (
    <>
      <PageHeader
        title={`Welcome back, ${user.name.split(" ")[0]} 👋`}
        description={`Signed in as ${user.roleName}. Changes publish instantly.`}
        actions={
          <a href="/" target="_blank" className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow hover:brightness-110">
            <Eye className="h-4 w-4" /> View site
          </a>
        }
      />

      {denied && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <ShieldAlert className="h-5 w-5 shrink-0" />
          Your role doesn&apos;t have access to that page. Ask an admin if you need it.
        </div>
      )}

      {stats.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, sub, Icon: I, href }) => (
            <Link key={label} href={href} className={`${card} group p-5 transition hover:-translate-y-0.5 hover:shadow-md`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">{label}</span>
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand/10 text-brand">
                  <I className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 font-display text-3xl font-bold text-slate-900">{value}</p>
              <p className="mt-1 text-xs text-slate-400">{sub}</p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {has("leads.view") && (
          <div className={`${card} p-6`}>
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-slate-900">Recent leads</h2>
              <Link href="/admin/leads" className="text-sm font-medium text-brand">View all</Link>
            </div>
            <ul className="mt-4 divide-y divide-slate-100">
              {leads.slice(0, 5).map((l) => (
                <li key={l.id} className="flex items-center gap-3 py-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-brand/10 text-xs font-bold text-brand">{l.name[0]?.toUpperCase()}</span>
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-sm ${l.read ? "text-slate-600" : "font-semibold text-slate-900"}`}>{l.name}</span>
                    <span className="block truncate text-xs text-slate-400">{l.company}</span>
                  </span>
                  {!l.read && <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-white">NEW</span>}
                </li>
              ))}
              {!leads.length && <li className="py-8 text-center text-sm text-slate-400">No leads yet</li>}
            </ul>
          </div>
        )}

        {has("activity") && (
          <div className={`${card} p-6`}>
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-slate-900">Recent activity</h2>
              <Link href="/admin/settings/activity" className="text-sm font-medium text-brand">View all</Link>
            </div>
            <div className="mt-4">
              <ActivityList items={activity} compact />
            </div>
          </div>
        )}

        {has("design") && (
          <div className={`${card} p-6`}>
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-slate-900">Current theme</h2>
              <Link href="/admin/theme" className="inline-flex items-center gap-1 text-sm font-medium text-brand">
                <Palette className="h-4 w-4" /> Change
              </Link>
            </div>
            <div className="mt-4 flex h-20 overflow-hidden rounded-xl">
              <span className="flex-2" style={{ background: c.theme.dark }} />
              <span className="flex-2" style={{ background: c.theme.brand }} />
              <span className="flex-1" style={{ background: c.theme.accent }} />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-800">{preset?.name ?? "Custom palette"}</p>
            <p className="text-xs text-slate-400">{preset?.note ?? "Hand-tuned colors"}</p>
          </div>
        )}

        {quick.length > 0 && (
          <div className={`${card} p-6`}>
            <h2 className="font-display font-semibold text-slate-900">Quick edits</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {quick.map(([label, href]) => (
                <Link key={href} href={href} className="group flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 hover:border-brand/40 hover:text-brand">
                  {label} <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {has("backup") && <DataTools content={c} />}
      </div>
    </>
  );
}
