import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, CheckCircle2, Terminal } from "lucide-react";
import { getContent } from "@/lib/content";
import { Icon, TONES } from "@/lib/icons";
import { Container, Eyebrow } from "@/components/site/heading";
import { Reveal } from "@/components/site/reveal";
import { CtaSection } from "@/components/site/sections";
import { PageSkeleton } from "@/components/site/page-skeleton";

export async function generateStaticParams() {
  const { products } = await getContent();
  return products.filter((p) => p.visible).map((p) => ({ slug: p.slug }));
}

async function findProduct(slug: string) {
  const c = await getContent();
  const product = c.products.find((p) => p.slug === slug && p.visible);
  return { c, product };
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await findProduct(slug);
  return product ? { title: product.name, description: product.short } : {};
}

// The shell renders instantly; URL-specific content streams in behind Suspense.
export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: { params: PageProps<"/products/[slug]">["params"] }) {
  const { slug } = await params;
  const { c, product } = await findProduct(slug);
  if (!product) notFound();

  const tone = TONES[product.tone];
  const related = c.products.filter((p) => p.visible && p.id !== product.id).slice(0, 3);

  return (
    <>
      <section className="hero-bg relative overflow-hidden pt-32 pb-20 lg:pt-40">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <Link href="/#products" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> All products
            </Link>
            <span className="mt-6 grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-lg">
              <Icon name={product.icon} className={`h-7 w-7 ${tone.text}`} />
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-white text-balance sm:text-5xl">{product.name}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">{product.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-ink shadow-xl shadow-accent/25 transition hover:-translate-y-0.5">
                Get sandbox keys <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10">
                Talk to an engineer
              </Link>
            </div>
          </div>
          <div className="gradient-border rounded-2xl bg-[#0b1220]/90 p-5 shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 font-mono text-xs text-white/50">
              <Terminal className="h-4 w-4 text-accent" /> Endpoints
            </div>
            <ul className="mt-3 space-y-2 font-mono text-[13px]">
              {product.endpoints.map((e) => {
                const [method, ...rest] = e.split(" ");
                return (
                  <li key={e} className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5">
                    <span className={`w-12 shrink-0 text-xs font-bold ${method === "GET" ? "text-emerald-300" : "text-accent"}`}>{method}</span>
                    <span className="truncate text-white/80">{rest.join(" ")}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <Reveal className="max-w-2xl">
            <Eyebrow>What&apos;s included</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">Everything you need to sell {product.name.replace(/ API$/, "").toLowerCase()}.</h2>
          </Reveal>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((f, i) => (
              <Reveal key={f} delay={(i % 3) * 80}>
                <div className="flex h-full items-start gap-3 rounded-2xl border border-slate-200 bg-surface p-5">
                  <CheckCircle2 className={`mt-0.5 h-5 w-5 shrink-0 ${tone.text}`} />
                  <span className="text-sm font-medium text-ink">{f}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="bg-surface py-20">
          <Container>
            <h2 className="font-display text-2xl font-bold text-ink">Pairs well with</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {related.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">
                  <Icon name={p.icon} className={`h-6 w-6 ${TONES[p.tone].text}`} />
                  <h3 className="mt-4 font-display font-semibold text-ink">{p.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{p.short}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaSection c={c} />
    </>
  );
}
