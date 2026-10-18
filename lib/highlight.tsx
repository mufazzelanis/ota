import type { ReactNode } from "react";

const TOKEN = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?)/g;

export function highlight(src: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of src.matchAll(TOKEN)) {
    if (m.index! > last) out.push(src.slice(last, m.index));
    if (m[1]) {
      out.push(
        <span key={i++} className={m[2] ? "text-sky-300" : "text-emerald-300"}>
          {m[1]}
        </span>,
      );
      if (m[2]) out.push(m[2]);
    } else if (m[3]) {
      out.push(<span key={i++} className="text-violet-300">{m[3]}</span>);
    } else if (m[4]) {
      out.push(<span key={i++} className="text-amber-300">{m[4]}</span>);
    }
    last = m.index! + m[0].length;
  }
  out.push(src.slice(last));
  return out;
}
