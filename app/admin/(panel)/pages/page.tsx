import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { getContent } from "@/lib/content";
import { PageHeader } from "@/components/admin/ui";
import { PagesEditor } from "@/components/admin/pages-editor";
import { LoadingCard } from "../loading-card";

export default function PagesPage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <Inner />
    </Suspense>
  );
}

async function Inner() {
  await requireUser("pages");
  const { pages } = await getContent();
  return (
    <>
      <PageHeader title="Pages" description="Build any page from blocks. Link it from Navigation to show it in the header." />
      <PagesEditor initial={pages} />
    </>
  );
}
