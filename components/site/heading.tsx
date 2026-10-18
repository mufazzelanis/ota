import type { CSSProperties, ReactNode } from "react";
import type { SectionHeading } from "@/lib/types";
import { Reveal } from "./reveal";

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] ${
        dark ? "text-accent" : "text-brand"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dark ? "bg-accent" : "bg-brand"}`} />
      {children}
    </span>
  );
}

export function Heading({
  heading,
  align = "center",
  dark = false,
  aside,
}: {
  heading: SectionHeading;
  align?: "center" | "left";
  dark?: boolean;
  aside?: ReactNode;
}) {
  const center = align === "center";
  return (
    <Reveal className={`mb-12 flex flex-col gap-6 ${center ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}>
      <div className={center ? "mx-auto max-w-2xl" : "max-w-2xl"}>
        {heading.eyebrow && <Eyebrow dark={dark}>{heading.eyebrow}</Eyebrow>}
        <h2
          className={`mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl ${
            dark ? "text-white" : "text-ink"
          }`}
        >
          {heading.title}
        </h2>
        {heading.subtitle && (
          <p className={`mt-4 text-base leading-relaxed text-pretty sm:text-lg ${dark ? "text-white/70" : "text-muted"}`}>
            {heading.subtitle}
          </p>
        )}
      </div>
      {aside}
    </Reveal>
  );
}

export function Container({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`} style={style}>{children}</div>;
}

export function Logo({ text, name, light = true }: { text: string; name: string; light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-brand font-display text-sm font-extrabold text-white shadow-lg shadow-brand/30">
        <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-accent/90" />
        <span className="relative">{text}</span>
      </span>
      <span className={`font-display text-lg font-bold tracking-tight ${light ? "text-white" : "text-ink"}`}>{name}</span>
    </span>
  );
}
