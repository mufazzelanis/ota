"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { Icon, TONES } from "@/lib/icons";
import type { NavItem, Product } from "@/lib/types";
import { Logo } from "./heading";

type NavProduct = Pick<Product, "slug" | "name" | "icon" | "tone" | "short">;
type Panel = { id: string; left: number; top: number; width: number };

const GUTTER = 16;
// Server render and first paint use the lg breakpoint; after mount we measure.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function Badge({ text }: { text: string }) {
  if (!text) return null;
  return <span className="rounded-full bg-accent px-1.5 py-px text-[10px] font-bold uppercase leading-4 text-accent-ink">{text}</span>;
}

const labelCls = (n: NavItem) =>
  `flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
    n.highlight ? "text-accent hover:brightness-110" : "text-white/80 hover:text-white"
  }`;

export function Navbar({
  brandName,
  logoText,
  ctaLabel,
  products,
  nav,
}: {
  brandName: string;
  logoText: string;
  ctaLabel: string;
  products: NavProduct[];
  nav: NavItem[];
}) {
  const items = nav.filter((n) => n.visible);
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [panel, setPanel] = useState<Panel | null>(null);
  // null until measured: CSS breakpoints decide; afterwards measurement decides.
  const [compact, setCompact] = useState<boolean | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef(new Map<string, HTMLElement>());
  const closeTimer = useRef<number | null>(null);

  // ── Decide desktop vs. hamburger by whether the links actually fit ────────
  const measure = useCallback(() => {
    const navEl = navRef.current;
    const row = measureRef.current;
    if (!navEl || !row) return;
    const styles = getComputedStyle(navEl);
    const inner = navEl.clientWidth - parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
    const used = (logoRef.current?.offsetWidth ?? 0) + (actionsRef.current?.offsetWidth ?? 0);
    const needed = row.scrollWidth + 48; // breathing room between groups
    // Never show the full row on small screens, even if few items.
    const isCompact = window.innerWidth < 1024 || used + needed > inner;
    setCompact(isCompact);
    if (!isCompact) setDrawer(false);
  }, []);

  useIsoLayoutEffect(() => {
    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    if (navRef.current) ro.observe(navRef.current);
    if (measureRef.current) ro.observe(measureRef.current);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [measure, items.length]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock page scroll behind the drawer, and close it if we switch to desktop.
  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  // ── Dropdown positioning: clamp the panel inside the viewport ──────────────
  const openPanel = useCallback(
    (id: string) => {
      const trigger = triggerRefs.current.get(id);
      const header = headerRef.current;
      if (!trigger || !header) return;
      const item = items.find((n) => n.id === id);
      const vw = document.documentElement.clientWidth;
      const desired = item?.type === "products" ? 720 : (item?.children.length ?? 0) > 3 ? 560 : 340;
      const width = Math.min(desired, vw - GUTTER * 2);
      const t = trigger.getBoundingClientRect();
      const left = Math.min(Math.max(t.left + t.width / 2 - width / 2, GUTTER), vw - width - GUTTER);
      setPanel({ id, left, width, top: header.getBoundingClientRect().bottom });
    },
    [items],
  );

  const enter = (id: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openPanel(id);
  };
  const leave = () => {
    closeTimer.current = window.setTimeout(() => setPanel(null), 140);
  };

  useEffect(() => {
    if (!panel) return;
    const reposition = () => openPanel(panel.id);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel(null);
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setPanel(null);
    };
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, { passive: true });
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [panel, openPanel]);

  useEffect(() => {
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer]);

  const showDesktop = compact === null ? "hidden lg:flex" : compact ? "hidden" : "flex";
  const showBurger = compact === null ? "lg:hidden" : compact ? "" : "hidden";
  const openItem = panel ? items.find((n) => n.id === panel.id) : undefined;

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || panel ? "border-b border-white/10 bg-brand-dark/90 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      {/* Off-screen copy of the links, used only to measure how wide the row needs to be. */}
      <div className="pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden" aria-hidden>
        <div ref={measureRef} className="invisible flex w-max gap-0.5">
          {items.map((n) => (
            <span key={n.id} className={labelCls(n)}>
              {n.label} <Badge text={n.badge} />
              {n.type !== "link" && <ChevronDown className="h-4 w-4" />}
            </span>
          ))}
        </div>
      </div>

      <nav ref={navRef} className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-18 lg:px-8">
        <Link ref={logoRef} href="/" aria-label={`${brandName} home`} className="min-w-0 shrink-0">
          <Logo text={logoText} name={brandName} />
        </Link>

        <div className={`${showDesktop} min-w-0 items-center gap-0.5`}>
          {items.map((n) => {
            if (n.type === "link") {
              return (
                <Link key={n.id} href={n.href || "/"} className={labelCls(n)} onMouseEnter={() => setPanel(null)}>
                  {n.label} <Badge text={n.badge} />
                </Link>
              );
            }
            const isOpen = panel?.id === n.id;
            return (
              <div key={n.id} onMouseEnter={() => enter(n.id)} onMouseLeave={leave}>
                <button
                  ref={(el) => {
                    if (el) triggerRefs.current.set(n.id, el);
                    else triggerRefs.current.delete(n.id);
                  }}
                  className={labelCls(n)}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={() => (isOpen ? setPanel(null) : openPanel(n.id))}
                >
                  {n.label} <Badge text={n.badge} />
                  <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && openItem && panel && (
                  <DropdownPanel item={openItem} panel={panel} products={products} onNavigate={() => setPanel(null)} />
                )}
              </div>
            );
          })}
        </div>

        <div ref={actionsRef} className="flex shrink-0 items-center gap-2">
          <Link
            href="/contact"
            className="hidden items-center gap-2 whitespace-nowrap rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink shadow-lg shadow-accent/25 transition hover:brightness-105 sm:inline-flex"
          >
            {ctaLabel}
          </Link>
          <button className={`${showBurger} grid h-10 w-10 place-items-center rounded-lg text-white`} onClick={() => setDrawer(true)} aria-label="Open menu" aria-expanded={drawer}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Drawer: clipped and non-interactive while closed so it never adds width. */}
      <div className={`fixed inset-0 z-50 overflow-hidden ${drawer ? "visible" : "invisible pointer-events-none delay-300"}`}>
        <div className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${drawer ? "opacity-100" : "opacity-0"}`} onClick={() => setDrawer(false)} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`absolute right-0 top-0 flex h-dvh w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 sm:w-[86%] ${
            drawer ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b px-5">
            <Logo text={logoText} name={brandName} light={false} />
            <button onClick={() => setDrawer(false)} aria-label="Close menu" className="grid h-10 w-10 place-items-center rounded-lg hover:bg-slate-100">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain p-3">
            {items.map((n) => {
              if (n.type === "link") {
                return (
                  <Link key={n.id} href={n.href || "/"} onClick={() => setDrawer(false)} className={`flex items-center gap-2 rounded-lg px-3 py-3 text-base font-medium hover:bg-slate-50 ${n.highlight ? "text-brand" : "text-ink"}`}>
                    {n.label} <Badge text={n.badge} />
                  </Link>
                );
              }
              const isExp = expanded === n.id;
              const children =
                n.type === "products"
                  ? products.map((p) => ({ id: p.slug, label: p.name, href: `/products/${p.slug}`, icon: p.icon }))
                  : n.children;
              return (
                <div key={n.id}>
                  <button
                    onClick={() => setExpanded(isExp ? null : n.id)}
                    aria-expanded={isExp}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium hover:bg-slate-50 ${n.highlight ? "text-brand" : "text-ink"}`}
                  >
                    <span className="flex items-center gap-2">{n.label} <Badge text={n.badge} /></span>
                    <ChevronDown className={`h-5 w-5 text-slate-400 transition ${isExp ? "rotate-180" : ""}`} />
                  </button>
                  <div className={`grid transition-all duration-300 ${isExp ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="mb-2 ml-3 border-l-2 border-slate-100 pl-2">
                        {children.map((ch) => (
                          <Link key={ch.id} href={ch.href || "/"} onClick={() => setDrawer(false)} className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-brand/10 text-brand">
                              <Icon name={ch.icon} className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 truncate">{ch.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="shrink-0 border-t p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <Link href="/contact" onClick={() => setDrawer(false)} className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 font-semibold text-white">
              {ctaLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function DropdownPanel({ item, panel, products, onNavigate }: { item: NavItem; panel: Panel; products: NavProduct[]; onNavigate: () => void }) {
  const isProducts = item.type === "products";
  const twoCols = isProducts ? panel.width >= 600 : item.children.length > 3 && panel.width >= 520;
  return (
    <div data-dropdown className="fixed z-50 pt-2 animate-fade-up" style={{ left: panel.left, top: panel.top - 8, width: panel.width }}>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-black/25">
        <div className={`grid max-h-[min(70vh,560px)] gap-1 overflow-y-auto p-3 ${twoCols ? "grid-cols-2" : "grid-cols-1"}`}>
          {isProducts
            ? products.slice(0, 8).map((p) => (
                <Link key={p.slug} href={`/products/${p.slug}`} onClick={onNavigate} className="group flex gap-3 rounded-xl p-3 transition hover:bg-slate-50">
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${TONES[p.tone].bg} ${TONES[p.tone].text}`}>
                    <Icon name={p.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink">{p.name}</span>
                    <span className="line-clamp-2 text-xs text-muted">{p.short}</span>
                  </span>
                </Link>
              ))
            : item.children.map((ch) => (
                <Link key={ch.id} href={ch.href || "/"} onClick={onNavigate} className="group flex gap-3 rounded-xl p-3 transition hover:bg-slate-50">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white">
                    <Icon name={ch.icon} className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink">{ch.label}</span>
                    {ch.description && <span className="line-clamp-2 text-xs text-muted">{ch.description}</span>}
                  </span>
                </Link>
              ))}
        </div>
        <Link
          href={isProducts ? "/#products" : "/contact"}
          onClick={onNavigate}
          className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3 text-sm font-semibold text-brand hover:bg-slate-100"
        >
          {isProducts ? `View all ${products.length} products` : "Talk to an integration engineer"} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
