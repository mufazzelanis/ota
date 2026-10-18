import type { Activity } from "@/lib/types";

function ago(iso: string) {
  const s = Math.max(1, Math.round((Date.now() - Date.parse(iso)) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d < 30 ? `${d}d ago` : new Date(iso).toLocaleDateString();
}

export function ActivityList({ items, compact = false }: { items: Activity[]; compact?: boolean }) {
  if (!items.length) return <p className="py-8 text-center text-sm text-slate-400">No activity yet</p>;
  return (
    <ol className="relative space-y-4 border-l border-slate-200 pl-5">
      {items.map((a) => (
        <li key={a.id} className="relative">
          <span className="absolute -left-6.75 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] font-bold text-brand ring-2 ring-brand/20">
            {a.actorName[0]?.toUpperCase()}
          </span>
          <p className="text-sm text-slate-700">
            <span className="font-semibold text-slate-900">{a.actorName}</span> {a.action.toLowerCase()}
            {a.target && <span className="font-medium text-slate-900"> {a.target}</span>}
          </p>
          <p className="text-xs text-slate-400" title={new Date(a.at).toLocaleString()}>
            {compact ? ago(a.at) : new Date(a.at).toLocaleString()}
          </p>
        </li>
      ))}
    </ol>
  );
}
