import { Icon } from "@/lib/icons";
import { highlight } from "@/lib/highlight";

function pretty(code: string) {
  try {
    return JSON.stringify(JSON.parse(code), null, 2);
  } catch {
    return code;
  }
}

export function CodeWindow({ title, code, className = "" }: { title: string; code: string; className?: string }) {
  return (
    <div className={`gradient-border relative rounded-2xl bg-[#0b1220]/90 shadow-2xl shadow-black/40 backdrop-blur ${className}`}>
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400/90" />
          <span className="h-3 w-3 rounded-full bg-amber-400/90" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
        </div>
        <span className="truncate font-mono text-[11px] text-white/50">{title}</span>
      </div>
      <pre className="max-h-96 overflow-auto p-4 font-mono text-[12.5px] leading-relaxed text-white/80">{highlight(pretty(code))}</pre>
    </div>
  );
}

/** Concentric rings with icons orbiting a glowing core. Pure CSS animation. */
export function OrbitArt({ icons, label }: { icons: string[]; label: string }) {
  const inner = icons.slice(0, 3);
  const outer = icons.slice(3, 8);
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]" aria-hidden>
      <div className="absolute inset-0 rounded-full border border-white/10" />
      <div className="absolute inset-[18%] rounded-full border border-dashed border-white/15" />
      <div className="absolute inset-[36%] rounded-full bg-brand/30 blur-2xl" />

      {/* Outer ring */}
      <div className="absolute inset-0 animate-orbit">
        {outer.map((name, i) => {
          const a = (i / outer.length) * 2 * Math.PI;
          return (
            <span
              key={name + i}
              className="absolute grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-lg backdrop-blur animate-orbit-reverse"
              style={{ left: `${50 + 50 * Math.cos(a)}%`, top: `${50 + 50 * Math.sin(a)}%` }}
            >
              <Icon name={name} className="h-5 w-5" />
            </span>
          );
        })}
      </div>

      {/* Inner ring, opposite direction */}
      <div className="absolute inset-[18%] animate-orbit-reverse-slow">
        {inner.map((name, i) => {
          const a = (i / inner.length) * 2 * Math.PI + 0.6;
          return (
            <span
              key={name + i}
              className="absolute grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xl bg-accent text-accent-ink shadow-lg shadow-accent/30 animate-orbit-slow"
              style={{ left: `${50 + 50 * Math.cos(a)}%`, top: `${50 + 50 * Math.sin(a)}%` }}
            >
              <Icon name={name} className="h-5 w-5" />
            </span>
          );
        })}
      </div>

      {/* Core */}
      <div className="absolute inset-[34%] grid place-items-center rounded-full border border-white/20 bg-linear-to-br from-brand to-brand-dark shadow-2xl shadow-brand/40">
        <span className="text-center font-display text-sm font-bold leading-tight text-white">{label}</span>
      </div>
    </div>
  );
}
