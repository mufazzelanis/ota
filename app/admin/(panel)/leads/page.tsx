import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { getLeads } from "@/lib/content";
import { can } from "@/lib/permissions";
import { PageHeader } from "@/components/admin/ui";
import { LeadsTable } from "@/components/admin/leads-table";
import { LoadingCard } from "../loading-card";

export default function LeadsPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <Inner />
    </Suspense>
  );
}

async function Inner() {
  const user = await requireUser("leads.view");
  const leads = await getLeads();
  return (
    <>
      <PageHeader title="Leads Inbox" description="Requests submitted from the Request API Access form." />
      <LeadsTable leads={leads} canManage={can(user.permissions, "leads.manage")} />
    </>
  );
}
