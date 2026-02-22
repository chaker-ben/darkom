import { Card, CardBody, Skeleton } from '@darkom/ui';

export function ListingCardSkeleton() {
  return (
    <Card>
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <CardBody>
        <Skeleton className="mb-2 h-5 w-24" />
        <Skeleton className="mb-1 h-4 w-full" />
        <Skeleton className="mb-3 h-3 w-2/3" />
        <div className="flex gap-3">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-14" />
        </div>
      </CardBody>
    </Card>
  );
}
