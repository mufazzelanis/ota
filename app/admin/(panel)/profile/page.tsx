import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { PERMISSIONS } from "@/lib/permissions";
import { PageHeader } from "@/components/admin/ui";
import { ProfileForm } from "@/components/admin/profile-form";
import { LoadingCard } from "../loading-card";

export default function ProfilePage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <Inner />
    </Suspense>
  );
}

async function Inner() {
  const me = await requireUser();
  const granted = PERMISSIONS.filter((p) => me.permissions.includes(p.key)).map((p) => p.label);
  return (
    <>
      <PageHeader title="My Profile" description="Your account details and password." />
      <ProfileForm user={me} granted={granted} />
    </>
  );
}
