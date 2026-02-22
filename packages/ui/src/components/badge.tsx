import type { HTMLAttributes } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '../lib/utils';

import type { VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center rounded-[var(--radius-badge)] font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary-100 text-primary-700',
        secondary: 'bg-neutral-100 text-neutral-700',
        overlay: 'bg-black/60 text-white backdrop-blur-sm',
        verified: 'bg-success-50 text-success-700',
        featured: 'bg-accent-100 text-accent-700',
        warning: 'bg-accent-100 text-accent-700',
        destructive: 'bg-red-100 text-red-700',
        category: 'border border-neutral-200 bg-white text-neutral-600',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  },
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    />
  );
}
