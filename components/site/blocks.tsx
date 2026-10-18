import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Calendar, Check, CheckCircle2, MessageCircle, Sparkles, X } from "lucide-react";
import { Icon } from "@/lib/icons";
import type { Block, Content } from "@/lib/types";
import { Container, Eyebrow } from "./heading";
import { Reveal } from "./reveal";
import { CountUp } from "./count-up";
import { CodeWindow } from "./art";
import { FaqList } from "./interactive";
import { CoverageExplorer, EndpointsExplorer } from "./explorers";

type Row = Record<string, unknown> & { id: string };
const s = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));
const rows = (v: unknown) => (Array.isArray(v) ? (v as Row[]) : []);
const lines = (v: unknown) => (Array.isArray(v) ? (v as string[]).filter(Boolean) : []);

function BlockHeading({ b, center = true }: { b: Block; center?: boolean }) {
  if (!s(b.title) && !s(b.eyebrow)) return null;
  return (
    <Reveal className={`mb-12 ${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      {s(b.eyebrow) && <Eyebrow>{s(b.eyebrow)}</Eyebrow>}
      {s(b.title) && <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink text-balance sm:text-4xl">{s(b.title)}</h2>}
      {s(b.subtitle) && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{s(b.subtitle)}</p>}
    </Reveal>
  );
}

function Section({ children, tint, id }: { children: ReactNode; tint?: boolean; id?: string }) {
  return (
    <section id={id} className={`overflow-x-clip py-20 sm:py-24 ${tint ? "bg-surface" : "bg-white"}`}>
      <Container>{children}</Container>
    </section>
  );
}

function Href({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  return href.startsWith("http") ? (
    <a href={href} className={className} target="_blank" rel="noreferrer">{children}</a>
  ) : (
    <Link href={href || "/contact"} className={className}>{children}</Link>
  );
}

const Features = ({ b, tint }: { b: Block; tint: boolean }) => {
  const cols = s(b.columns) === "4" ? "lg:grid-cols-4" : s(b.columns) === "2" ? "lg:grid-cols-2" : "lg:grid-cols-3";
  return (
    <Section tint={tint}>
      <BlockHeading b={b} />
      <div className={`grid gap-5 sm:grid-cols-2 ${cols}`}>
        {rows(b.items).map((it, i) => (
          <Reveal key={it.id} delay={(i % 4) * 70}>
            <div className="group h-full rounded-2xl border border-slate-200/80 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl hover:shadow-brand/10">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
                <Icon name={s(it.icon)} className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-ink">{s(it.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s(it.text)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
};

const Stats = ({ b }: { b: Block }) => (
  <section className="relative overflow-hidden bg-brand-dark">
    <div className="dot-bg absolute inset-0 opacity-40" />
    <Container className="relative grid grid-cols-2 gap-8 py-14 lg:grid-cols-4">
      {rows(b.items).map((it, i) => (
        <Reveal key={it.id} delay={i * 80}>
          <div className="font-display text-4xl font-extrabold text-white sm:text-5xl">
            <CountUp value={Number(it.value) || 0} prefix={s(it.prefix)} suffix={s(it.suffix)} />
          </div>
          <div className="mt-2 text-sm text-white/60">{s(it.label)}</div>
        </Reveal>
      ))}
    </Container>
  </section>
);

const Split = ({ b, tint }: { b: Block; tint: boolean }) => (
  <Section tint={tint}>
    <div className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 ${b.reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
      <Reveal>
        {s(b.eyebrow) && <Eyebrow>{s(b.eyebrow)}</Eyebrow>}
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink text-balance sm:text-4xl">{s(b.title)}</h2>
        {s(b.text) && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{s(b.text)}</p>}
        <ul className="mt-6 space-y-3">
          {lines(b.bullets).map((t) => (
            <li key={t} className="flex gap-3 text-sm text-ink">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" /> {t}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={120}>
        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-full bg-brand/15 blur-3xl" />
          <CodeWindow title={s(b.codeTitle)} code={s(b.code)} />
        </div>
      </Reveal>
    </div>
  </Section>
);

const Steps = ({ b, tint }: { b: Block; tint: boolean }) => {
  const items = rows(b.items);
  const cols = items.length >= 4 ? "md:grid-cols-4" : "md:grid-cols-3";
  return (
    <Section tint={tint}>
      <BlockHeading b={b} />
      <div className={`relative grid gap-10 ${cols}`}>
        <div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-linear-to-r from-brand/10 via-brand/50 to-brand/10 md:block" />
        {items.map((it, i) => (
          <Reveal key={it.id} delay={i * 110} className="relative text-center">
            <span className={`relative mx-auto grid h-14 w-14 place-items-center rounded-full border-4 bg-white font-display text-lg font-bold text-brand shadow-md ring-2 ring-brand/20 ${tint ? "border-surface" : "border-white"}`}>
              {i + 1}
            </span>
            <h3 className="mt-5 font-display text-lg font-semibold text-ink">{s(it.title)}</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted">{s(it.text)}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
};

function Cell({ v, strong }: { v: string; strong?: boolean }) {
  if (v === "yes") return <Check className={`mx-auto h-5 w-5 ${strong ? "text-accent" : "text-white/40"}`} />;
  if (v === "no") return <X className="mx-auto h-5 w-5 text-white/30" />;
  return <span className={strong ? "font-semibold text-white" : "text-white/45"}>{v}</span>;
}

const Compare = ({ b, tint }: { b: Block; tint: boolean }) => (
  <Section tint={tint}>
    <BlockHeading b={b} />
    <Reveal>
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl bg-brand-dark p-6 shadow-2xl shadow-brand-dark/30 sm:p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-brand/40 blur-3xl" />
        <table className="relative w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider">
              <th />
              <th className="py-3 text-center text-accent">{s(b.usLabel)}</th>
              <th className="py-3 text-center text-white/40">{s(b.themLabel)}</th>
            </tr>
          </thead>
          <tbody>
            {rows(b.rows).map((r) => (
              <tr key={r.id} className="border-b border-white/5 last:border-0">
                <td className="py-3.5 pr-2 text-white/75">{s(r.label)}</td>
                <td className="py-3.5 text-center"><Cell v={s(r.us)} strong /></td>
                <td className="py-3.5 text-center"><Cell v={s(r.them)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  </Section>
);

const Coverage = ({ b, tint }: { b: Block; tint: boolean }) => (
  <Section tint={tint}>
    <BlockHeading b={b} />
    <Reveal>
      <CoverageExplorer
        placeholder={s(b.searchPlaceholder)}
        regions={rows(b.regions).map((r) => ({ id: r.id, name: s(r.name), value: s(r.value), label: s(r.label) }))}
        items={rows(b.items).map((r) => ({ id: r.id, name: s(r.name), code: s(r.code), region: s(r.region), meta: s(r.meta), tags: s(r.tags) }))}
      />
    </Reveal>
  </Section>
);

const Endpoints = ({ b, tint, c }: { b: Block; tint: boolean; c: Content }) => (
  <Section tint={tint}>
    <BlockHeading b={b} />
    <EndpointsExplorer
      groups={c.products.filter((p) => p.visible && p.endpoints.length).map((p) => ({ slug: p.slug, name: p.name, icon: p.icon, endpoints: p.endpoints }))}
    />
  </Section>
);

const Cards = ({ b, tint }: { b: Block; tint: boolean }) => (
  <Section tint={tint}>
    <BlockHeading b={b} />
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {rows(b.items).map((it, i) => (
        <Reveal key={it.id} delay={(i % 3) * 70}>
          <Href
            href={s(it.href)}
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl"
          >
            <span className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand/5 transition group-hover:scale-150" />
            <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-brand-dark text-accent">
              <Icon name={s(it.icon)} className="h-5 w-5" />
            </span>
            <h3 className="relative mt-5 font-display text-lg font-semibold text-ink">{s(it.title)}</h3>
            <p className="relative mt-2 flex-1 text-sm leading-relaxed text-muted">{s(it.text)}</p>
            {s(it.label) && (
              <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                {s(it.label)} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            )}
          </Href>
        </Reveal>
      ))}
    </div>
  </Section>
);

const Faq = ({ b, tint }: { b: Block; tint: boolean }) => (
  <Section tint={tint}>
    <div className="mx-auto max-w-3xl">
      <BlockHeading b={b} />
      <Reveal>
        <FaqList items={rows(b.items).map((it) => ({ id: it.id, question: s(it.question), answer: s(it.answer), visible: true }))} />
      </Reveal>
    </div>
  </Section>
);

const TAG_TONE: Record<string, string> = {
  New: "bg-emerald-100 text-emerald-700",
  Improved: "bg-sky-100 text-sky-700",
  Fixed: "bg-amber-100 text-amber-800",
  Deprecated: "bg-rose-100 text-rose-700",
};

const Timeline = ({ b, tint }: { b: Block; tint: boolean }) => (
  <Section tint={tint}>
    <BlockHeading b={b} />
    <ol className="relative mx-auto max-w-3xl border-l-2 border-slate-200 pl-8">
      {rows(b.items).map((it, i) => (
        <Reveal key={it.id} delay={i * 60} className="relative mb-10 last:mb-0">
          <span className="absolute -left-[41px] top-1 grid h-5 w-5 place-items-center rounded-full border-4 border-white bg-brand ring-2 ring-brand/20" />
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-muted">{s(it.date)}</span>
            {s(it.version) && <span className="rounded-md bg-brand-dark px-2 py-0.5 font-mono font-semibold text-accent">{s(it.version)}</span>}
            {s(it.tag) && <span className={`rounded-md px-2 py-0.5 font-semibold ${TAG_TONE[s(it.tag)] ?? "bg-slate-100 text-slate-600"}`}>{s(it.tag)}</span>}
          </div>
          <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <h3 className="font-display text-lg font-semibold text-ink">{s(it.title)}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{s(it.text)}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  </Section>
);

const STATUS: Record<string, { label: string; dot: string; text: string }> = {
  operational: { label: "Operational", dot: "bg-emerald-500", text: "text-emerald-700" },
  degraded: { label: "Degraded performance", dot: "bg-amber-500", text: "text-amber-700" },
  outage: { label: "Outage", dot: "bg-rose-500", text: "text-rose-700" },
  maintenance: { label: "Maintenance", dot: "bg-sky-500", text: "text-sky-700" },
};

/** Deterministic daily bars: fewer bad days the higher the uptime. */
function uptimeBars(name: string, uptime: number, days = 60) {
  let seed = [...name].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
  // Use the high bits of the LCG; its low bits cycle with a short period.
  const rand = () => ((seed = (seed * 1103515245 + 12345) >>> 0) >>> 16) / 65536;
  // e.g. 99.7% uptime -> ~6% of days show an incident.
  const badRate = Math.min(1, Math.max(0, (100 - uptime) * 0.2));
  return Array.from({ length: days }, () => {
    const r = rand();
    return r < badRate * 0.3 ? "bg-rose-400" : r < badRate ? "bg-amber-400" : "bg-emerald-400";
  });
}

const Status = ({ b, tint }: { b: Block; tint: boolean }) => {
  const items = rows(b.items);
  const worst = items.some((i) => s(i.status) === "outage") ? "outage" : items.some((i) => s(i.status) === "degraded") ? "degraded" : items.some((i) => s(i.status) === "maintenance") ? "maintenance" : "operational";
  const banner = {
    operational: ["bg-emerald-500", "All systems operational"],
    degraded: ["bg-amber-500", "Some systems are degraded"],
    outage: ["bg-rose-500", "Partial outage in progress"],
    maintenance: ["bg-sky-500", "Scheduled maintenance in progress"],
  }[worst];
  return (
    <Section tint={tint}>
      <BlockHeading b={b} />
      <div className="mx-auto max-w-4xl">
        <div className={`flex items-center gap-3 rounded-2xl ${banner[0]} px-5 py-4 text-white shadow-lg`}>
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
          </span>
          <span className="font-semibold">{banner[1]}</span>
        </div>
        <div className="mt-6 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {items.map((it) => {
            const st = STATUS[s(it.status)] ?? STATUS.operational;
            const up = Number(it.uptime) || 100;
            return (
              <div key={it.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-ink">{s(it.name)}</span>
                  <span className={`flex items-center gap-2 text-sm font-medium ${st.text}`}>
                    <span className={`h-2 w-2 rounded-full ${st.dot}`} /> {st.label}
                  </span>
                </div>
                <div className="mt-3 flex h-8 gap-[2px]">
                  {uptimeBars(s(it.name), up).map((c, i) => (
                    <span key={i} className={`flex-1 rounded-sm ${c} opacity-80 transition hover:opacity-100`} />
                  ))}
                </div>
                <div className="mt-1.5 flex justify-between text-[11px] text-muted">
                  <span>60 days ago</span>
                  <span className="font-semibold text-ink">{up.toFixed(2)}% uptime</span>
                  <span>Today</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};

const RichText = ({ b, tint }: { b: Block; tint: boolean }) => (
  <Section tint={tint}>
    <Reveal className="mx-auto max-w-3xl">
      {s(b.eyebrow) && <Eyebrow>{s(b.eyebrow)}</Eyebrow>}
      {s(b.title) && <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink text-balance sm:text-4xl">{s(b.title)}</h2>}
      {lines(b.paragraphs).map((p, i) => (
        <p key={i} className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{p}</p>
      ))}
    </Reveal>
  </Section>
);

const Logos = ({ b }: { b: Block }) => {
  const names = lines(b.items);
  if (!names.length) return null;
  return (
    <section className="border-y border-slate-100 bg-white py-10">
      {s(b.title) && <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted">{s(b.title)}</p>}
      <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max gap-4 animate-marquee hover:[animation-play-state:paused]">
          {[...names, ...names, ...names].map((n, i) => (
            <span key={i} className="flex items-center gap-2 rounded-full border border-slate-200 bg-surface px-5 py-2.5 text-sm font-semibold text-slate-600">
              <Sparkles className="h-4 w-4 text-brand" /> {n}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

const Cta = ({ b }: { b: Block }) => (
  <section className="relative overflow-hidden bg-brand py-20 sm:py-24">
    <div className="dot-bg absolute inset-0" />
    <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-accent/30 blur-3xl" />
    <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-dark/60 blur-3xl" />
    <Container className="relative max-w-3xl text-center">
      <Reveal>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-white text-balance sm:text-5xl">{s(b.title)}</h2>
        {s(b.text) && <p className="mx-auto mt-5 max-w-xl text-white/80">{s(b.text)}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {s(b.primary) && (
            <Href href={s(b.primaryHref)} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-brand shadow-xl transition hover:-translate-y-0.5">
              <Calendar className="h-4 w-4" /> {s(b.primary)}
            </Href>
          )}
          {s(b.secondary) && (
            <Href href={s(b.secondaryHref)} className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-black/20">
              <MessageCircle className="h-4 w-4" /> {s(b.secondary)}
            </Href>
          )}
        </div>
      </Reveal>
    </Container>
  </section>
);

// Full-bleed blocks don't take part in the white/grey alternation.
const FULL_BLEED = new Set(["stats", "cta", "logos"]);

export function Blocks({ blocks, c }: { blocks: Block[]; c: Content }) {
  let light = 0;
  return (
    <>
      {blocks
        .filter((b) => b.visible)
        .map((b) => {
          const tint = FULL_BLEED.has(b.type) ? false : light++ % 2 === 1;
          switch (b.type) {
            case "features": return <Features key={b.id} b={b} tint={tint} />;
            case "stats": return <Stats key={b.id} b={b} />;
            case "split": return <Split key={b.id} b={b} tint={tint} />;
            case "steps": return <Steps key={b.id} b={b} tint={tint} />;
            case "compare": return <Compare key={b.id} b={b} tint={tint} />;
            case "coverage": return <Coverage key={b.id} b={b} tint={tint} />;
            case "endpoints": return <Endpoints key={b.id} b={b} tint={tint} c={c} />;
            case "cards": return <Cards key={b.id} b={b} tint={tint} />;
            case "faq": return <Faq key={b.id} b={b} tint={tint} />;
            case "timeline": return <Timeline key={b.id} b={b} tint={tint} />;
            case "status": return <Status key={b.id} b={b} tint={tint} />;
            case "richtext": return <RichText key={b.id} b={b} tint={tint} />;
            case "logos": return <Logos key={b.id} b={b} />;
            case "cta": return <Cta key={b.id} b={b} />;
            default: return null;
          }
        })}
    </>
  );
}
