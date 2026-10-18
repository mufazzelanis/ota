import {
  Plane, Building2, Car, CarFront, Ticket, Map, TrainFront, Stamp, Sofa, FastForward,
  Handshake, QrCode, Trophy, Rocket, GitMerge, Layers, TrendingUp, Monitor, Briefcase,
  Lightbulb, ShoppingCart, Cpu, Globe, Code2, ShieldCheck, Sparkles, Zap, Hotel, Wallet,
  Headphones, Lock, BarChart3, Users, Star, Compass, Luggage,
  type LucideIcon,
} from "lucide-react";
import type { Tone } from "./types";

export const ICONS: Record<string, LucideIcon> = {
  plane: Plane,
  building: Building2,
  hotel: Hotel,
  car: Car,
  carFront: CarFront,
  ticket: Ticket,
  map: Map,
  train: TrainFront,
  stamp: Stamp,
  sofa: Sofa,
  fast: FastForward,
  handshake: Handshake,
  qr: QrCode,
  trophy: Trophy,
  rocket: Rocket,
  merge: GitMerge,
  layers: Layers,
  trending: TrendingUp,
  monitor: Monitor,
  briefcase: Briefcase,
  bulb: Lightbulb,
  cart: ShoppingCart,
  cpu: Cpu,
  globe: Globe,
  code: Code2,
  shield: ShieldCheck,
  sparkles: Sparkles,
  zap: Zap,
  wallet: Wallet,
  support: Headphones,
  lock: Lock,
  chart: BarChart3,
  users: Users,
  star: Star,
  compass: Compass,
  luggage: Luggage,
};

export const ICON_NAMES = Object.keys(ICONS);

export function Icon({ name, className }: { name: string; className?: string }) {
  const C = ICONS[name] ?? Sparkles;
  return <C className={className} aria-hidden />;
}

// Literal class strings so Tailwind can see them.
export const TONES: Record<Tone, { text: string; bg: string; ring: string }> = {
  brand: { text: "text-brand", bg: "bg-brand/10", ring: "group-hover:ring-brand/40" },
  accent: { text: "text-amber-600", bg: "bg-accent/20", ring: "group-hover:ring-accent/60" },
  rose: { text: "text-rose-600", bg: "bg-rose-50", ring: "group-hover:ring-rose-300" },
  violet: { text: "text-violet-600", bg: "bg-violet-50", ring: "group-hover:ring-violet-300" },
  sky: { text: "text-sky-600", bg: "bg-sky-50", ring: "group-hover:ring-sky-300" },
  emerald: { text: "text-emerald-600", bg: "bg-emerald-50", ring: "group-hover:ring-emerald-300" },
  amber: { text: "text-amber-600", bg: "bg-amber-50", ring: "group-hover:ring-amber-300" },
  indigo: { text: "text-indigo-600", bg: "bg-indigo-50", ring: "group-hover:ring-indigo-300" },
};

export const TONE_NAMES = Object.keys(TONES) as Tone[];
