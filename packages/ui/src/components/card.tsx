import type { HTMLAttributes } from 'react';

import { cn } from '../lib/utils';


export type CardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export function Card({ className, interactive, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[var(--radius-card)] bg-white shadow-card',
        interactive && 'transition-transform hover:-translate-y-1 hover:shadow-md cursor-pointer',
        className,
      )}
      {...props}
    />
  );
}

export type CardImageProps = HTMLAttributes<HTMLDivElement>;

export function CardImage({ className, ...props }: CardImageProps) {
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      {...props}
    />
  );
}

export type CardBodyProps = HTMLAttributes<HTMLDivElement>;

export function CardBody({ className, ...props }: CardBodyProps) {
  return <div className={cn('p-4', className)} {...props} />;
}

export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;

export function CardTitle({ className, ...props }: CardTitleProps) {
  return (
    <h3
      className={cn('font-semibold text-neutral-900 dark:text-neutral-50', className)}
      {...props}
    />
  );
}

export type CardMetaProps = HTMLAttributes<HTMLParagraphElement>;

export function CardMeta({ className, ...props }: CardMetaProps) {
  return (
    <p
      className={cn('text-sm text-neutral-500 dark:text-neutral-400', className)}
      {...props}
    />
  );
}
