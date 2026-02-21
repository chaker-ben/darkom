import type { HTMLAttributes } from 'react';

import { cn } from '../lib/utils';


export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded bg-neutral-200 dark:bg-neutral-700', className)}
      {...props}
    />
  );
}
