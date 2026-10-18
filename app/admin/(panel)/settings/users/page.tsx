import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { env } from "@/lib/env";
import { getRoles } from "@/lib/roles";
import { getUsers, toPublic } from "@/lib/users";
import { PageHeader } from "@/components/admin/ui";
import { UsersManager } from "@/components/admin/users-manager";
import { LoadingCard } from "../../loading-card";

export default function UsersPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <Inner />
    </Suspense>
  );
}

async function Inner() {
  const me = await requireUser("users");
  const [users, roles] = await Promise.all([getUsers(), getRoles()]);
  return (
    <>
      <PageHeader title="Users" description="Give your team their own sign-in and assign each person a role." />
      <UsersManager users={users.map(toPublic)} roles={roles} owner={{ name: env.adminName, email: env.adminEmail }} meId={me.id} />
    </>
  );
}
