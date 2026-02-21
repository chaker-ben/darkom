import { Card, CardBody, Skeleton } from '@darkom/ui';

export default function Loading() {
  return (
    <main className="min-h-screen">
      {/* Hero skeleton */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <Skeleton className="mb-6 h-8 w-64 rounded-full bg-white/10" />
          <Skeleton className="mb-4 h-14 w-96 bg-white/10" />
          <Skeleton className="mb-8 h-6 w-80 bg-white/10" />
          <Skeleton className="h-14 w-full max-w-2xl rounded-2xl bg-white/10" />
        </div>
      </section>

      {/* Content skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full rounded-none" />
              <CardBody>
                <Skeleton className="mb-2 h-5 w-24" />
                <Skeleton className="mb-1 h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </CardBody>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
