import type { Metadata } from "next";
import { Suspense } from "react";
import { getContent } from "@/lib/content";
import { getSession } from "@/lib/auth";
import { ADMIN_SECTIONS } from "@/lib/admin-schema";
import { permissionForKey } from "@/lib/permissions";
import { Sidebar, type NavItem } from "@/components/admin/sidebar";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Suspense fallback={<aside className="fixed inset-y-0 left-0 hidden w-64 bg-slate-950 lg:block" />}>
        <SidebarLoader />
      </Suspense>
      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}

async function SidebarLoader() {
  const [user, { settings }] = await Promise.all([getSession(), getContent()]);
  // Signed-out visitors are redirected by the page itself; render no sidebar.
  if (!user) return null;

  const groups = new Map<string, NavItem[]>();
  for (const s of ADMIN_SECTIONS) {
    const list = groups.get(s.group) ?? [];
    list.push({ href: `/admin/content/${s.key}`, label: s.label, icon: s.icon, permission: permissionForKey(s.key) });
    groups.set(s.group, list);
  }
  groups.get("Site Builder")?.unshift({ href: "/admin/pages", label: "Pages", icon: "layers", permission: "pages" });
  return <Sidebar groups={[...groups]} brandName={settings.brandName} user={user} />;
}
