import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

import { cva } from 'class-variance-authority';

import { cn } from '../lib/utils';

import type { VariantProps } from 'class-variance-authority';


export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-900',
        outline:
          'border border-neutral-200 bg-white text-neutral-700 hover:border-primary-300 hover:text-primary-700',
        accent:
          'bg-accent-400 text-primary-900 hover:bg-accent-500 active:bg-accent-600',
        ghost:
          'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
        success:
          'bg-success-500 text-white hover:bg-success-600 active:bg-success-700',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
