import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { getActivity } from "@/lib/activity";
import { PageHeader } from "@/components/admin/ui";
import { card } from "@/components/admin/styles";
import { ActivityList } from "@/components/admin/activity-list";
import { LoadingCard } from "../../loading-card";

export default function ActivityPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <Inner />
    </Suspense>
  );
}

async function Inner() {
  await requireUser("activity");
  const items = await getActivity(300);
  return (
    <>
      <PageHeader title="Activity Log" description="Sign-ins, content changes, user and role updates. The latest 300 events are shown." />
      <div className={`${card} p-6`}>
        <ActivityList items={items} />
      </div>
    </>
  );
}
