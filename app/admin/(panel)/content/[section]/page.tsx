import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getContent } from "@/lib/content";
import { findSection } from "@/lib/admin-schema";
import { permissionForKey } from "@/lib/permissions";
import { PageHeader } from "@/components/admin/ui";
import { ObjectEditor } from "@/components/admin/object-editor";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { LoadingCard } from "../../loading-card";

export default function SectionPage({ params }: PageProps<"/admin/content/[section]">) {
  return (
    <Suspense fallback={<LoadingCard />}>
      {params.then(({ section }) => (
        <Editor section={section} />
      ))}
    </Suspense>
  );
}

async function Editor({ section }: { section: string }) {
  const schema = findSection(section);
  if (!schema) notFound();
  await requireUser(permissionForKey(schema.key));
  const content = await getContent();
  const initial = content[schema.key];

  return (
    <>
      <PageHeader title={schema.label} description={schema.description} />
      {schema.kind === "object" ? (
        <ObjectEditor key={schema.key} sectionKey={schema.key} initial={initial} fields={schema.fields} />
      ) : (
        <CollectionEditor
          key={schema.key}
          sectionKey={schema.key}
          initial={initial}
          fields={schema.fields}
          titleKey={schema.titleKey}
          subtitleKey={schema.subtitleKey}
          iconKey={schema.iconKey}
        />
      )}
    </>
  );
}
