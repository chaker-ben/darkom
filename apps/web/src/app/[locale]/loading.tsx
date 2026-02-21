export default function Loading() {
  return (
    <main className="min-h-screen">
      {/* Hero skeleton */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mb-6 h-8 w-64 animate-pulse rounded-full bg-white/10" />
          <div className="mb-4 h-14 w-96 animate-pulse rounded bg-white/10" />
          <div className="mb-8 h-6 w-80 animate-pulse rounded bg-white/10" />
          <div className="h-14 w-full max-w-2xl animate-pulse rounded-2xl bg-white/10" />
        </div>
      </section>

      {/* Content skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-card">
              <div className="h-48 animate-pulse bg-neutral-100" />
              <div className="p-4">
                <div className="mb-2 h-5 w-24 animate-pulse rounded bg-neutral-100" />
                <div className="mb-1 h-4 w-full animate-pulse rounded bg-neutral-100" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
