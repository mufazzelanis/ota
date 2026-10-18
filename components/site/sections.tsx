import Link from "next/link";
import { ArrowRight, Check, Layers, Shield, Star, Tag, X, Zap, Calendar, MessageCircle, Sparkles } from "lucide-react";
import { Icon, TONES } from "@/lib/icons";
import type { Content } from "@/lib/types";
import { Container, Eyebrow, Heading } from "./heading";
import { Reveal } from "./reveal";
import { Playground } from "./playground";
import { CountUp } from "./count-up";
import { FaqList, VideoButton } from "./interactive";

const visible = <T extends { visible: boolean }>(xs: T[]) => xs.filter((x) => x.visible);
const TRUST_ICONS = [Shield, Tag, Zap];

export function HeroSection({ c }: { c: Content }) {
  const { hero } = c;
  return (
    <section className="hero-bg relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">
      <Container className="relative grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur animate-fade-up">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {hero.badge}
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white text-balance sm:text-5xl lg:text-6xl xl:text-[4.1rem]">
            {hero.titleLines.map((line, i) => (
              <span key={i} className="block animate-fade-up" style={{ animationDelay: `${80 * (i + 1)}ms` }}>
                {line}
              </span>
            ))}
            <span className="block animate-fade-up" style={{ animationDelay: `${80 * (hero.titleLines.length + 1)}ms` }}>
              <span className="bg-linear-to-r from-accent via-accent to-white bg-clip-text text-transparent">{hero.highlight}</span>
              <span className="text-accent">.</span>
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 text-pretty sm:text-lg animate-fade-up" style={{ animationDelay: "400ms" }}>
            {hero.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3 animate-fade-up" style={{ animationDelay: "500ms" }}>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-ink shadow-xl shadow-accent/25 transition hover:-translate-y-0.5 hover:brightness-105"
            >
              {hero.primaryCta}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              <Layers className="h-4 w-4" />
              {hero.secondaryCta}
            </Link>
          </div>
          <div className="mt-8 animate-fade-up" style={{ animationDelay: "600ms" }}>
            <VideoButton label={hero.videoLabel} brandName={c.settings.brandName} />
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {hero.trustPoints.map((t, i) => {
              const I = TRUST_ICONS[i % TRUST_ICONS.length];
              return (
                <li key={t} className="flex items-center gap-2 text-xs text-white/60">
                  <I className="h-4 w-4 text-accent" />
                  {t}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative lg:animate-float">
          <div className="absolute -inset-8 -z-10 rounded-full bg-brand/30 blur-3xl" />
          <Playground items={visible(c.playground)} />
        </div>
      </Container>
    </section>
  );
}

export function StatsSection({ c }: { c: Content }) {
  const stats = visible(c.stats);
  return (
    <section className="border-t border-white/10 bg-[color-mix(in_oklab,var(--brand-dark)_70%,black)]">
      <Container className="grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.id} delay={i * 80}>
            <div className="font-display text-4xl font-extrabold text-white sm:text-5xl">
              <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <div className="mt-2 text-sm text-white/60">{s.label}</div>
          </Reveal>
        ))}
      </Container>
    </section>
  );
}

export function PartnersSection({ c }: { c: Content }) {
  const items = visible(c.partners);
  if (!items.length) return null;
  const loop = [...items, ...items];
  return (
    <section className="border-b border-slate-100 bg-white py-10">
      <Container>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted">{c.headings.partners.title}</p>
      </Container>
      <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max gap-4 animate-marquee hover:[animation-play-state:paused]">
          {loop.map((p, i) => (
            <span key={`${p.id}-${i}`} className="flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-5 py-2.5 text-sm font-semibold text-slate-600">
              <Sparkles className="h-4 w-4 text-brand" />
              {p.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AnnouncementSection({ c }: { c: Content }) {
  const a = c.announcement;
  if (!a.enabled) return null;
  return (
    <section className="bg-surface py-16">
      <Container className="text-center">
        <Reveal>
          <span className="inline-flex rounded-full bg-accent/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-ink">{a.eyebrow}</span>
          <h2 className="mt-4 font-display text-2xl font-bold text-ink sm:text-3xl">{a.title}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted">{a.text}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {a.links.map((l) => (
              <Link key={l} href="/#products" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:border-brand/40 hover:text-brand">
                {l} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function AboutSection({ c }: { c: Content }) {
  const a = c.about;
  return (
    <section id="about" className="relative overflow-hidden py-24">
      <div className="grid-fade absolute inset-0 -z-10" />
      <Container className="max-w-4xl text-center">
        <Reveal>
          <Eyebrow>{a.eyebrow}</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink text-balance sm:text-4xl">{a.title}</h2>
          {a.paragraphs.map((p, i) => (
            <p key={i} className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">
              {p}
            </p>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

export function BenefitsSection({ c }: { c: Content }) {
  return (
    <section className="bg-surface py-24">
      <Container>
        <Heading heading={c.headings.benefits} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {visible(c.benefits).map((b, i) => (
            <Reveal key={b.id} delay={i * 80}>
              <div className="group h-full rounded-2xl border border-slate-200/70 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
                  <Icon name={b.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ProductsSection({ c }: { c: Content }) {
  const products = visible(c.products);
  return (
    <section id="products" className="scroll-mt-20 py-24">
      <Container>
        <Heading
          heading={c.headings.products}
          align="left"
          aside={
            <Link href="/contact" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-brand hover:underline">
              Talk to an integration engineer <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => {
            const tone = TONES[p.tone];
            return (
              <Reveal key={p.id} delay={(i % 3) * 80}>
                <Link
                  href={`/products/${p.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-surface p-6 ring-1 ring-transparent transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-slate-200/70"
                >
                  <span className={`absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent transition ${tone.ring}`} />
                  <span className={`grid h-12 w-12 place-items-center rounded-xl bg-white shadow-sm ${tone.text}`}>
                    <Icon name={p.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-semibold text-ink">{p.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.short}</p>
                  <span className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${tone.text}`}>
                    Explore coverage <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
          <Reveal delay={(products.length % 3) * 80}>
            <div className="relative flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-brand-dark p-8 text-center">
              <div className="dot-bg absolute inset-0 opacity-50" />
              <span className="relative grid h-12 w-12 place-items-center rounded-xl bg-accent/20 text-accent">
                <Sparkles className="h-6 w-6" />
              </span>
              <h3 className="relative mt-4 font-display text-lg font-bold text-white">Need custom infrastructure?</h3>
              <p className="relative mt-2 text-sm text-white/60">Enterprise solutions for high-volume travel businesses.</p>
              <Link href="/contact" className="relative mt-5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand-dark transition hover:bg-accent hover:text-accent-ink">
                Contact Sales
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export function UseCasesSection({ c }: { c: Content }) {
  return (
    <section id="usecases" className="scroll-mt-20 bg-surface py-24">
      <Container>
        <Heading heading={c.headings.usecases} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible(c.useCases).map((u, i) => {
            const tone = TONES[u.tone];
            return (
              <Reveal key={u.id} delay={(i % 3) * 80}>
                <div className="group h-full rounded-2xl border border-slate-200/70 bg-white p-6 transition hover:shadow-lg">
                  <span className={`grid h-10 w-10 place-items-center rounded-lg ${tone.bg} ${tone.text}`}>
                    <Icon name={u.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-ink">{u.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{u.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function Cell({ v, strong }: { v: string; strong?: boolean }) {
  if (v === "yes") return <Check className={`mx-auto h-5 w-5 ${strong ? "text-accent" : "text-white/40"}`} />;
  if (v === "no") return <X className="mx-auto h-5 w-5 text-white/30" />;
  return <span className={strong ? "font-semibold text-white" : "text-white/40"}>{v}</span>;
}

export function WhySection({ c }: { c: Content }) {
  return (
    <section id="why" className="scroll-mt-20 py-24">
      <Container className="grid items-start gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <Eyebrow>{c.headings.why.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink text-balance sm:text-4xl">{c.headings.why.title}</h2>
          </Reveal>
          <div className="mt-10 space-y-7">
            {visible(c.reasons).map((r, i) => (
              <Reveal key={r.id} delay={i * 80}>
                <div className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Icon name={r.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-ink">{r.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{r.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={120}>
          <div className="relative overflow-hidden rounded-3xl bg-brand-dark p-6 shadow-2xl shadow-brand-dark/30 sm:p-8">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-brand/40 blur-3xl" />
            <h3 className="relative font-display text-xl font-bold text-white">{c.settings.brandName} vs. traditional integration</h3>
            <p className="relative mt-1 text-sm text-white/50">A typical comparison from teams who&apos;ve tried both paths.</p>
            <table className="relative mt-6 w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-3 text-left font-medium text-white/40" />
                  <th className="py-3 text-center text-accent">{c.settings.brandName}</th>
                  <th className="py-3 text-center text-white/40">Direct GDS</th>
                </tr>
              </thead>
              <tbody>
                {visible(c.compare).map((row) => (
                  <tr key={row.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3.5 pr-2 text-white/70">{row.label}</td>
                    <td className="py-3.5 text-center">
                      <Cell v={row.us} strong />
                    </td>
                    <td className="py-3.5 text-center">
                      <Cell v={row.them} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function StepsSection({ c }: { c: Content }) {
  const steps = visible(c.steps);
  return (
    <section id="steps" className="scroll-mt-20 bg-surface py-24">
      <Container>
        <Heading heading={c.headings.steps} />
        <div className="relative grid gap-10 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-7 hidden h-px bg-linear-to-r from-brand/10 via-brand/50 to-brand/10 md:block" />
          {steps.map((s, i) => (
            <Reveal key={s.id} delay={i * 120} className="relative text-center">
              <span className="relative mx-auto grid h-14 w-14 place-items-center rounded-full border-4 border-surface bg-white font-display text-lg font-bold text-brand shadow-md ring-2 ring-brand/20">
                {i + 1}
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function TestimonialsSection({ c }: { c: Content }) {
  const items = visible(c.testimonials);
  if (!items.length) return null;
  return (
    <section className="overflow-hidden py-24">
      <Container>
        <Heading heading={c.headings.testimonials} />
      </Container>
      <div className="relative [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max gap-5 animate-marquee [animation-duration:60s] hover:[animation-play-state:paused]">
          {[...items, ...items].map((t, i) => (
            <figure key={`${t.id}-${i}`} className="w-[340px] shrink-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:w-[400px]">
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <Star key={k} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-[15px] leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 font-display text-sm font-bold text-brand">
                  {t.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink">{t.name}</span>
                  <span className="block text-xs text-muted">
                    {t.role}, {t.company}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ c }: { c: Content }) {
  return (
    <section id="faq" className="scroll-mt-20 py-24">
      <Container className="max-w-3xl">
        <Heading heading={c.headings.faq} />
        <Reveal>
          <FaqList items={visible(c.faqs)} />
        </Reveal>
      </Container>
    </section>
  );
}

export function ResourcesSection({ c }: { c: Content }) {
  return (
    <section className="bg-surface py-20">
      <Container className="max-w-5xl">
        <Heading heading={c.headings.resources} />
        <div className="grid gap-4 md:grid-cols-3">
          {visible(c.resources).map((r, i) => (
            <Reveal key={r.id} delay={i * 80}>
              <div className="group h-full rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg">
                <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">{r.tag}</span>
                <h3 className="mt-4 font-display font-semibold text-ink group-hover:text-brand">{r.title}</h3>
                <p className="mt-2 text-sm text-muted">{r.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function CtaSection({ c }: { c: Content }) {
  return (
    <section className="relative overflow-hidden bg-brand py-24">
      <div className="dot-bg absolute inset-0" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-dark/60 blur-3xl" />
      <Container className="relative max-w-3xl text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white text-balance sm:text-5xl">{c.cta.title}</h2>
          <p className="mx-auto mt-5 max-w-xl text-white/80">{c.cta.text}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-brand shadow-xl transition hover:-translate-y-0.5">
              <Calendar className="h-4 w-4" /> {c.cta.primary}
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-black/20">
              <MessageCircle className="h-4 w-4" /> {c.cta.secondary}
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
