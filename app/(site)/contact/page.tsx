import type { Metadata } from "next";
import { Clock, KeyRound, Mail, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { getContent } from "@/lib/content";
import { Container } from "@/components/site/heading";
import { LeadForm } from "@/components/site/lead-form";

export const metadata: Metadata = { title: "Request API Access" };

const PERKS = [
  { icon: KeyRound, title: "Sandbox keys same day", text: "Start building against production-identical schemas." },
  { icon: Clock, title: "30-minute kick-off call", text: "Scope your markets, volumes and go-live plan." },
  { icon: ShieldCheck, title: "No commitment", text: "Free sandbox. Pay a flat fee only when you book." },
];

export default async function ContactPage() {
  const c = await getContent();
  const s = c.settings;
  return (
    <section className="hero-bg relative pt-32 pb-24 lg:pt-40">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.15fr]">
        <div className="text-white">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Request access</span>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">Let&apos;s get you building.</h1>
          <p className="mt-5 max-w-md text-lg text-white/70">{c.cta.text}</p>
          <ul className="mt-10 space-y-6">
            {PERKS.map(({ icon: I, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/10 text-accent">
                  <I className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold">{title}</span>
                  <span className="block text-sm text-white/60">{text}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-10 grid gap-3 text-sm text-white/70 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <a href={`mailto:${s.email}`} className="flex items-center gap-2 hover:text-white"><Mail className="h-4 w-4 text-accent" />{s.email}</a>
            <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-white"><Phone className="h-4 w-4 text-accent" />{s.phone}</a>
            <a href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`} className="flex items-center gap-2 hover:text-white"><MessageCircle className="h-4 w-4 text-accent" />WhatsApp</a>
          </div>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-2xl shadow-black/30 sm:p-10">
          <h2 className="font-display text-2xl font-bold text-ink">Request sandbox access</h2>
          <p className="mt-1 text-sm text-muted">Takes under a minute. We reply within one business day.</p>
          <div className="mt-8">
            <LeadForm products={c.products.filter((p) => p.visible).map((p) => p.name.replace(/ API$/, ""))} />
          </div>
        </div>
      </Container>
    </section>
  );
}
