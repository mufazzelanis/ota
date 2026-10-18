import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { getContent } from "@/lib/content";
import type { Page } from "@/lib/types";
import { Container } from "@/components/site/heading";
import { CodeWindow, OrbitArt } from "@/components/site/art";
import { Blocks } from "@/components/site/blocks";
import { PageSkeleton } from "@/components/site/page-skeleton";

export async function generateStaticParams() {
  const { pages } = await getContent();
  return pages.filter((p) => p.visible).map((p) => ({ slug: p.slug.split("/") }));
}

async function findPage(slug: string[]) {
  const c = await getContent();
  const path = slug.map(decodeURIComponent).join("/");
  return { c, page: c.pages.find((p) => p.visible && p.slug === path) };
}

export async function generateMetadata({ params }: PageProps<"/[...slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { page } = await findPage(slug);
  return page ? { title: page.title, description: page.seoDescription || page.hero.subtitle } : {};
}

function PageHero({ page, brandName }: { page: Page; brandName: string }) {
  const h = page.hero;
  const centered = h.art === "none";
  const crumbs = page.slug.split("/");
  return (
    <section className="hero-bg relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-24">
      <Container className={centered ? "max-w-4xl text-center" : "grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"}>
        <div>
          <nav className={`mb-6 flex items-center gap-1 text-xs text-white/50 ${centered ? "justify-center" : ""}`} aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Home</Link>
            {crumbs.map((c, i) => (
              <span key={c} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3" />
                <span className={i === crumbs.length - 1 ? "text-white/80" : ""}>{c.replace(/-/g, " ").replace(/^\w/, (x) => x.toUpperCase())}</span>
              </span>
            ))}
          </nav>
          {h.eyebrow && (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur animate-fade-up">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> {h.eyebrow}
            </span>
          )}
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white text-balance sm:text-5xl lg:text-6xl animate-fade-up" style={{ animationDelay: "80ms" }}>
            {h.title}
            {h.highlight && (
              <span className="block bg-linear-to-r from-accent via-accent to-white bg-clip-text text-transparent">{h.highlight}</span>
            )}
          </h1>
          {h.subtitle && (
            <p className={`mt-6 text-base leading-relaxed text-white/70 text-pretty sm:text-lg animate-fade-up ${centered ? "mx-auto max-w-2xl" : "max-w-xl"}`} style={{ animationDelay: "160ms" }}>
              {h.subtitle}
            </p>
          )}
          {(h.primaryLabel || h.secondaryLabel) && (
            <div className={`mt-8 flex flex-wrap gap-3 animate-fade-up ${centered ? "justify-center" : ""}`} style={{ animationDelay: "240ms" }}>
              {h.primaryLabel && (
                <Link href={h.primaryHref || "/contact"} className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-ink shadow-xl shadow-accent/25 transition hover:-translate-y-0.5">
                  {h.primaryLabel} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </Link>
              )}
              {h.secondaryLabel && (
                <Link href={h.secondaryHref || "/"} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/10">
                  {h.secondaryLabel}
                </Link>
              )}
            </div>
          )}
          {h.chips.length > 0 && (
            <ul className={`mt-8 flex flex-wrap gap-x-6 gap-y-2 ${centered ? "justify-center" : ""}`}>
              {h.chips.map((t) => (
                <li key={t} className="flex items-center gap-2 text-xs text-white/60">
                  <CheckCircle2 className="h-4 w-4 text-accent" /> {t}
                </li>
              ))}
            </ul>
          )}
        </div>
        {h.art === "code" && h.code && (
          <div className="relative lg:animate-float">
            <div className="absolute -inset-8 -z-10 rounded-full bg-brand/30 blur-3xl" />
            <CodeWindow title={h.codeTitle} code={h.code} />
          </div>
        )}
        {h.art === "orbit" && <OrbitArt icons={h.orbitIcons} label={brandName} />}
      </Container>
    </section>
  );
}

// The shell renders instantly; URL-specific content streams in behind Suspense.
export default function DynamicPage({ params }: PageProps<"/[...slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent params={params} />
    </Suspense>
  );
}

async function PageContent({ params }: { params: PageProps<"/[...slug]">["params"] }) {
  const { slug } = await params;
  const { c, page } = await findPage(slug);
  if (!page) notFound();
  return (
    <>
      <PageHero page={page} brandName={c.settings.brandName} />
      <Blocks blocks={page.blocks} c={c} />
    </>
  );
}
