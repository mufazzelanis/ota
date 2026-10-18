import type { Theme } from "./types";

export type ThemePreset = Theme & { name: string; note: string };

// The four palettes the brand team shortlisted. `dark` drives hero/footer
// surfaces, `brand` drives buttons and links, `accent` highlights deals and CTAs.
export const THEME_PRESETS: ThemePreset[] = [
  {
    preset: "trust",
    name: "Trust & Travel",
    note: "Navy + Teal + Gold. Modern, trustworthy OTA brand.",
    dark: "#0B2545",
    brand: "#087E8B",
    accent: "#F4B942",
    accentInk: "#1A1300",
  },
  {
    preset: "premium",
    name: "Premium & Professional",
    note: "Royal Blue + Orange. Energetic, sales-focused.",
    dark: "#0A1A3F",
    brand: "#155EEF",
    accent: "#FF7A00",
    accentInk: "#1F0E00",
  },
  {
    preset: "airline",
    name: "Airline & Corporate",
    note: "Deep Blue + Sky Blue. Clean, established, corporate.",
    dark: "#002447",
    brand: "#003B73",
    accent: "#38BDF8",
    accentInk: "#00223F",
  },
  {
    preset: "friendly",
    name: "Affordable & Friendly",
    note: "Green + Forest + Yellow. Budget-friendly, local deals.",
    dark: "#142D24",
    brand: "#15803D",
    accent: "#FACC15",
    accentInk: "#1C1600",
  },
];

export function themeToCss(theme: Theme): Record<string, string> {
  return {
    "--brand-dark": theme.dark,
    "--brand": theme.brand,
    "--accent": theme.accent,
    "--accent-ink": theme.accentInk,
  };
}
