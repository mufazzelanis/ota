import { Suspense } from "react";
import { requireUser } from "@/lib/auth";
import { getContent } from "@/lib/content";
import { PageHeader } from "@/components/admin/ui";
import { ThemeEditor } from "@/components/admin/theme-editor";
import { LoadingCard } from "../loading-card";

export default function ThemePage() {
  return (
    <Suspense fallback={<LoadingCard />}>
      <Inner />
    </Suspense>
  );
}

async function Inner() {
  await requireUser("design");
  const { theme } = await getContent();
  return (
    <>
      <PageHeader title="Theme & Colors" description="Your brand palette is applied across the whole site and this admin panel." />
      <ThemeEditor initial={theme} />
    </>
  );
}
