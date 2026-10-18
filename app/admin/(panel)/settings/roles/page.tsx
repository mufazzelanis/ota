import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { getRoles } from "@/lib/roles";
import { getUsers } from "@/lib/users";
import { PageHeader } from "@/components/admin/ui";
import { RolesManager } from "@/components/admin/roles-manager";
import { LoadingCard } from "../../loading-card";

export default function RolesPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <Inner />
    </Suspense>
  );
}

async function Inner() {
  await requireUser("roles");
  const [roles, users] = await Promise.all([getRoles(), getUsers()]);
  const members: Record<string, number> = {};
  for (const u of users) members[u.roleId] = (members[u.roleId] ?? 0) + 1;
  return (
    <>
      <PageHeader title="Roles & Permissions" description="Create roles and tick exactly what each one can do. Changes apply to members immediately." />
      <RolesManager roles={roles} members={members} />
    </>
  );
}
