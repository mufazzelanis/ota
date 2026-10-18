import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { getContent } from "@/lib/content";
import { PageHeader } from "@/components/admin/ui";
import { SectionsEditor } from "@/components/admin/sections-editor";
import { LoadingCard } from "../loading-card";

export default function LayoutPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <Inner />
    </Suspense>
  );
}

async function Inner() {
  await requireUser("design");
  const { sections } = await getContent();
  return (
    <>
      <PageHeader title="Page Layout" description="Drag to reorder homepage sections. Toggle any section off to hide it." />
      <SectionsEditor initial={sections} />
    </>
  );
}
