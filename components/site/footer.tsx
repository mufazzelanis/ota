import Link from "next/link";
import type { CSSProperties } from "react";
import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";
import type { Content } from "@/lib/types";
import { Container, Logo } from "./heading";

const COMPANY = [
  { label: "About", href: "/#about" },
  { label: "Use cases", href: "/#usecases" },
  { label: "Why us", href: "/#why" },
  { label: "How it works", href: "/#steps" },
  { label: "FAQ", href: "/#faq" },
  { label: "Request API Access", href: "/contact" },
];

function Social({ href, label, path }: { href: string; label: string; path: string }) {
  return (
    <a href={href} aria-label={label} className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-white/60 transition hover:bg-brand hover:text-white">
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
        <path d={path} />
      </svg>
    </a>
  );
}

export function Footer({ c }: { c: Content }) {
  const s = c.settings;
  const products = c.products.filter((p) => p.visible);
  // Every visible dropdown in the header becomes a footer column.
  const navColumns = c.navigation.filter((n) => n.visible && n.type === "dropdown" && n.children.length);
  return (
    <footer className="bg-[color-mix(in_oklab,var(--brand-dark)_60%,black)] text-white/60">
      <div className="h-1 bg-linear-to-r from-brand via-accent to-brand" />
      <Container
        className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-(--footer-cols)"
        style={{ "--footer-cols": `1.5fr repeat(${3 + navColumns.length}, minmax(0, 1fr))` } as CSSProperties}
      >
        <div className="sm:col-span-2 lg:col-span-4 xl:col-span-1">
          <Logo text={s.logoText} name={s.brandName} />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{s.description}</p>
          <p className="mt-3 text-xs text-white/40">A division of {s.company}</p>
          <div className="mt-6 flex gap-2">
            <Social href={s.facebook} label="Facebook" path="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v9h4v-9h3l1-4h-4V9c0-.6.4-1 1-1z" />
            <Social href={s.linkedin} label="LinkedIn" path="M4 3a2 2 0 110 4 2 2 0 010-4zM3 8h3v13H3zM9 8h3v2c.6-1.1 2-2.2 4-2.2 3.4 0 4 2.2 4 5.1V21h-3v-7c0-1.7 0-3.6-2.2-3.6S12 12 12 13.9V21H9z" />
            <Social href={s.youtube} label="YouTube" path="M23 7.5a3 3 0 00-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 001 7.5 31 31 0 00.6 12 31 31 0 001 16.5a3 3 0 002.1 2.1C5 19 12 19 12 19s7 0 8.9-.4a3 3 0 002.1-2.1c.4-1.5.4-4.5.4-4.5s0-3-.4-4.5zM9.8 15V9l5.2 3z" />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Products</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {products.slice(0, 7).map((p) => (
              <li key={p.id}>
                <Link href={`/products/${p.slug}`} className="transition hover:text-white">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {navColumns.map((col) => (
          <div key={col.id}>
            <h4 className="text-sm font-semibold text-white">{col.label}</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.children.map((ch) => (
                <li key={ch.id}>
                  <Link href={ch.href || "/"} className="transition hover:text-white">
                    {ch.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h4 className="text-sm font-semibold text-white">Company</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {COMPANY.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0 [overflow-wrap:anywhere]">
          <h4 className="text-sm font-semibold text-white">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span className="whitespace-pre-line">{s.address}</span>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a href={`mailto:${s.email}`} className="hover:text-white">{s.email}</a>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="hover:text-white">{s.phone}</a>
            </li>
            <li className="flex gap-2.5">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`} className="hover:text-white">WhatsApp {s.whatsapp}</a>
            </li>
          </ul>
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-white/10 py-6 text-xs sm:flex-row sm:justify-between">
        <span>Copyright © {s.brandName}. All rights reserved.</span>
        <span>{s.footerNote}</span>
      </Container>
    </footer>
  );
}
