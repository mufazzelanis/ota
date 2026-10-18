import { Container } from "./heading";

/** Instant shell shown while a page's URL-specific content streams in. */
export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <section className="hero-bg pt-28 pb-20 lg:pt-36 lg:pb-24">
        <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="animate-pulse">
            <div className="h-3 w-40 rounded bg-white/10" />
            <div className="mt-6 h-7 w-48 rounded-full bg-white/10" />
            <div className="mt-6 h-12 w-full max-w-lg rounded-xl bg-white/15" />
            <div className="mt-3 h-12 w-3/4 max-w-md rounded-xl bg-accent/30" />
            <div className="mt-6 h-4 w-full max-w-xl rounded bg-white/10" />
            <div className="mt-2 h-4 w-5/6 max-w-lg rounded bg-white/10" />
            <div className="mt-8 flex gap-3">
              <div className="h-12 w-44 rounded-full bg-accent/40" />
              <div className="h-12 w-36 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="hidden aspect-square w-full max-w-[420px] animate-pulse justify-self-center rounded-full border border-white/10 bg-white/5 lg:block" />
        </Container>
      </section>
      <Container className="grid animate-pulse gap-5 py-20 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-44 rounded-2xl bg-slate-100" />
        ))}
      </Container>
    </div>
  );
}
